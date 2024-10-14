import { WeatherAPIMismatchError, WeatherQueryError } from "../../error.js";
import { assertHttpResponse } from "../../guard/artifact/openmeteo.js";
import {
  type NormalizedQueryOptions,
  Provider,
  type QueryLocation,
  type QueryOptions,
  type WeatherData,
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
    search.set(
      "timezone",
      Array(latitude.length)
        .fill(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .join(","),
    );
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

  {
    const now = Date.now();
    const sampleTime = getSampleTime(response);
    if (sampleTime == null)
      Object.assign(result, {
        sampleTimestamp: now,
        sampleIntervalMs: 0,
      } satisfies Partial<WeatherData>);
    else Object.assign(result, sampleTime);
    result.receivedTimestamp = now;
  }

  if ("current" in response) result.current = mapCurrentSample(response);
  if ("hourly" in response) result.hourly = mapHourlySample(response);
  if ("daily" in response) result.daily = mapDailySample(response);

  return result;
}

// TODO: test this function
export function getSampleTime(
  response: OpenMeteoResponse,
): Pick<WeatherData, "sampleTimestamp" | "sampleIntervalMs"> | null {
  if ("current" in response)
    return {
      sampleTimestamp: new Date(response.current.time).getTime(),
      sampleIntervalMs: response.current.interval * 1000,
    };

  if ("hourly" in response) {
    if (response.hourly.time.length < 1) return null;

    const now = Date.now();
    if (response.hourly.time.length === 1) {
      const next = new Date(response.hourly.time[0]!).getTime();
      return {
        sampleTimestamp: next > now ? now : next,
        sampleIntervalMs: 3600e3,
      };
    }

    let totalDelta = 0;
    let nearestSample = new Date(response.hourly.time[0]!).getTime()!;
    let previousSample = nearestSample;
    for (const current of response.hourly.time.slice(1)) {
      const currentSample = new Date(current).getTime();
      totalDelta += Math.abs(currentSample - previousSample);
      if (currentSample > previousSample && currentSample <= now)
        nearestSample = currentSample;
      previousSample = currentSample;
    }

    return {
      sampleTimestamp: nearestSample,
      sampleIntervalMs: Math.round(totalDelta / response.hourly.time.length),
    };
  }

  if ("daily" in response) {
    if (response.daily.time.length < 1) return null;
    if (response.daily.time.length === 1)
      return {
        sampleTimestamp: new Date(response.daily.time[0]!).getTime(),
        sampleIntervalMs: 86400e3,
      };

    const now = Date.now();
    return {
      sampleTimestamp: response.daily.time.reduce((prev, next) => {
        const nextTime = new Date(next).getTime();
        if (nextTime > prev && nextTime <= now) return nextTime;
        return prev;
      }, 0),
      sampleIntervalMs: 86400e3,
    };
  }

  return null;
}

function nearestQuarterHour(date: Date): Date {
  const received = date.getMinutes();
  const nearest = new Date();
  for (const minutes of [45, 30, 15, 0])
    if (received >= minutes) nearest.setMinutes(minutes);
  return nearest;
}
