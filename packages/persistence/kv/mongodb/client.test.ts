import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { BunContainerOrchestrator } from "@deweazer/spawn/container";
import type { Subprocess } from "bun";
import { type Collection, MongoClient } from "mongodb";
import { runMongoContainer } from "../../test/container.js";
import example from "../../test/example.expected.json" assert { type: "json" };
import { InvalidKeyTypeError, MongoKV, NullValueError } from "./client.js";

const idField = "key";
const mongo = new BunContainerOrchestrator<{
	collection: Collection;
	client: MongoClient;
}>(runMongoContainer, "deweazer.persistence.test.mongo")
	.onStart(async (vars) => {
		vars.client = new MongoClient("mongodb://localhost:27017");
		await vars.client.connect();

		vars.collection = vars.client.db("test").collection("kv");
		await vars.collection.createIndex(idField, { unique: true });
	})
	.onStop(async (vars) => vars.client.close())
	.orchestrate();

describe(MongoKV.name, () => {
	it("should be able to set & get value", async () => {
		const kv = new MongoKV(mongo.collection, { idField });

		await kv.set("hello", "World!");
		expect(await kv.get("hello")).toBe("World!");

		await kv.set("world!", example);
		expect(await kv.get("world!")).toEqual(example);

		expect(await kv.get("NULL")).toBe(null);
	});

	it("should panic on receiving non-string/number key", async () => {
		const kv = new MongoKV(mongo.collection, { idField });

		expect(() => kv.get({})).toThrowError(InvalidKeyTypeError);
		expect(() => kv.set([], "A")).toThrowError(InvalidKeyTypeError);
		expect(() => kv.has(new Date())).toThrowError(InvalidKeyTypeError);
		expect(() =>
			kv.delete(new URL("https://what.in.tarnation.xyz")),
		).toThrowError(InvalidKeyTypeError);
	});

	it("should panic on receiving nullish value", async () => {
		const kv = new MongoKV(mongo.collection, { idField });

		expect(() => kv.set("A", null)).toThrowError(NullValueError);
		expect(() => kv.set("A", undefined)).toThrowError(NullValueError);
	});

	it("should be able to lookup value", async () => {
		const kv = new MongoKV(mongo.collection, { idField });

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
		const kv = new MongoKV(mongo.collection, { idField });

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
