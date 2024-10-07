import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { LazyLoadPersistence } from "./lazy-load";
import { Mongo, Redis } from "./test/container";

const redis = Redis.orchestrate();
const mongo = Mongo.orchestrate();

describe(LazyLoadPersistence.name, () => {
	afterEach(() => {
		mock.restore();
	});

	it("should return immediately on cache hit", async () => {
		const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

		await redis.kv.set("cache-hit", "Hello, World!");
		const redisGetSpy = spyOn(redis.kv, "get");
		const mongoGetSpy = spyOn(mongo.kv, "get");

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
		const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

		await mongo.kv.set("cache-miss", "Hello, World!");
		const redisGetSpy = spyOn(redis.kv, "get");
		const mongoGetSpy = spyOn(mongo.kv, "get");

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
		const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

		await mongo.kv.set("cache-miss, storage-hit", "Hello, World!");
		const redisGetSpy = spyOn(redis.kv, "get");
		const mongoGetSpy = spyOn(mongo.kv, "get");
		const redisSetSpy = spyOn(redis.kv, "set");

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
		const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

		const redisGetSpy = spyOn(redis.kv, "get");
		const mongoGetSpy = spyOn(mongo.kv, "get");
		const redisSetSpy = spyOn(redis.kv, "set");

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
		const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

		const mongoSetSpy = spyOn(mongo.kv, "set");
		const redisSetSpy = spyOn(redis.kv, "set");

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
