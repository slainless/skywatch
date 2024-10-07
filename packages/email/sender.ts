import type { Channel, Connection, ConsumeMessage, Replies } from "amqplib";
import type { SendMailOptions, Transporter } from "nodemailer";
import { QUEUE_PREFIX } from "./broker";
import { MessagePackSerializer } from "@deweazer/serializer";
import { Mutex } from "async-mutex";
import { assertMail } from "./guard/artifact/message";

export class EmailSender {
	private consumer: Replies.Consume | null = null;
	private consumerMut = new Mutex();

	constructor(
		public channel: Channel,
		private emailQueue: string,
		public transporter: Transporter,
		private serializer = MessagePackSerializer.serializer,
	) {}

	private async onMessage(message: ConsumeMessage | null) {
		if (message == null) return;
		try {
			const mail = this.serializer.deserialize(message.content);
			assertMail(mail);
			await this.transporter.sendMail(mail);
			this.ack(message);
		} catch (e) {
			// let us just drop the push notification on error for now...
			this.nack(message);
		}
	}

	async startSending() {
		return this.consumerMut.runExclusive(async () => {
			if (this.consumer != null) return;
			this.consumer = await this.channel.consume(
				this.emailQueue,
				this.onMessage.bind(this),
			);
		});
	}

	async stopSending() {
		return this.consumerMut.runExclusive(async () => {
			if (this.consumer == null) return;
			await this.channel.cancel(this.consumer.consumerTag);
			this.consumer = null;
		});
	}

	async close() {
		return this.channel.close();
	}

	private ack(message: ConsumeMessage) {
		this.channel.ack(message);
	}

	private nack(message: ConsumeMessage, requeue?: boolean) {
		this.channel.nack(message, false, requeue ?? false);
	}

	// private deserialize(message: ConsumeMessage): MailMessage | null {
	// 	const mail = this.serializer.deserialize(message.content);
	// 	try {
	// 		assertMail(mail);
	// 		return mail;
	// 	} catch (e) {
	// 		return null;
	// 	}
	// }
}

export async function createEmailSender(
	connection: Connection,
	emailAddr: string,
	transporter: Transporter,
) {
	const channel = await connection.createChannel();
	await channel.assertQueue(QUEUE_PREFIX + emailAddr);
	return new EmailSender(channel, QUEUE_PREFIX + emailAddr, transporter);
}
