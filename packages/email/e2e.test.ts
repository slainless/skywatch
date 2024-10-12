import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { MessagePackSerializer } from "@skywatch/serializer";
import ky from "ky";
import { type SendMailOptions, createTransport } from "nodemailer";
import { QUEUE_PREFIX } from "./broker";
import { createEmailPusher } from "./pusher";
import { createEmailSender } from "./sender";
import { MailHog, RabbitMQ } from "./test/container";

const mq = RabbitMQ().orchestrate();
const mh = MailHog().orchestrate();

const mailhog = ky.create({ prefixUrl: "http://localhost:8025/api/v1" });

const serializer = MessagePackSerializer.serializer;
const createMail = <T extends SendMailOptions>(mail: T) => mail;

beforeEach(async () => {
	await mailhog.delete("messages");
	await mq.channel.queueDelete(QUEUE_PREFIX + email);
});

const email = "noreply@localhost";
const mail = createMail({
	from: email,
	to: "aiman.fauzy@localhost",
	subject: "Hello, World!",
	text: "😁😁😁😁リムルは真の竜種に進化した🗿💀😱🤦‍♂️🌖🤣",
});

describe("E2E on same process", () => {
	it("should be able to proceed with same channel", async () => {
		const transport = createTransport({
			port: 1025,
			host: "localhost",
			secure: false,
			ignoreTLS: true,
		});

		const pusher = await createEmailPusher(mq.channel, email);
		const sender = await createEmailSender(mq.channel, email, transport);

		await sender.startSending();
		await pusher.send(mail);
		await Bun.sleep(300);

		const messages = await mailhog.get("messages").json<any>();
		expect(messages).toBeArrayOfSize(1);

		const got = messages[0];
		expect(`${got.From.Mailbox}@${got.From.Domain}`).toBe(mail.from);
		expect(`${got.To[0].Mailbox}@${got.To[0].Domain}`).toBe(mail.to);
		expect(Buffer.from(got.Content.Body, "base64").toString()).toBe(mail.text);
	});

	it("should be able to proceed with different channel", async () => {
		const transport = createTransport({
			port: 1025,
			host: "localhost",
			secure: false,
			ignoreTLS: true,
		});

		const pushChannel = await mq.client.channel(2);
		const pullChannel = await mq.client.channel(3);

		const pusher = await createEmailPusher(pushChannel, email);
		const sender = await createEmailSender(pullChannel, email, transport);

		await sender.startSending();
		await pusher.send(mail);
		await Bun.sleep(300);

		const messages = await mailhog.get("messages").json<any>();
		expect(messages).toBeArrayOfSize(1);

		const got = messages[0];
		expect(`${got.From.Mailbox}@${got.From.Domain}`).toBe(mail.from);
		expect(`${got.To[0].Mailbox}@${got.To[0].Domain}`).toBe(mail.to);
		expect(Buffer.from(got.Content.Body, "base64").toString()).toBe(mail.text);
	});
});

describe("E2E with worker", () => {
	it("should be able to proceed when ran on different context", async () => {
		const mails = Object.fromEntries(
			Array(100)
				.fill(0)
				.map((_) => {
					const subject = crypto.randomUUID();
					return [
						subject,
						{
							from: email,
							to: "aiman.fauzy@localhost",
							subject,
							text: crypto.randomUUID(),
						},
					];
				}),
		);

		const pusher = new Worker("./test/pusher.controlled.ts");
		const sender = new Worker("./test/sender.ts");

		const errorHandler = (event: ErrorEvent) => {
			pusher.terminate();
			sender.terminate();
			throw event;
		};
		pusher.onerror = errorHandler;
		sender.onerror = errorHandler;

		const pusherLog: any[] = [];
		pusher.onmessage = (event) => {
			pusherLog.push(serializer.deserialize(event.data));
		};

		for (const subject in mails)
			pusher.postMessage(serializer.serialize(mails[subject]));
		await Bun.sleep(2000);

		expect(pusherLog).toBeArrayOfSize(Object.keys(mails).length);
		for (const log of pusherLog)
			expect(log.pushed).toEqual(mails[log.pushed.subject]);

		const messages = await mailhog.get("messages").json<any>();
		expect(messages).toBeArrayOfSize(Object.keys(mails).length);

		for (const got of messages) {
			const mail = mails[got.Content.Headers.Subject[0]]!;
			expect(`${got.From.Mailbox}@${got.From.Domain}`).toBe(mail.from);
			expect(`${got.To[0].Mailbox}@${got.To[0].Domain}`).toBe(mail.to);
			expect(got.Content.Body).toBe(mail.text);
		}

		pusher.terminate();
		sender.terminate();
	});
});
