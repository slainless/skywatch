import {
	afterAll,
	beforeEach,
	describe,
	expect,
	it,
	mock,
	spyOn,
} from "bun:test";
import { Redis } from "../../test/container.js";
import example from "../../test/example.expected.json" assert { type: "json" };
import { InvalidKeyTypeError, NullValueError, RedisKV } from "./client.js";
import { MessagePackSerializer } from "@skywatch/serializer";

const redis = Redis().orchestrate();
const serializer = MessagePackSerializer.serializer;

beforeEach(async () => {
	await redis.client.flushAll();
});

afterAll(() => mock.restore());

describe(RedisKV.name, () => {
	it("should be able to set & get value", async () => {
		const kv = new RedisKV(redis.client);

		await kv.set("hello", "World!");
		expect(await kv.get("hello")).toBe("World!");

		await kv.set("world!", example);
		expect(await kv.get("world!")).toEqual(example);

		expect(await kv.get("NULL")).toBe(null);
	});

	it("should panic on receiving non-string/number key", async () => {
		const kv = new RedisKV(redis.client);

		expect(() => kv.get({})).toThrowError(InvalidKeyTypeError);
		expect(() => kv.set([], "A")).toThrowError(InvalidKeyTypeError);
		expect(() => kv.has(new Date())).toThrowError(InvalidKeyTypeError);
		expect(() =>
			kv.delete(new URL("https://what.in.tarnation.xyz")),
		).toThrowError(InvalidKeyTypeError);
	});

	it("should panic on receiving nullish value", async () => {
		const kv = new RedisKV(redis.client);

		expect(() => kv.set("A", null)).toThrowError(NullValueError);
		expect(() => kv.set("A", undefined)).toThrowError(NullValueError);
	});

	it("should be able to lookup value", async () => {
		const kv = new RedisKV(redis.client);

		await kv.set("hello", "World!");
		expect(await kv.has("hello")).toBe(true);

		await kv.set("a", 1);
		expect(await kv.has("a")).toBe(true);
		expect(await kv.has("yyyy")).toBe(false);
		expect(await kv.has("yyyy1")).toBe(false);
		expect(await kv.has("yyyy2")).toBe(false);
		expect(await kv.has("yyyy3")).toBe(false);
		expect(await kv.has("yyyy4")).toBe(false);
		expect(await kv.has("yyyy5")).toBe(false);

		await kv.set("b", 1);
		expect(await kv.has("b")).toBe(true);

		await kv.set("AAAAAAAAAAAAAAAAAAAAAAAAAAAA", 1);
		expect(await kv.has("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")).toBe(true);

		await kv.set("AAAAAAAAAAAAAAAAAAAAAAAAAAAA", 1);
		expect(await kv.has("xxxxx")).toBe(false);
		expect(await kv.has("xxxxx1")).toBe(false);
		expect(await kv.has("xxxxx2")).toBe(false);
		expect(await kv.has("xxxxx3")).toBe(false);
		expect(await kv.has("xxxxx4")).toBe(false);
		expect(await kv.has("xxxxx5")).toBe(false);
	});

	it("should be able to remove value", async () => {
		const kv = new RedisKV(redis.client);

		await kv.set("hello", "World!");
		expect(await kv.has("hello")).toBe(true);
		await kv.delete("hello");
		expect(await kv.has("hello")).toBe(false);

		await kv.set("a", 1);
		expect(await kv.has("a")).toBe(true);
		await kv.delete("a");
		expect(await kv.has("a")).toBe(false);

		await kv.set("yyyy", 9999);
		await kv.set("yyyy1", 9999);
		await kv.set("yyyy2", 9999);
		await kv.set("yyyy3", 9999);
		await kv.set("yyyy4", 9999);
		await kv.set("yyyy5", 9999);
		expect(await kv.has("yyyy")).toBe(true);
		expect(await kv.has("yyyy1")).toBe(true);
		expect(await kv.has("yyyy2")).toBe(true);
		expect(await kv.has("yyyy3")).toBe(true);
		expect(await kv.has("yyyy4")).toBe(true);
		expect(await kv.has("yyyy5")).toBe(true);
		await kv.delete("yyyy");
		await kv.delete("yyyy1");
		await kv.delete("yyyy2");
		await kv.delete("yyyy3");
		await kv.delete("yyyy4");
		await kv.delete("yyyy5");
		expect(await kv.has("yyyy")).toBe(false);
		expect(await kv.has("yyyy1")).toBe(false);
		expect(await kv.has("yyyy2")).toBe(false);
		expect(await kv.has("yyyy3")).toBe(false);
		expect(await kv.has("yyyy4")).toBe(false);
		expect(await kv.has("yyyy5")).toBe(false);

		await kv.set("b", 1);
		expect(await kv.has("b")).toBe(true);
		await kv.delete("b");
		await kv.delete("b");
		await kv.delete("b");
		await kv.delete("b");
		await kv.delete("b");
		await kv.delete("b");
		expect(await kv.has("b")).toBe(false);
	});

	it("should be able to get many values", async () => {
		const kv = new RedisKV(redis.client);

		await Promise.all([
			kv.set("a", 1),
			kv.set("d", 2),
			kv.set("f", 3),
			kv.set("h", 4),
			kv.set("i", 5),
			kv.set("j", 6),
		]);

		expect(
			await kv.bulkGet(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]),
		).toEqual([1, null, null, 2, null, 3, null, 4, 5, 6]);
		expect(await kv.bulkGet([])).toEqual([]);
		const bulk = Array(10000).fill("x");
		bulk[1234] = "i";

		const expected = Array(10000).fill(null);
		expected[1234] = 5;
		expect(await kv.bulkGet(bulk)).toEqual(expected);
	});

	it("should be able to set many values", async () => {
		const kv = new RedisKV(redis.client);

		const bulk = Array(100)
			.fill(true)
			.map((_, index) => [`key-${index}`, index] as any);

		await kv.bulkSet(bulk);
		expect(await kv.bulkGet(bulk.map((v) => v[0]))).toEqual(
			bulk.map((v) => v[1]),
		);
	});

	it("should be able to delete many values", async () => {
		const kv = new RedisKV(redis.client);

		const bulk = Array(100)
			.fill(true)
			.map((_, index) => [`key-${index}`, index] as any);
		const keys = bulk.map((v) => v[0]);

		await kv.bulkSet(bulk);
		expect(await kv.bulkGet(keys)).toEqual(bulk.map((v) => v[1]));
		await kv.bulkDelete(keys);
		expect(await kv.bulkGet(keys)).toEqual(Array(100).fill(null));
	});

	it("should be able to lookup many values", async () => {
		const kv = new RedisKV(redis.client);

		const bulk = Array(100)
			.fill(true)
			.map((_, index) => [`key-${index}`, index] as any);
		const keys = bulk.map((v) => v[0]);

		await kv.bulkSet(bulk);
		expect(await kv.bulkHas([...keys, "SHOULD_BE_NULL", ...keys])).toEqual([
			...Array(100).fill(true),
			false,
			...Array(100).fill(true),
		]);
		await kv.bulkDelete(keys);
		expect(await kv.bulkHas(keys)).toEqual(Array(100).fill(false));
	});

	it("should be able to use prefixed key", async () => {
		const keyPrefix =
			"my-prefix-for-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:";
		const prefix = (v: string) => keyPrefix + v;
		const value = (v: any) => serializer.serialize(v);
		const kv = new RedisKV(redis.client, { keyPrefix });

		const spies = {
			get: spyOn(redis.client, "get"),
			exists: spyOn(redis.client, "exists"),
			set: spyOn(redis.client, "set"),
			del: spyOn(redis.client, "del"),
			mSet: spyOn(redis.client, "mSet"),
			mGet: spyOn(redis.client, "mGet"),
		};

		await kv.set("a", 1);
		expect(spies.set).toHaveBeenLastCalledWith(prefix("a"), value(1));

		await expect(kv.has("a")).resolves.toBe(true);
		expect(spies.exists).toHaveBeenLastCalledWith(prefix("a"));

		await expect(kv.get("a")).resolves.toBe(1);
		expect(spies.get.mock.lastCall).toContain(prefix("a"));

		await kv.delete("a");
		expect(spies.del).toHaveBeenLastCalledWith(prefix("a"));

		await expect(kv.has("a")).resolves.toBe(false);
		expect(spies.exists).toHaveBeenLastCalledWith(prefix("a"));

		const bulk = [
			["a", 1],
			["b", 2],
			["c", 3],
			["f", 4],
			["g", 5],
			["h", 6],
		] as const;
		await kv.bulkSet(bulk);
		expect(spies.mSet).toHaveBeenLastCalledWith(
			bulk.map(([k, v]) => [prefix(k), value(v)]),
		);

		const bulkKeys = ["a", "b", "c", "d", "e", "f", "g", "h"];
		await expect(kv.bulkGet(bulkKeys)).resolves.toEqual([
			1,
			2,
			3,
			null,
			null,
			4,
			5,
			6,
		]);
		expect(spies.mGet.mock.lastCall?.[1]).toEqual(
			bulkKeys.map((key) => prefix(key)),
		);

		await kv.bulkDelete(["a", "g", "f"]);
		expect(spies.del).toHaveBeenLastCalledWith([
			prefix("a"),
			prefix("g"),
			prefix("f"),
		]);

		spies.exists.mockClear();
		await expect(kv.bulkHas(bulkKeys)).resolves.toEqual([
			false,
			true,
			true,
			false,
			false,
			false,
			false,
			true,
		]);
		expect(spies.exists).toBeCalledTimes(bulkKeys.length);
		expect(spies.exists.mock.calls).toEqual(
			bulkKeys.map((key) => [prefix(key)]),
		);
	});
});
