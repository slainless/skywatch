import type { KV } from "@deweazer/persistence";
import { mock } from "bun:test";

export function createMockKV() {
	return {
		set: mock(),
		get: mock(),
		delete: mock(),
		has: mock(),
		bulkGet: mock(),
		bulkSet: mock(),
		bulkDelete: mock(),
		bulkHas: mock(),
	} satisfies KV;
}
