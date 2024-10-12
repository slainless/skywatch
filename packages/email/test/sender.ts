import { AMQPClient } from "@cloudamqp/amqp-client";
import { MessagePackSerializer } from "@skywatch/serializer";
import { createTransport } from "nodemailer";
import { createEmailSender } from "../sender";

declare const self: Worker;

const client = new AMQPClient("amqp://localhost");
await client.connect();
const channel = await client.channel();
const transport = createTransport({
	port: 1025,
	host: "localhost",
	secure: false,
	ignoreTLS: true,
});
const sender = await createEmailSender(channel, "noreply@localhost", transport);
await sender.startSending();

const serializer = MessagePackSerializer.serializer;
self.onmessage = (event) => {
	if (serializer.deserialize(event.data) === 0) return self.terminate();
};
