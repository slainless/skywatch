import type {
	AMQPChannel,
	AMQPConsumer,
	AMQPMessage,
	AMQPQueue,
} from "@cloudamqp/amqp-client";
import { MessagePackSerializer } from "@deweazer/serializer";
import { Mutex } from "async-mutex";
import type { SendMailOptions, Transporter } from "nodemailer";
import { QUEUE_PREFIX } from "./broker";
import { assertMail } from "./guard/artifact/message";

export class EmailSender {
	private consumer: AMQPConsumer | null = null;
	private consumerMut = new Mutex();

	constructor(
		public queue: AMQPQueue,
		public transporter: Transporter,
		private serializer = MessagePackSerializer.serializer,
	) {}

	private async onMessage(message: AMQPMessage) {
		try {
			if (message.body == null) return message.nack();
			const mail = this.serializer.deserialize(Buffer.from(message.body));
			assertMail(mail);
			message.ack();
			await this.transporter.sendMail(mail);
		} catch (e) {
			// let us just drop the push notification on error for now...
			return message.nack();
		}
	}

	async startSending() {
		return this.consumerMut.runExclusive(async () => {
			if (this.consumer != null) return;
			this.consumer = await this.queue.subscribe({}, this.onMessage.bind(this));
		});
	}

	async stopSending() {
		return this.consumerMut.runExclusive(async () => {
			if (this.consumer == null) return;
			await this.consumer.cancel();
			this.consumer = null;
		});
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
	channel: AMQPChannel,
	emailAddr: string,
	transporter: Transporter,
) {
	const queue = await channel.queue(QUEUE_PREFIX + emailAddr);
	return new EmailSender(queue, transporter);
}
