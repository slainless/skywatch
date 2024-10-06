export interface KV {
	get(key: any, isRaw?: false): Promise<any>;
	get(key: any, isRaw: true): Promise<Buffer | null>;
	set(key: any, value: any): Promise<void>;
	delete(key: any): Promise<void>;
	has(key: any): Promise<boolean>;
}
