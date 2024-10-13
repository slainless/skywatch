import type { KV, KVTuple } from "./kv";

export interface Persistence {
  get(key: any): Promise<GetResult>;
  has(key: any): Promise<HasResult>;
  set(key: any, value: any): Promise<void>;
  delete(key: any): Promise<void>;

  bulkGet(keys: any[]): Promise<Array<GetResult>>;
  // currently unused...
  // bulkHas(keys: any[]): Promise<Array<HasResult>>;
  // bulkSet(kvTuples: KVTuple[]): Promise<void>;
  // bulkDelete(keys: any[]): Promise<void>;

  cache(): KV;
  storage(): KV;
}

export interface HasResult {
  cacheHit: boolean;
  storageHit: boolean;
}

export interface GetResult<T = any> extends HasResult {
  value?: T | null;
}
