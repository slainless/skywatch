import { Backend } from "@deweazer/common";
import type { KV } from "@deweazer/persistence";
import type { StringLike } from "bun";
import type { Request } from "express";

export interface CacheMetadata {
	etag: string;
	expireAt: number;
	maxAge: number;
}

export class CacheRepository extends Backend.Component {
	constructor(private kv: KV) {
		super();
	}

	async get(etags: string[]): Promise<CacheMetadata | undefined> {
		const metadatas = await this.kv.bulkGet(etags);
		return metadatas.find((data) => data != null);
	}

	async cache(
		serializable: StringLike,
		expireAt: number,
		maxAge: number,
	): Promise<CacheMetadata> {
		const metadata = await CacheRepository.createMetadata(
			serializable,
			expireAt,
			maxAge,
		);
		await this.storeMetadata(metadata);
		return metadata;
	}

	async storeMetadata(metadata: CacheMetadata): Promise<void> {
		await this.kv.set(metadata.etag, metadata);
	}

	private static async createMetadata(
		serializable: StringLike,
		expireAt: number,
		maxAge: number,
	): Promise<CacheMetadata> {
		const hash = await CacheRepository.hash(serializable);
		return {
			etag: hash,
			expireAt,
			maxAge,
		};
	}

	private static async hash(serializable: StringLike): Promise<string> {
		const buffer = await crypto.subtle.digest(
			"SHA-1",
			Buffer.from(serializable.toString()),
		);
		return Buffer.from(buffer).toString("utf8");
	}
}
