import { describe, it, beforeAll, afterAll, expect } from "bun:test";
import { InvalidKeyTypeError, RedisKV } from "./client.js";
import { $, type Subprocess } from "bun";
import { createProcess } from "@deweazer/spawn";
import type { RedisClientType } from "redis";
import { createClient } from "redis";
import example from "../../test/example.expected.json" assert { type: "json" };

let containerID: string;
let container: Subprocess<"ignore", "pipe", "inherit">;
let client: RedisClientType;
beforeAll(async () => {
	containerID = crypto.randomUUID();
	container = await createProcess(
		`docker run --rm -p 6379:6379 --name ${containerID} redis`,
		(line) => {
			return line.indexOf("Ready to accept connections tcp") !== -1;
		},
	);
	await Bun.sleep(500);
	client = createClient();
	await client.connect();
});

afterAll(async () => {
	if (container == null || container.killed) return;
	try {
		await client.flushAll();
		await client.disconnect();
	} catch (e) {}
	await $`docker stop ${containerID} > nul`;
	const returned = await container.exited;
	// console.log(`Closed redis container with code: ${returned}`);
});

describe(RedisKV.name, () => {
	it("should be able to set & get value", async () => {
		const kv = new RedisKV(client);

		await kv.set("hello", "World!");
		expect(await kv.get("hello")).toBe("World!");

		await kv.set("world!", example);
		expect(await kv.get("world!")).toEqual(example);
	});

	it("should panic on receiving non-string/number key", async () => {
		const kv = new RedisKV(client);

		expect(() => kv.get({})).toThrowError(InvalidKeyTypeError);
		expect(() => kv.set([], "A")).toThrowError(InvalidKeyTypeError);
		expect(() => kv.has(new Date())).toThrowError(InvalidKeyTypeError);
		expect(() =>
			kv.delete(new URL("https://what.in.tarnation.xyz")),
		).toThrowError(InvalidKeyTypeError);
	});

	it("should be able to lookup value", async () => {
		const kv = new RedisKV(client);

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
		const kv = new RedisKV(client);

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
});
