import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { LazyLoadPersistence } from "./lazy-load";
import type { GetResult } from "./persistence";
import { Mongo, Redis } from "./test/container";

const redis = Redis().orchestrate();
const mongo = Mongo().orchestrate();

const helloWorld = "Hello, World!";
const returned = <T extends Mock<any>>(spied: T, index: number) =>
  spied.mock.results[0]?.value;

beforeEach(async () => {
  await mongo.collection.deleteMany({});
});

describe(LazyLoadPersistence.name, () => {
  beforeEach(async () => {
    mock.restore();
    await redis.client.flushAll();
  });

  describe(LazyLoadPersistence.prototype.get.name, () => {
    it("should return immediately on cache hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      await redis.kv.set("cache-hit", helloWorld);
      const redisGetSpy = spyOn(redis.kv, "get");
      const mongoGetSpy = spyOn(mongo.kv, "get");

      expect(await persistence.get("cache-hit")).toEqual({
        cacheHit: true,
        storageHit: false,
        value: helloWorld,
      });

      expect(redisGetSpy).toHaveBeenLastCalledWith("cache-hit");
      await expect(returned(redisGetSpy, 0)).resolves.toBe(helloWorld);

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(0);
    });

    it("should call storage on cache miss", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      await mongo.kv.set("cache-miss", helloWorld);
      const redisGetSpy = spyOn(redis.kv, "get");
      const mongoGetSpy = spyOn(mongo.kv, "get");

      expect(await persistence.get("cache-miss")).toEqual({
        cacheHit: false,
        storageHit: true,
        value: helloWorld,
      });

      expect(redisGetSpy).toHaveBeenLastCalledWith("cache-miss");
      await expect(returned(redisGetSpy, 0)).resolves.toBe(null);
      expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss");
      await expect(returned(mongoGetSpy, 0)).resolves.toBe(helloWorld);

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);
    });

    it("should populate cache on cache miss, storage hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      await mongo.kv.set("cache-miss, storage-hit", helloWorld);
      const redisGetSpy = spyOn(redis.kv, "get");
      const mongoGetSpy = spyOn(mongo.kv, "get");
      const redisSetSpy = spyOn(redis.kv, "set");

      expect(await persistence.get("cache-miss, storage-hit")).toEqual({
        cacheHit: false,
        storageHit: true,
        value: helloWorld,
      });

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);

      expect(redisGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
      await expect(returned(redisGetSpy, 0)).resolves.toBe(null);
      expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
      await expect(returned(mongoGetSpy, 0)).resolves.toBe(helloWorld);

      await Bun.sleep(100);
      expect(redisSetSpy).toHaveBeenLastCalledWith(
        "cache-miss, storage-hit",
        helloWorld,
      );
      expect(redisSetSpy).toBeCalledTimes(1);
    });

    it("should return null value on cache miss, storage miss", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const redisGetSpy = spyOn(redis.kv, "get");
      const mongoGetSpy = spyOn(mongo.kv, "get");
      const redisSetSpy = spyOn(redis.kv, "set");

      expect(await persistence.get("cache-miss, storage-miss")).toEqual({
        cacheHit: false,
        storageHit: false,
        value: null,
      });

      expect(redisGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-miss");
      await expect(returned(redisGetSpy, 0)).resolves.toBe(null);
      expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-miss");
      await expect(returned(mongoGetSpy, 0)).resolves.toBe(null);

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);
      expect(redisSetSpy).toBeCalledTimes(0);
    });
  });

  describe(LazyLoadPersistence.prototype.has.name, () => {
    it("should return immediately on cache hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      await redis.kv.set("cache-hit", helloWorld);
      const redisHasSpy = spyOn(redis.kv, "has");
      const mongoHasSpy = spyOn(mongo.kv, "has");

      expect(await persistence.has("cache-hit")).toEqual({
        cacheHit: true,
        storageHit: false,
      });

      expect(redisHasSpy).toHaveBeenLastCalledWith("cache-hit");
      await expect(returned(redisHasSpy, 0)).resolves.toBe(true);

      expect(redisHasSpy).toBeCalledTimes(1);
      expect(mongoHasSpy).toBeCalledTimes(0);
    });

    it("should call storage on cache miss", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      await mongo.kv.set("cache-miss", helloWorld);
      const redisHasSpy = spyOn(redis.kv, "has");
      const mongoHasSpy = spyOn(mongo.kv, "has");

      expect(await persistence.has("cache-miss")).toEqual({
        cacheHit: false,
        storageHit: true,
      });

      expect(redisHasSpy).toHaveBeenLastCalledWith("cache-miss");
      await expect(returned(redisHasSpy, 0)).resolves.toBe(false);
      expect(mongoHasSpy).toHaveBeenLastCalledWith("cache-miss");
      await expect(returned(mongoHasSpy, 0)).resolves.toBe(true);

      expect(redisHasSpy).toBeCalledTimes(1);
      expect(mongoHasSpy).toBeCalledTimes(1);
    });

    it("should populate cache on cache miss, storage hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      await mongo.kv.set("cache-miss, storage-hit", helloWorld);
      const redisHasSpy = spyOn(redis.kv, "has");
      const mongoHasSpy = spyOn(mongo.kv, "has");
      const mongoGetSpy = spyOn(mongo.kv, "get");
      const redisSetSpy = spyOn(redis.kv, "set");

      expect(await persistence.has("cache-miss, storage-hit")).toEqual({
        cacheHit: false,
        storageHit: true,
      });

      expect(redisHasSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
      await expect(returned(redisHasSpy, 0)).resolves.toBe(false);
      expect(mongoHasSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
      await expect(returned(mongoHasSpy, 0)).resolves.toBe(true);

      expect(redisHasSpy).toBeCalledTimes(1);
      expect(mongoHasSpy).toBeCalledTimes(1);

      await Bun.sleep(100);
      expect(mongoGetSpy).toHaveBeenLastCalledWith("cache-miss, storage-hit");
      await expect(returned(mongoGetSpy, 0)).resolves.toBe(helloWorld);

      expect(redisSetSpy).toHaveBeenLastCalledWith(
        "cache-miss, storage-hit",
        helloWorld,
      );
      expect(redisSetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);
    });

    it("should return null value on cache miss, storage miss", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const redisHasSpy = spyOn(redis.kv, "has");
      const mongoHasSpy = spyOn(mongo.kv, "has");
      const redisSetSpy = spyOn(redis.kv, "set");

      expect(await persistence.has("cache-miss, storage-miss")).toEqual({
        cacheHit: false,
        storageHit: false,
      });

      expect(redisHasSpy).toHaveBeenLastCalledWith("cache-miss, storage-miss");
      await expect(returned(redisHasSpy, 0)).resolves.toBe(false);
      expect(mongoHasSpy).toHaveBeenLastCalledWith("cache-miss, storage-miss");
      await expect(returned(mongoHasSpy, 0)).resolves.toBe(false);

      expect(redisHasSpy).toBeCalledTimes(1);
      expect(mongoHasSpy).toBeCalledTimes(1);
      expect(redisSetSpy).toBeCalledTimes(0);
    });
  });

  describe(LazyLoadPersistence.prototype.set.name, () => {
    it("should set both cache and storage on set call", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const mongoSetSpy = spyOn(mongo.kv, "set");
      const redisSetSpy = spyOn(redis.kv, "set");

      expect(mongoSetSpy).toHaveBeenCalledTimes(0);
      expect(redisSetSpy).toHaveBeenCalledTimes(0);
      await persistence.set("update", helloWorld);

      expect(redisSetSpy).toHaveBeenCalledTimes(1);
      expect(redisSetSpy).toHaveBeenLastCalledWith("update", helloWorld);
      expect(redisSetSpy).toHaveReturned();

      expect(mongoSetSpy).toHaveBeenCalledTimes(1);
      expect(mongoSetSpy).toHaveBeenLastCalledWith("update", helloWorld);
      expect(mongoSetSpy).toHaveReturned();
    });
  });

  describe(LazyLoadPersistence.prototype.delete.name, () => {
    it("should delete both cache and storage on delete call", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const mongoDeleteSpy = spyOn(mongo.kv, "delete");
      const redisDeleteSpy = spyOn(redis.kv, "delete");

      await persistence.set("delete", helloWorld);
      expect(await redis.kv.has("delete")).toBe(true);
      expect(await mongo.kv.has("delete")).toBe(true);

      await persistence.delete("delete");

      expect(redisDeleteSpy).toHaveBeenLastCalledWith("delete");
      expect(mongoDeleteSpy).toHaveBeenLastCalledWith("delete");

      expect(await redis.kv.has("delete")).toBe(false);
      expect(await mongo.kv.has("delete")).toBe(false);

      expect(redisDeleteSpy).toBeCalledTimes(1);
      expect(mongoDeleteSpy).toBeCalledTimes(1);
    });
  });

  describe(LazyLoadPersistence.prototype.bulkGet.name, () => {
    it("should return immediately on cache hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const bulk = Array(1000)
        .fill(0)
        .map((_, index) => [`cache-hit-${index}`, index] as any);
      await redis.kv.bulkSet(bulk);
      const redisGetSpy = spyOn(redis.kv, "bulkGet");
      const mongoGetSpy = spyOn(mongo.kv, "bulkGet");

      expect(await persistence.bulkGet(bulk.map((v) => v[0]))).toEqual(
        bulk.map((v) => ({
          cacheHit: true,
          storageHit: false,
          value: v[1],
        })),
      );

      expect(redisGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(redisGetSpy, 0)).resolves.toEqual(bulk.map((v) => v[1]));

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(0);
    });

    it("should call storage on cache miss", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const bulk = Array(1000)
        .fill(0)
        .map((_, index) => [`cache-hit-${index}`, index] as any);
      await mongo.kv.bulkSet(bulk);
      const redisGetSpy = spyOn(redis.kv, "bulkGet");
      const mongoGetSpy = spyOn(mongo.kv, "bulkGet");

      expect(await persistence.bulkGet(bulk.map((v) => v[0]))).toEqual(
        bulk.map((v) => ({
          cacheHit: false,
          storageHit: true,
          value: v[1],
        })),
      );

      expect(redisGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(redisGetSpy, 0)).resolves.toEqual(
        Array(bulk.length).fill(null),
      );
      expect(mongoGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(mongoGetSpy, 0)).resolves.toEqual(bulk.map((v) => v[1]));

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);
    });

    it("should populate cache on cache miss, storage hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const bulkCacheHit = Array(500)
        .fill(0)
        .map((_, index) => [`cache-hit-${index}`, index] as any);
      const bulkCacheMiss = Array(500)
        .fill(0)
        .map((_, index) => [`cache-miss-${index}`, index] as any);
      const bulk = [...bulkCacheHit, ...bulkCacheMiss];

      await redis.kv.bulkSet(bulkCacheHit);
      await mongo.kv.bulkSet(bulkCacheMiss);
      const redisGetSpy = spyOn(redis.kv, "bulkGet");
      const mongoGetSpy = spyOn(mongo.kv, "bulkGet");
      const redisSetSpy = spyOn(redis.kv, "bulkSet");

      expect(await persistence.bulkGet(bulk.map((v) => v[0]))).toEqual(
        bulk.map((v, i) => ({
          cacheHit: i < bulkCacheHit.length,
          storageHit: bulkCacheHit.length <= i,
          value: v[1],
        })),
      );

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);

      expect(redisGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(redisGetSpy, 0)).resolves.toEqual(
        bulk.map((v, i) => (i < bulkCacheHit.length ? v[1] : null)),
      );

      expect(mongoGetSpy).toHaveBeenLastCalledWith(
        bulkCacheMiss.map((v) => v[0]),
      );
      expect(returned(mongoGetSpy, 0)).resolves.toEqual(
        bulkCacheMiss.map((v) => v[1]),
      );

      await Bun.sleep(1000);
      expect(redisSetSpy).toBeCalledTimes(1);
      expect(redisSetSpy).lastCalledWith(bulkCacheMiss);
    });

    it("should populate cache on cache miss, partial storage hit", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const bulkCacheHit = Array(10)
        .fill(0)
        .map((_, index) => [`cache-hit-${index}`, index] as any);
      const bulkCacheMiss = Array(10)
        .fill(0)
        .map((_, index) => [`cache-miss-${index}`, index] as any);
      const bulkStorageMiss = Array(10)
        .fill(0)
        .map((_, index) => [`storage-miss-${index}`, null] as any);
      const bulk = [...bulkCacheHit, ...bulkCacheMiss, ...bulkStorageMiss];
      const bulkMiss = [...bulkCacheMiss, ...bulkStorageMiss];

      await redis.kv.bulkSet(bulkCacheHit);
      await mongo.kv.bulkSet(bulkCacheMiss);
      const redisGetSpy = spyOn(redis.kv, "bulkGet");
      const mongoGetSpy = spyOn(mongo.kv, "bulkGet");
      const redisSetSpy = spyOn(redis.kv, "bulkSet");

      expect(await persistence.bulkGet(bulk.map((v) => v[0]))).toEqual(
        bulk.map((v, i) => ({
          cacheHit: i < bulkCacheHit.length,
          storageHit:
            bulkCacheHit.length <= i &&
            i < bulkCacheHit.length + bulkCacheMiss.length,
          value: v[1],
        })),
      );

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);

      expect(redisGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(redisGetSpy, 0)).resolves.toEqual(
        bulk.map((v, i) => (i < bulkCacheHit.length ? v[1] : null)),
      );

      expect(mongoGetSpy).toHaveBeenLastCalledWith(bulkMiss.map((v) => v[0]));
      expect(returned(mongoGetSpy, 0)).resolves.toEqual(
        bulkMiss.map((v) => v[1]),
      );

      await Bun.sleep(1000);
      expect(redisSetSpy).toBeCalledTimes(1);
      expect(redisSetSpy).lastCalledWith(bulkCacheMiss);
    });

    it("should return null value on cache miss, storage miss", async () => {
      const persistence = new LazyLoadPersistence(redis.kv, mongo.kv);

      const bulk = Array(1000)
        .fill(0)
        .map((_, index) => [`all-miss-${index}`, index] as any);
      const redisGetSpy = spyOn(redis.kv, "bulkGet");
      const mongoGetSpy = spyOn(mongo.kv, "bulkGet");
      const redisSetSpy = spyOn(redis.kv, "bulkSet");

      expect(await persistence.bulkGet(bulk.map((v) => v[0]))).toEqual(
        Array(1000).fill({
          cacheHit: false,
          storageHit: false,
          value: null,
        } satisfies GetResult),
      );

      expect(redisGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(redisGetSpy, 0)).resolves.toEqual(
        Array(bulk.length).fill(null),
      );
      expect(mongoGetSpy).toHaveBeenLastCalledWith(bulk.map((v) => v[0]));
      expect(returned(mongoGetSpy, 0)).resolves.toEqual(
        Array(bulk.length).fill(null),
      );

      expect(redisGetSpy).toBeCalledTimes(1);
      expect(mongoGetSpy).toBeCalledTimes(1);
      expect(redisSetSpy).toBeCalledTimes(0);
    });
  });
});
