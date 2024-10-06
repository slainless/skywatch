import type { KV } from "./kv";
import type { GetResult, Persistence } from "./persistence";

export class LazyLoadPersistence implements Persistence {
	constructor(
		private cache: KV,
		private storage: KV,
	) {}

	async get(key: any): Promise<GetResult> {
		const cacheResult = await this.cache.get(key);
		if (cacheResult != null)
			return { cacheHit: true, storageHit: false, value: cacheResult };

		const storageResult = await this.storage.get(key);
		if (storageResult != null) {
			this.cache.set(key, storageResult);
			return { cacheHit: false, storageHit: true, value: storageResult };
		}

		return { cacheHit: false, storageHit: false, value: null };
	}

	async set(key: any, value: any): Promise<void> {
		return await void Promise.all([
			this.cache.set(key, value),
			this.storage.set(key, value),
		]);
	}
	setToCache(key: any, value: any): Promise<void> {
		return this.cache.set(key, value);
	}
	setToStorage(key: any, value: any): Promise<void> {
		return this.storage.set(key, value);
	}
}
