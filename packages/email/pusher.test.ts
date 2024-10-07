import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { type AMQPChannel, AMQPClient } from "@cloudamqp/amqp-client";
import { MessagePackSerializer } from "@deweazer/serializer";
import {
	BunContainerOrchestrator,
	spawnRabbitMQ,
} from "@deweazer/spawn/container";
import type { SendMailOptions } from "nodemailer";
import { QUEUE_PREFIX } from "./broker";
import { createEmailPusher } from "./pusher";

const mq = new BunContainerOrchestrator<{
	client: AMQPClient;
	channel: AMQPChannel;
}>(spawnRabbitMQ.bind(null, "mq"), "deweazer.email.test.mq")
	.onStart(async (vars) => {
		vars.client = new AMQPClient("amqp://localhost");
		await vars.client.connect();
		vars.channel = await vars.client.channel();
	})
	.onStop(async (vars) => {
		await vars.channel.close();
		await vars.client.close();
	})
	.orchestrate();

describe(createEmailPusher.name, async () => {
	beforeEach(async () => {
		await mq.channel.queueDelete(QUEUE_PREFIX + email);
	});

	const email = "noreply@deweazer.io";
	it("should be able to push corrent messages", async () => {
		const messages = Array(10000)
			.fill(0)
			.map(
				() =>
					({
						text: crypto.randomUUID(),
						to: "spam.target@localhost.io",
					}) satisfies SendMailOptions,
			);

		// we are defining the subscriber first to make sure sink is available
		// to be able to push 10K messages. 😂
		const queue = await mq.channel.queue(QUEUE_PREFIX + email);
		const messageIter = Object.entries(messages)[Symbol.iterator]();
		const consumer = await queue.subscribe({ noAck: true }, async (msg) => {
			const [index, message] = messageIter.next().value!;
			expect(msg.body).not.toBeNull();
			if (msg.body != null) {
				const got = MessagePackSerializer.serializer.deserialize(
					Buffer.from(msg.body),
				);
				expect(got).toEqual(message);
			}

			if (Number(index) + 1 === messages.length) await consumer.cancel();
		});

		const sender = await createEmailPusher(mq.channel, email);
		const publishSpy = spyOn(sender.queue, "publish");

		expect(publishSpy).toHaveBeenCalledTimes(0);
		await Promise.all(messages.map(sender.send.bind(sender)));
		expect(publishSpy).toHaveBeenCalledTimes(messages.length);

		await consumer.wait(5000);
	});

	it(
		"should be able to push at minimum 200K msgpack-encoded 72-bytes messages in a single node I/O under 15s with AMD Ryzen 5 🗿",
		async () => {
			const messages = Array(200000)
				.fill(0)
				.map(
					() =>
						({
							text: crypto.randomUUID(),
							to: "spam.target@localhost.io",
						}) satisfies SendMailOptions,
				);

			// allow local machine to bear the burden by purging it
			// instead of consuming it
			const purger = setInterval(
				() => mq.channel.queuePurge(QUEUE_PREFIX + email),
				200,
			);

			const sender = await createEmailPusher(mq.channel, email);
			const publishSpy = spyOn(sender.queue, "publish");

			expect(publishSpy).toHaveBeenCalledTimes(0);
			await Promise.all(messages.map(sender.send.bind(sender)));
			expect(publishSpy).toHaveBeenCalledTimes(messages.length);

			clearInterval(purger);
		},
		{ timeout: 15000 },
	);
});
