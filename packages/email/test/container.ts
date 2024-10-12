import { type AMQPChannel, AMQPClient } from "@cloudamqp/amqp-client";
import { createProcess } from "@skywatch/spawn";
import { BunContainerOrchestrator, Spawner } from "@skywatch/spawn/container";

export const RabbitMQ = () =>
	new BunContainerOrchestrator<{
		client: AMQPClient;
		channel: AMQPChannel;
	}>(Spawner.RabbitMQ.bind(null, "mq"), "skywatch.email.test.mq")
		.onStart(async (vars) => {
			vars.client = new AMQPClient("amqp://localhost");
			await vars.client.connect();
			vars.channel = await vars.client.channel();
		})
		.onStop(async (vars) => {
			await vars.channel.close();
			await vars.client.close();
		});

export const MailHog = () =>
	new BunContainerOrchestrator(async () => {
		const id = crypto.randomUUID();
		const container = await createProcess(
			`docker run --rm --name ${id} -p 1025:1025 -p 8025:8025 mailhog/mailhog`,
			(line) => {
				return line.indexOf("[SMTP] Binding to address") !== -1;
			},
		);
		await Bun.sleep(100);
		return { containerID: id, container };
	}, "skywatch.email.test.mailhog");
