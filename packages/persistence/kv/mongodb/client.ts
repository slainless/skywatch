import type {
	BulkWriteResult,
	Collection,
	DeleteResult,
	MongoClient,
} from "mongodb";
import type { KV, KVTuple } from "../../index.js";

export const UnacknowledgedOperationError = new Error(
	"Unacknowledged operation",
);
export const InvalidKeyTypeError = new TypeError("Key must be a string/number");
export const NullValueError = new TypeError(
	"Value must not be null or undefined",
);

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
		private client: MongoClient,
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
		MongoKV.assertKey(key);

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
		MongoKV.assertKey(key);
		MongoKV.assertNotNull(value);

		const result = await this.collection.updateOne(
			{ [this.options.idField]: key },
			{ $set: { value } },
			{ upsert: true },
		);

		if (result.acknowledged) return;
		throw UnacknowledgedOperationError;
	}

	async delete(key: any): Promise<void> {
		MongoKV.assertKey(key);

		const result = await this.collection.deleteOne({
			[this.options.idField]: key,
		});
		if (result.acknowledged) return;
		throw UnacknowledgedOperationError;
	}

	async has(key: any): Promise<boolean> {
		MongoKV.assertKey(key);

		return (
			(await this.collection.countDocuments({ [this.options.idField]: key })) >
			0
		);
	}

	bulkGet(keys: any[], isRaw?: false): Promise<Array<any | null>>;
	bulkGet(keys: any[], isRaw: true): Promise<Array<Buffer | null>>;
	async bulkGet(keys: any[], isRaw?: boolean): Promise<any[]> {
		if (keys.length === 0) return [];
		MongoKV.assertKeys(keys);

		if (isRaw)
			throw new Error("mongodb client doesn't support returning raw data");

		const result: Record<string, any> = await this.collection
			.find({
				$or: keys.map((key) => ({
					[this.options.idField]: key,
				})),
			})
			.toArray()
			.then((result) =>
				Object.fromEntries(
					result.map((item) => [item[this.options.idField], item]),
				),
			);

		for (const key in result)
			if ("value" in result[key] === false) {
				// delete all wrong formatted data
				result[key] = null;
				this.delete(key);
			} else result[key] = result[key].value;

		return keys.map((key) => result[key] ?? null);
	}

	async bulkSet(kvTuples: KVTuple[]): Promise<void> {
		if (kvTuples.length === 0) return;
		MongoKV.assertKVTuples(kvTuples);

		const session = await this.client.startSession();

		try {
			let result: BulkWriteResult;
			await session.withTransaction(async () => {
				result = await this.collection.bulkWrite(
					kvTuples.map(([key, value]) => ({
						updateOne: {
							filter: { [this.options.idField]: key },
							update: { $set: { value } },
							upsert: true,
						},
					})),
				);
			});

			return;
		} catch (e) {
			await session.endSession();
			throw e;
		}
	}

	async bulkDelete(keys: any[]): Promise<void> {
		if (keys.length === 0) return;
		MongoKV.assertKeys(keys);

		const session = await this.client.startSession();

		try {
			let result: DeleteResult;
			await session.withTransaction(async () => {
				result = await this.collection.deleteMany({
					$or: keys.map((key) => ({ [this.options.idField]: key })),
				});
			});

			return;
		} catch (e) {
			await session.endSession();
			throw e;
		}
	}

	async bulkHas(keys: any[]): Promise<boolean[]> {
		throw new Error("Not implemented yet!");
	}

	static assertKey(key: any): asserts key is number | string {
		switch (typeof key) {
			case "number":
			case "string":
				return;
			default:
				throw InvalidKeyTypeError;
		}
	}

	static assertKeys(keys: any[]): asserts keys is string[] {
		for (const key of keys) MongoKV.assertKey(key);
	}

	static assertNotNull(value: any): asserts value is NonNullable<any> {
		if (value == null) throw NullValueError;
	}

	static assertKVTuples(
		kvTuples: KVTuple[],
	): asserts kvTuples is [any, NonNullable<any>][] {
		for (const [key, value] of kvTuples) {
			MongoKV.assertKey(key);
			MongoKV.assertNotNull(value);
		}
	}
}
