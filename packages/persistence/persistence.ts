export interface Persistence {
	get(key: any): Promise<GetResult>;

	set(key: any, value: any): Promise<void>;
	setToCache(key: any, value: any): Promise<void>;
	setToStorage(key: any, value: any): Promise<void>;
}

export interface GetResult<T = any> {
	cacheHit: boolean;
	storageHit: boolean;
	value?: T | null;
}
