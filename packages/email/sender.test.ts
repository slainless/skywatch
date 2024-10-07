import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { createTransport, type SendMailOptions } from "nodemailer";
import { createEmailSender, EmailSender } from "./sender";
import { QUEUE_PREFIX } from "./broker";
import { MessagePackSerializer } from "@deweazer/serializer";
import ky from "ky";
import { MailHog, RabbitMQ } from "./test/container";

const mq = RabbitMQ.orchestrate();
const mh = MailHog.orchestrate();

const mailhog = ky.create({ prefixUrl: "http://localhost:8025/api/v1" });
const serializer = MessagePackSerializer.serializer;
const createMail = <T extends SendMailOptions>(mail: T) => mail;

beforeEach(() => mailhog.delete("messages"));

describe(EmailSender.name, () => {
	beforeEach(async () => {
		mock.restore();
		await mq.channel.queueDelete(QUEUE_PREFIX + email);
	});

	const email = "noreply@localhost";
	it("should be able to consume queue message and send it as email", async () => {
		const transport = createTransport({
			port: 1025,
			host: "localhost",
			secure: false,
			ignoreTLS: true,
		});

		const queue = await mq.channel.queue(QUEUE_PREFIX + email);
		const sender = await createEmailSender(mq.channel, email, transport);

		const subscribeSpy = spyOn(sender.queue, "subscribe");
		expect(subscribeSpy).toHaveBeenCalledTimes(0);
		await sender.startSending();
		expect(subscribeSpy).toHaveBeenCalledTimes(1);

		const sendMailSpy = spyOn(transport, "sendMail");
		expect(sendMailSpy).toHaveBeenCalledTimes(0);

		const mail = createMail({
			from: email,
			to: "aiman.fauzy@localhost",
			subject: "Hello, World!",
			text: "😁😁😁😁リムルは真の竜種に進化した🗿💀😱🤦‍♂️🌖🤣",
		});
		await queue.publish(serializer.serialize(mail));
		await Bun.sleep(100);
		expect(sendMailSpy).toHaveBeenCalledTimes(1);
		expect(sendMailSpy.mock.lastCall).toEqual([mail]);

		const messages = await mailhog.get("messages").json<any>();
		expect(messages).toBeArrayOfSize(1);

		const got = messages[0];
		expect(`${got.From.Mailbox}@${got.From.Domain}`).toBe(mail.from);
		expect(`${got.To[0].Mailbox}@${got.To[0].Domain}`).toBe(mail.to);
		expect(Buffer.from(got.Content.Body, "base64").toString()).toBe(mail.text);
	});
});

describe("Local mail simulation with mailhog", () => {
	it("should allow sending and receiving from/to local server", async () => {
		const transport = createTransport({
			port: 1025,
			host: "localhost",
			secure: false,
			ignoreTLS: true,
		});

		const mail = createMail({
			from: "noreply@localhost",
			to: "ahmad.fauzy@localhost",
			subject: "Hello, World!",
			text: "ちなみに、私はArchを使っています。",
		});
		await transport.sendMail(mail);

		const messages = await mailhog.get("messages").json<any>();
		expect(messages).toBeArrayOfSize(1);

		const got = messages[0];
		expect(`${got.From.Mailbox}@${got.From.Domain}`).toBe(mail.from);
		expect(`${got.To[0].Mailbox}@${got.To[0].Domain}`).toBe(mail.to);
		expect(Buffer.from(got.Content.Body, "base64").toString()).toBe(mail.text);
	});
});
