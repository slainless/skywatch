import {
	describe,
	it,
	beforeAll,
	afterAll,
	expect,
	spyOn,
	afterEach,
	mock,
} from "bun:test";
import type { Subprocess } from "bun";
import example from "./test/example.expected.json" assert { type: "json" };
import {
	runMongoContainer,
	runRedisContainer,
	stopContainer,
} from "./test/container.js";
import { type Collection, MongoClient } from "mongodb";
import { createClient, type RedisClientType } from "redis";
import { LazyLoadPersistence } from "./lazy-load";
import { MongoKV } from "./kv/mongodb/client";
import { RedisKV } from "./kv/redis/client";

let redisID: string;
let redis: Subprocess<"ignore", "pipe", "inherit">;

let mongoID: string;
let mongo: Subprocess<"ignore", "pipe", "inherit">;

let mongoClient: MongoClient;
let redisClient: RedisClientType;

let mongoKV: MongoKV;
let redisKV: RedisKV;
beforeAll(async () => {
	[{ id: mongoID, container: mongo }, { id: redisID, container: redis }] =
		await Promise.all([runMongoContainer(), runRedisContainer()]);
	await Bun.sleep(300);

	mongoClient = await new MongoClient("mongodb://localhost:27017");
	redisClient = createClient();

	Promise.all([mongoClient.connect(), redisClient.connect()]);

	const collection = mongoClient.db("test").collection("kv");
	await collection.createIndex("key", { unique: true });

	mongoKV = new MongoKV(collection, { idField: "key" });
	redisKV = new RedisKV(redisClient);
});

afterAll(
	async () =>
		await Promise.all([
			(async () => {
				if (mongo == null || mongo.killed) return;
				try {
					await mongoClient.close();
				} catch (e) {}
				await stopContainer(mongo, mongoID);
			})(),
			(async () => {
				if (redis == null || redis.killed) return;
				try {
					await redisClient.flushAll();
					await redisClient.disconnect();
				} catch (e) {}
				await stopContainer(redis, redisID);
			})(),
		]),
);

describe(LazyLoadPersistence.name, () => {
	afterEach(() => {
		mock.restore();
	});

	it("should return immediately on cache hit", async () => {
		const persistence = new LazyLoadPersistence(redisKV, mongoKV);

		await redisKV.set("cache-hit", "Hello, World!");
		const redisGetSpy = spyOn(redisKV, "get");
		const mongoGetSpy = spyOn(mongoKV, "get");

		expect(redisGetSpy).toHaveBeenCalledTimes(0);
		expect(mongoGetSpy).toHaveBeenCalledTimes(0);
		expect(await persistence.get("cache-hit")).toEqual({
			cacheHit: true,
			storageHit: false,
			value: "Hello, World!",
		});

		expect(redisGetSpy).toHaveBeenCalledTimes(1);
		expect(redisGetSpy).toHaveBeenLastCalledWith("cache-hit");
		expect(redisGetSpy).toHaveReturned();

		expect(mongoGetSpy).toHaveBeenCalledTimes(0);
	});

	it("should call storage on cache miss", async () => {
		const persistence = new LazyLoadPersistence(redisKV, mongoKV);

		await mongoKV.set("cache-miss", "Hello, World!");
		const redisGetSpy = spyOn(redisKV, "get");
		const mongoGetSpy = spyOn(mongoKV, "get");

		expect(redisGetSpy).toHaveBeenCalledTimes(0);
		expect(mongoGetSpy).toHaveBeenCalledTimes(0);
		expect(await persistence.get("cache-miss")).toEqual({
			cacheHit: false,
			storageHit: true,
			value: "Hello, World!",
		});

		expect(redisGetSpy).toHaveBeenCalledTimes(1);
		expect(redisGetSpy).toHaveBeenLastCalledWith("cache-miss");
		expect(redisGetSpy).toHaveReturned();

		expect(mongoGetSpy).toHaveBeenCalledTimes(1);
		expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss");
		expect(mongoGetSpy).toHaveReturned();
	});

	it("should populate cache on cache miss, storage hit", async () => {
		const persistence = new LazyLoadPersistence(redisKV, mongoKV);

		await mongoKV.set("cache-miss, storage-hit", "Hello, World!");
		const redisGetSpy = spyOn(redisKV, "get");
		const mongoGetSpy = spyOn(mongoKV, "get");
		const redisSetSpy = spyOn(redisKV, "set");

		expect(redisGetSpy).toHaveBeenCalledTimes(0);
		expect(mongoGetSpy).toHaveBeenCalledTimes(0);
		expect(redisSetSpy).toHaveBeenCalledTimes(0);
		expect(await persistence.get("cache-miss, storage-hit")).toEqual({
			cacheHit: false,
			storageHit: true,
			value: "Hello, World!",
		});

		expect(redisGetSpy).toHaveBeenCalledTimes(1);
		expect(redisGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
		expect(redisGetSpy).toHaveReturned();

		expect(mongoGetSpy).toHaveBeenCalledTimes(1);
		expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
		expect(mongoGetSpy).toHaveReturned();

		await Bun.sleep(100);
		expect(redisSetSpy).toHaveBeenCalledTimes(1);
		expect(redisSetSpy).toHaveBeenLastCalledWith(
			"cache-miss, storage-hit",
			"Hello, World!",
		);
		expect(redisSetSpy).toHaveReturned();
	});

	it("should return null value on cache miss, storage miss", async () => {
		const persistence = new LazyLoadPersistence(redisKV, mongoKV);

		const redisGetSpy = spyOn(redisKV, "get");
		const mongoGetSpy = spyOn(mongoKV, "get");
		const redisSetSpy = spyOn(redisKV, "set");

		expect(redisGetSpy).toHaveBeenCalledTimes(0);
		expect(mongoGetSpy).toHaveBeenCalledTimes(0);
		expect(redisSetSpy).toHaveBeenCalledTimes(0);
		expect(await persistence.get("cache-miss, storage-miss")).toEqual({
			cacheHit: false,
			storageHit: false,
			value: null,
		});

		expect(redisGetSpy).toHaveBeenCalledTimes(1);
		expect(redisGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-miss");
		expect(redisGetSpy).toHaveReturned();

		expect(mongoGetSpy).toHaveBeenCalledTimes(1);
		expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-miss");
		expect(mongoGetSpy).toHaveReturned();

		expect(redisSetSpy).toHaveBeenCalledTimes(0);
	});

	it("should set both cache and storage on set call", async () => {
		const persistence = new LazyLoadPersistence(redisKV, mongoKV);

		const mongoSetSpy = spyOn(mongoKV, "set");
		const redisSetSpy = spyOn(redisKV, "set");

		expect(mongoSetSpy).toHaveBeenCalledTimes(0);
		expect(redisSetSpy).toHaveBeenCalledTimes(0);
		await persistence.set("update", "Hello, World!");

		expect(redisSetSpy).toHaveBeenCalledTimes(1);
		expect(redisSetSpy).toHaveBeenLastCalledWith("update", "Hello, World!");
		expect(redisSetSpy).toHaveReturned();

		expect(mongoSetSpy).toHaveBeenCalledTimes(1);
		expect(mongoSetSpy).toHaveBeenLastCalledWith("update", "Hello, World!");
		expect(mongoSetSpy).toHaveReturned();
	});
});
