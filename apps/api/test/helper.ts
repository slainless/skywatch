import type { KV, Persistence } from "@deweazer/persistence";
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

export function createMockPersistence() {
	const cache = createMockKV();
	const storage = createMockKV();

	return {
		persistence: {
			get: mock(),
			has: mock(),
			set: mock(),
			delete: mock(),
			bulkGet: mock(),
			cache: () => cache,
			storage: () => storage,
		} satisfies Persistence,
		cache,
		storage,
	};
}
