import { mock } from "bun:test";
import { EmailPusher } from "@skywatch/email";
import type { KV, Persistence } from "@skywatch/persistence";
import type { Provider } from "@skywatch/weather";
import { WeatherRepository } from "../repository/weather";
import { EventService, WeatherEventHandler } from "../service/event";
import { WeatherService } from "../service/weather";
import { CacheMetadataRepository } from "../repository/cache-metadata";

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

export class MockEmailPusher extends EmailPusher {
	constructor() {
		// @ts-expect-error
		super(undefined);
	}

	send = mock();
}

export class MockWeatherRepository extends WeatherRepository {
	constructor() {
		// @ts-expect-error
		super(undefined);
	}

	setWeathers = mock();
	getWeathers = mock();
}

export class MockWeatherEventHandler extends WeatherEventHandler {
	constructor() {
		// @ts-expect-error
		super(undefined);
	}
	new = mock();
	addPushTarget = mock();
	removePushTarget = mock();
}

export class MockEventService extends EventService {
	constructor(private mockWeather: MockWeatherEventHandler) {
		// @ts-expect-error
		super(undefined);
	}

	weather() {
		return this.mockWeather;
	}
}

export class MockWeatherService extends WeatherService {
	constructor() {
		// @ts-expect-error
		super(undefined, undefined, undefined);
	}

	getWeathers = mock();
}

export class MockCacheMetadataRepository extends CacheMetadataRepository {
	constructor() {
		// @ts-expect-error
		super(undefined);
	}

	cache = mock();
	get = mock();
}

export function createMockProvider() {
	return {
		getWeathers: mock(),
	} satisfies Provider;
}
