import { BunContainerOrchestrator, Spawner } from "@deweazer/spawn/container";
import { type Collection, MongoClient } from "mongodb";
import { MongoKV } from "@deweazer/persistence/mongo-kv";
import { RedisKV } from "@deweazer/persistence/redis-kv";
import { createClient, type RedisClientType } from "redis";

export const Mongo = () =>
	new BunContainerOrchestrator<{
		client: MongoClient;
		kv: MongoKV;
		key: string;
		collection: Collection;
	}>(Spawner.MongoDB, "deweazer.persistence.test.mongo")
		.onStart(async (vars) => {
			vars.key = "key";
			vars.client = await new MongoClient("mongodb://localhost:27017");

			vars.collection = vars.client.db("test").collection("kv");
			await vars.collection.createIndex(vars.key, { unique: true });

			vars.kv = new MongoKV(vars.client, vars.collection, {
				idField: vars.key,
			});
		})
		.onStop(async (vars) => {
			await vars.client.close();
		});

export const Redis = () =>
	new BunContainerOrchestrator<{
		client: RedisClientType;
		kv: RedisKV;
	}>(Spawner.Redis, "deweazer.persistence.test.redis")
		.onStart(async (vars) => {
			vars.client = createClient();
			await vars.client.connect();

			vars.kv = new RedisKV(vars.client);
		})
		.onStop(async (vars) => {
			await vars.client.flushAll();
			await vars.client.disconnect();
		});