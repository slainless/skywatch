import { createProcess } from "@deweazer/spawn";
import { $, type Subprocess } from "bun";

export async function runRedisContainer() {
	const id = crypto.randomUUID();
	const container = await createProcess(
		`docker run --rm -p 6379:6379 --name ${id} redis`,
		(line) => {
			return line.indexOf("Ready to accept connections tcp") !== -1;
		},
	);
	await Bun.sleep(500);

	return { id, container };
}

export async function runMongoContainer() {
	const id = crypto.randomUUID();
	const container = await createProcess(
		`docker run --rm -p 27017:27017 --name ${id} mongo`,
		(line) => {
			return line.indexOf("mongod startup complete") !== -1;
		},
	);
	await Bun.sleep(500);

	return { id, container };
}

export async function stopContainer(container: Subprocess<any>, id: string) {
	await $`docker stop ${id} > nul`;
	return container.exited;
}
