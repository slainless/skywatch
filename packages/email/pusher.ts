import type { Channel, Connection } from "amqplib";
import { MessagePackSerializer } from "@deweazer/serializer";
import { QUEUE_PREFIX } from "./broker";
import type { SendMailOptions } from "nodemailer";

export class EmailPusher {
	constructor(
		public channel: Channel,
		private emailQueue: string,
		private serializer = MessagePackSerializer.serializer,
	) {}

	async send(message: SendMailOptions) {
		return this.channel.sendToQueue(
			this.emailQueue,
			this.serializer.serialize(message),
		);
	}

	async close() {
		return this.channel.close();
	}
}

export async function createEmailPusher(
	client: Connection,
	emailQueue: string,
) {
	const channel = await client.createChannel();
	await channel.assertQueue(QUEUE_PREFIX + emailQueue);
	return new EmailPusher(channel, QUEUE_PREFIX + emailQueue);
}
