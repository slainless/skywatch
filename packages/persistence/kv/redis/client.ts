import { MessagePackSerializer, type Serializer } from "@deweazer/serializer";
import { type RedisClientType, commandOptions } from "redis";
import type { KV } from "../../index.js";

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
		RedisKV.assertsKey(key);

		const value = await this.client.get(
			commandOptions({ returnBuffers: true }),
			key.toString(),
		);
		if (value == null || isRaw) return value;

		return this.serializer.deserialize(value);
	}

	async set(key: any, value: any): Promise<void> {
		RedisKV.assertsKey(key);
		RedisKV.assertsNotNull(value);

		return await void this.client.set(
			key.toString(),
			this.serializer.serialize(value),
		);
	}

	async delete(key: any): Promise<void> {
		RedisKV.assertsKey(key);

		return await void this.client.del(key.toString());
	}

	async has(key: any): Promise<boolean> {
		RedisKV.assertsKey(key);

		return (await this.client.exists(key.toString())) === 1;
	}

	static assertsKey(key: any): asserts key is number | string {
		switch (typeof key) {
			case "number":
			case "string":
				return;
			default:
				throw InvalidKeyTypeError;
		}
	}

	static assertsNotNull(value: any): asserts value is NonNullable<any> {
		if (value == null) throw NullValueError;
	}
}
