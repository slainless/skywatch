import { MessagePackSerializer } from "@deweazer/serializer";
import { QUEUE_PREFIX } from "./broker";
import type { SendMailOptions } from "nodemailer";
import type { AMQPChannel, AMQPQueue } from "@cloudamqp/amqp-client";

export class EmailPusher {
	constructor(
		public queue: AMQPQueue,
		private serializer = MessagePackSerializer.serializer,
	) {}

	async send(message: SendMailOptions): Promise<void> {
		return void this.queue.publish(this.serializer.serialize(message));
	}
}

export async function createEmailPusher(
	channel: AMQPChannel,
	emailQueue: string,
) {
	const queue = await channel.queue(QUEUE_PREFIX + emailQueue);
	return new EmailPusher(queue);
}
