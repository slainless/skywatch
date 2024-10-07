import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { createTransport, type SendMailOptions } from "nodemailer";
import { createEmailSender, EmailSender } from "./sender";
import { QUEUE_PREFIX } from "./broker";
import { MessagePackSerializer } from "@deweazer/serializer";
import ky from "ky";
import { MailHog, RabbitMQ } from "./test/container";
import { createEmailPusher, EmailPusher } from "./pusher";

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
