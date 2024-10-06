import type { KV, Serializer } from "../../index.js";
import { commandOptions, type RedisClientType } from "redis";
import { MessagePackSerializer } from "../../serializer/msgpackr.js";

export const InvalidKeyTypeError = new TypeError("Key must be a string/number");

export class RedisKV implements KV {
	constructor(
		private client: RedisClientType,
		private serializer = new MessagePackSerializer(),
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
		if (value == null) return null;
		if (isRaw) return value;

		const deserialized = this.serializer.deserialize(value);
		if ("__$" in deserialized) return deserialized.__$;
		this.delete(key);
		return null;
	}

	async set(key: any, value: any): Promise<void> {
		RedisKV.assertsKey(key);

		return await void this.client.set(
			key.toString(),
			this.serializer.serialize({ __$: value }),
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
}
