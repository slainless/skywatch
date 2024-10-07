import { createProcess } from "@deweazer/spawn";
import { BunContainerOrchestrator } from "@deweazer/spawn/container";
import { type Collection, MongoClient } from "mongodb";
import { type RedisClientType, createClient } from "redis";
import { MongoKV } from "../kv/mongodb/client";
import { RedisKV } from "../kv/redis/client";

export async function runRedisContainer() {
	const id = crypto.randomUUID();
	const container = await createProcess(
		`docker run --rm -p 6379:6379 --name ${id} redis`,
		(line) => {
			return line.indexOf("Ready to accept connections tcp") !== -1;
		},
	);
	await Bun.sleep(500);

	return { containerID: id, container };
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

	return { containerID: id, container };
}

export const Mongo = () =>
	new BunContainerOrchestrator<{
		client: MongoClient;
		kv: MongoKV;
		key: string;
		collection: Collection;
	}>(runMongoContainer, "deweazer.persistence.test.mongo")
		.onStart(async (vars) => {
			vars.key = "key";
			vars.client = await new MongoClient("mongodb://localhost:27017");

			vars.collection = vars.client.db("test").collection("kv");
			await vars.collection.createIndex(vars.key, { unique: true });

			vars.kv = new MongoKV(vars.collection, { idField: vars.key });
		})
		.onStop(async (vars) => {
			await vars.client.close();
		});

export const Redis = () =>
	new BunContainerOrchestrator<{
		client: RedisClientType;
		kv: RedisKV;
	}>(runRedisContainer, "deweazer.persistence.test.redis")
		.onStart(async (vars) => {
			vars.client = createClient();
			await vars.client.connect();

			vars.kv = new RedisKV(vars.client);
		})
		.onStop(async (vars) => {
			await vars.client.flushAll();
			await vars.client.disconnect();
		});
