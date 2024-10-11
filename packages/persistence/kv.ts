export interface KV {
	get(key: any, isRaw?: false): Promise<any | null>;
	get(key: any, isRaw: true): Promise<Buffer | null>;
	set(key: any, value: any): Promise<void>;
	delete(key: any): Promise<void>;
	has(key: any): Promise<boolean>;

	bulkGet(keys: any[], isRaw?: false): Promise<Array<any | null>>;
	bulkGet(keys: any[], isRaw: true): Promise<Array<Buffer | null>>;
	bulkSet(kvTuples: KVTuple[]): Promise<void>;
	bulkDelete(keys: any[]): Promise<void>;
	bulkHas(keys: any[]): Promise<boolean[]>;
}

export type KVTuple = [key: any, value: any] | readonly [key: any, value: any];
