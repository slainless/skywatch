import { $, type Subprocess } from "bun";
import { createProcess } from "./process";

export async function stopContainer(container: Subprocess<any>, id: string) {
	await $`docker stop ${id} > nul`;
	return container.exited;
}

export async function spawnRabbitMQ(hostname: string) {
	const id = crypto.randomUUID();
	const container = await createProcess(
		`docker run --rm --hostname ${hostname} --name ${id} -p 5672:5672 rabbitmq`,
		(line) => {
			return line.indexOf("Server startup complete") !== -1;
		},
	);
	await Bun.sleep(100);
	return { id, container };
}
