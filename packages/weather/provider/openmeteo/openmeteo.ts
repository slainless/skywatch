import { WeatherAPIMismatchError, WeatherQueryError } from "../../error.js";
import { assertHttpResponse } from "../../guard/artifact/openmeteo.js";
import {
	Provider,
	type NormalizedQueryOptions,
	type QueryLocation,
	type QueryOptions,
	type WeatherResult,
} from "../../index.js";
import { mapCurrentSample, mapDailySample, mapHourlySample } from "./conv.js";
import { OpenMeteoParameters, type OpenMeteoResponse } from "./schema.js";

export const OPENMETEO_API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export class OpenMeteoProvider implements Provider {
	async getWeathers<T extends QueryOptions>(
		locations: QueryLocation[],
		options?: T,
	): Promise<WeatherResult<T>[]> {
		if (locations.length === 0)
			throw new WeatherQueryError("Should at minimum request 1 location");
		const opts = Provider.normalizeOptions(options);
		const url = buildUrl(locations, opts);
		const responses = await requestHttp(url);
		try {
			assertHttpResponse(responses);
		} catch (e) {
			throw new WeatherAPIMismatchError(url, e as Error);
		}
		return responses.map(mapResponseToResult);
	}
}

export async function requestHttp(url: URL): Promise<unknown[]> {
	const res = await fetch(url);
	const raw = await res.json();

	if ("reason" in raw && "error" in raw)
		throw new WeatherQueryError(raw.reason);

	if (Array.isArray(raw) === false) return [raw];
	return raw;
}

export function buildUrl(
	locations: QueryLocation[],
	options: NormalizedQueryOptions,
): URL {
	const url = new URL(OPENMETEO_API_BASE_URL);
	const search = url.searchParams;

	{
		const latitude: number[] = [];
		const longitude: number[] = [];

		for (const loc of locations) {
			latitude.push(loc.latitude);
			longitude.push(loc.longitude);
		}

		search.set("latitude", latitude.join(","));
		search.set("longitude", longitude.join(","));
	}

	if (options.current)
		search.set("current", OpenMeteoParameters.current.join(","));

	if (options.hourly) {
		search.set("hourly", OpenMeteoParameters.hourly.join(","));
		search.set("past_hours", options.hourly.pastHours.toString());
		search.set("forecast_hours", options.hourly.forecastHours.toString());
	}

	if (options.daily) {
		search.set("daily", OpenMeteoParameters.daily.join(","));
		search.set("past_days", options.daily.pastDays.toString());
		search.set("forecast_days", options.daily.forecastDays.toString());
	}

	return url;
}

export function mapResponseToResult(
	response: OpenMeteoResponse,
): WeatherResult<any> {
	const result: WeatherResult<any> = Object.create({});

	result.location = {
		latitude: response.latitude,
		longitude: response.longitude,
		altitude: response.elevation,
	};
	result.timezone = response.timezone;
	result.timezoneAbbr = response.timezone_abbreviation;

	if ("current" in response) result.current = mapCurrentSample(response);
	if ("hourly" in response) result.hourly = mapHourlySample(response);
	if ("daily" in response) result.daily = mapDailySample(response);

	return result;
}
