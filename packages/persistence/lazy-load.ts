import type { KV } from "./kv";
import type { GetResult, HasResult, Persistence } from "./persistence";

export class LazyLoadPersistence implements Persistence {
  #cache: KV;
  #storage: KV;

  constructor(cache: KV, storage: KV) {
    this.#cache = cache;
    this.#storage = storage;
  }

  async get(key: any): Promise<GetResult> {
    const cacheResult = await this.#cache.get(key);
    if (cacheResult != null)
      return { cacheHit: true, storageHit: false, value: cacheResult };

    const storageResult = await this.#storage.get(key);
    if (storageResult != null) {
      // setting value asynchronously...
      // we are returning early without waiting for cache to be updated first
      this.#cache.set(key, storageResult);
      return { cacheHit: false, storageHit: true, value: storageResult };
    }

    return { cacheHit: false, storageHit: false, value: null };
  }

  async set(key: any, value: any): Promise<void> {
    return await void Promise.all([
      this.#cache.set(key, value),
      this.#storage.set(key, value),
    ]);
  }

  async has(key: any): Promise<HasResult> {
    const cacheResult = await this.#cache.has(key);
    if (cacheResult) return { cacheHit: true, storageHit: false };

    const storageResult = await this.#storage.has(key);
    if (storageResult)
      // setting value asynchronously...
      // we are returning early without waiting for cache to be updated first
      this.#storage.get(key).then((value) => this.#cache.set(key, value));

    return { cacheHit: false, storageHit: storageResult };
  }

  async delete(key: any): Promise<void> {
    return await void Promise.all([
      this.#storage.delete(key),
      this.#cache.delete(key),
    ]);
  }

  async bulkGet(keys: any[]): Promise<Array<GetResult>> {
    const cacheMiss: any[] = [];
    const result = await this.#cache.bulkGet(keys).then(
      (caches) =>
        Object.fromEntries(
          caches.map((cache, index) => {
            const result: GetResult = {
              cacheHit: true,
              storageHit: false,
              value: cache,
            };

            if (cache == null) {
              result.cacheHit = false;
              cacheMiss.push(keys[index]);
            }

            return [keys[index], result];
          }),
        ) as Record<any, GetResult>,
    );

    if (cacheMiss.length < 1) return keys.map((key) => result[key]!);

    {
      const storageResult = await this.#storage.bulkGet(cacheMiss);
      const storageHit: any[] = [];
      for (const index in cacheMiss) {
        const missedKey = cacheMiss[index];
        const finalResult = result[missedKey]!;
        const storageValue = storageResult[index];

        if (storageValue != null) {
          finalResult.storageHit = true;
          finalResult.value = storageValue;
          storageHit.push([missedKey, storageValue]);
        }
      }

      if (storageHit.length > 0)
        // setting value asynchronously...
        // we are returning early without waiting for cache to be updated first
        this.#cache.bulkSet(storageHit);
    }

    return keys.map((key) => result[key]!);
  }

  cache(): KV {
    return this.#cache;
  }

  storage(): KV {
    return this.#storage;
  }
}
