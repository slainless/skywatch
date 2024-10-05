import type {
	QueryLocation,
	QueryOptions,
	NormalizedQueryOptions,
	SampleUsed,
} from "./query.js";
import type { ComposableWeatherData } from "./weather.js";

export interface Provider {
	getWeathers<T extends QueryOptions>(
		locations: QueryLocation[],
		options?: T,
	): Promise<ComposableWeatherData<SampleUsed<T>>[]>;
}

export const DEFAULT_PAST_HOURS = 12;
export const DEFAULT_FORECAST_HOURS = 4;
export const DEFAULT_PAST_DAYS = 7;
export const DEFAULT_FORECAST_DAYS = 7;

export namespace Provider {
	export function normalizeOptions(
		options?: QueryOptions,
	): NormalizedQueryOptions {
		const opts: NormalizedQueryOptions = {
			current: true,
			daily: {
				forecastDays: DEFAULT_FORECAST_DAYS,
				pastDays: DEFAULT_PAST_DAYS,
			},
			hourly: {
				forecastHours: DEFAULT_FORECAST_HOURS,
				pastHours: DEFAULT_PAST_HOURS,
			},
		};

		for (const key in options) {
			const k = key as keyof QueryOptions;
			if (options[k] === false) opts[k] = false;
			else if (typeof options[k] === "object")
				Object.assign(opts[k] as object, options[k]);
		}

		return opts;
	}
}
