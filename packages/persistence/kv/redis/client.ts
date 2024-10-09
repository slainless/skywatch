import { MessagePackSerializer, type Serializer } from "@deweazer/serializer";
import { type RedisClientType, commandOptions } from "redis";
import type { KV, KVTuple } from "../../index.js";

export const InvalidKeyTypeError = new TypeError("Key must be a string/number");
export const NullValueError = new TypeError(
	"Value must not be null or undefined",
);

export class RedisKV implements KV {
	constructor(
		private client: RedisClientType,
		private serializer = MessagePackSerializer.serializer,
	) {}

	setSerializer(serializer: Serializer) {
		this.serializer = serializer;
	}

	async get(key: any, isRaw?: false): Promise<any>;
	async get(key: any, isRaw: true): Promise<Buffer | null>;
	async get(key: any, isRaw?: boolean): Promise<any> {
		RedisKV.assertKey(key);

		const value = await this.client.get(
			commandOptions({ returnBuffers: true }),
			key.toString(),
		);
		if (value == null || isRaw) return value;

		return this.serializer.deserialize(value);
	}

	async set(key: any, value: any): Promise<void> {
		RedisKV.assertKey(key);
		RedisKV.assertNotNull(value);

		return await void this.client.set(
			key.toString(),
			this.serializer.serialize(value),
		);
	}

	async delete(key: any): Promise<void> {
		RedisKV.assertKey(key);

		return await void this.client.del(key.toString());
	}

	async has(key: any): Promise<boolean> {
		RedisKV.assertKey(key);

		return (await this.client.exists(key.toString())) === 1;
	}

	bulkGet(keys: any[], isRaw?: false): Promise<Array<any | null>>;
	bulkGet(keys: any[], isRaw: true): Promise<Array<Buffer | null>>;
	async bulkGet(keys: any[], isRaw?: boolean): Promise<any[]> {
		if (keys.length === 0) return [];
		RedisKV.assertKeys(keys);

		const values = await this.client.mGet(
			commandOptions({ returnBuffers: true }),
			keys.map((v) => v.toString()),
		);
		if (isRaw) return values;
		return values.map((value) =>
			value == null ? value : this.serializer.deserialize(value),
		);
	}

	async bulkSet(kvTuples: KVTuple[]): Promise<void> {
		RedisKV.assertKVTuples(kvTuples);

		return await void this.client.mSet(
			kvTuples.map(
				([key, value]) => [key, this.serializer.serialize(value)] as any,
			),
		);
	}

	async bulkDelete(keys: any[]): Promise<void> {
		RedisKV.assertKeys(keys);

		return await void this.client.del(keys);
	}

	async bulkHas(keys: any[]): Promise<boolean[]> {
		if (keys.length === 0) return [];
		RedisKV.assertKeys(keys);

		// these bulking commands will be pipelined automatically
		// read: https://github.com/redis/node-redis?tab=readme-ov-file#auto-pipelining
		return Promise.all(keys.map((key) => this.client.exists(key))).then(
			(results) => results.map((result) => result === 1),
		);
	}

	static assertKey(key: any): asserts key is string {
		switch (typeof key) {
			case "number":
			case "string":
				return;
			default:
				throw InvalidKeyTypeError;
		}
	}

	static assertKeys(keys: any[]): asserts keys is string[] {
		for (const key of keys) RedisKV.assertKey(key);
	}

	static assertNotNull(value: any): asserts value is NonNullable<any> {
		if (value == null) throw NullValueError;
	}

	static assertKVTuples(
		kvTuples: KVTuple[],
	): asserts kvTuples is [any, NonNullable<any>][] {
		for (const [key, value] of kvTuples) {
			RedisKV.assertKey(key);
			RedisKV.assertNotNull(value);
		}
	}
}
