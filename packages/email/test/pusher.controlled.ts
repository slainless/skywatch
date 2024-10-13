import { AMQPClient } from "@cloudamqp/amqp-client";
import { MessagePackSerializer } from "@skywatch/serializer";
import { assertMail } from "../guard/artifact/message";
import { createEmailPusher } from "../pusher";

declare const self: Worker;

const client = new AMQPClient("amqp://localhost");
await client.connect();
const channel = await client.channel();
const pusher = await createEmailPusher(channel, "noreply@localhost");

const serializer = MessagePackSerializer.serializer;
self.onmessage = async (event) => {
  try {
    const mail = serializer.deserialize(event.data);
    if (mail === 0) return self.terminate();
    assertMail(mail);
    await pusher.send(mail);
    postMessage(serializer.serialize({ pushed: mail }));
  } catch (e) {
    postMessage(serializer.serialize({ error: e }));
  }
};
