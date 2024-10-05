export interface KV {
	get(key: any): Promise<any>;
	set(key: any, value: any): Promise<any>;
	delete(key: any): Promise<void>;
	has(key: any): Promise<boolean>;
}
