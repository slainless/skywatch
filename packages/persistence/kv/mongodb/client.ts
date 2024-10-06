import type { Collection } from "mongodb";
import type { KV } from "../../index.js";

export const UnacknowledgedOperationError = new Error(
	"Unacknowledged operation",
);
export const InvalidKeyTypeError = new TypeError("Key must be a string/number");

export interface MongoKVOptions {
	/**
	 * It is highly recommended (even required) to index this field with unique constraint.
	 * Ignoring this at your own risk.
	 */
	idField: string;
}

/**
 * Make sure to use a dedicated collection since this storage is highly destructive when used in
 * a existing collection. For example, if a document doesn't meet the standard format of this storage,
 * the existing document will be purged.
 */
export class MongoKV implements KV {
	constructor(
		/**
		 * Setup the collection before using this driver:
		 * - Set unique index for `options.idField`
		 * - Make sure to use a dedicated collection
		 * - All document should be in format:
		 *  ```json
		 *    {
		 *      "_id": <unique id>,
		 *      "key": <unique id>,
		 *      "value": <document>
		 *    }
		 *  ```
		 */
		private collection: Collection,
		private options: MongoKVOptions,
	) {}

	get(key: any, isRaw?: false): Promise<any>;
	get(key: any, isRaw: true): Promise<Buffer | null>;
	async get(key: any, isRaw?: boolean): Promise<any> {
		MongoKV.assertsKey(key);

		if (isRaw)
			throw new Error("mongodb client doesn't support returning raw data");

		const result = await this.collection.findOne({
			[this.options.idField]: key,
		});
		if (result == null) return null;

		if ("value" in result) return result.value;
		// deleting the existing document, doesn't meet the standard format.
		this.delete(key);
		return null;
	}

	async set(key: any, value: any): Promise<void> {
		MongoKV.assertsKey(key);

		const result = await this.collection.updateOne(
			{ [this.options.idField]: key },
			{ $set: { value } },
			{ upsert: true },
		);

		if (result.acknowledged) return;
		throw UnacknowledgedOperationError;
	}

	async delete(key: any): Promise<void> {
		MongoKV.assertsKey(key);

		const result = await this.collection.deleteOne({
			[this.options.idField]: key,
		});
		if (result.acknowledged) return;
		throw UnacknowledgedOperationError;
	}

	async has(key: any): Promise<boolean> {
		MongoKV.assertsKey(key);

		return (
			(await this.collection.countDocuments({ [this.options.idField]: key })) >
			0
		);
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
