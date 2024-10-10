import type { QueryOptions, SampleUsed } from "./query.js";
import type { ComposableWeatherData } from "./weather.js";

export type {
	QueryOptions,
	QueryLocation,
	NormalizedQueryOptions,
	DailyQueryOptions,
	HourlyQueryOptions,
} from "./query.js";
export type {
	Samples,
	SamplesWithUnit,
	WeatherData,
	ComposableWeatherData,
	WMOCode,
} from "./weather.js";
export {
	Provider,
	DEFAULT_FORECAST_DAYS,
	DEFAULT_FORECAST_HOURS,
	DEFAULT_PAST_DAYS,
	DEFAULT_PAST_HOURS,
} from "./provider.js";
export { WeatherQueryError, WeatherAPIMismatchError } from "./error.js";

export type WeatherResult<T extends QueryOptions> = ComposableWeatherData<
	SampleUsed<T>
>;
