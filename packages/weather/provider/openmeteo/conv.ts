import type { Samples, SamplesWithUnit } from "../../index.js";
import type { OpenMeteoResponseComponents } from "./schema.js";

const currentMap = {
  apparent_temperature: "apparentTemperature",
  cloud_cover: "cloudCoverTotal",
  precipitation: "precipitation",
  rain: "rain",
  relative_humidity_2m: "relativeHumidity",
  showers: "showers",
  snowfall: "snowfall",
  temperature_2m: "temperature",
  weather_code: "weatherCode",
  wind_direction_10m: "windDirection",
  wind_gusts_10m: "windGusts",
  wind_speed_10m: "windSpeed",
  time: "time",
  interval: null,
} as const satisfies util.RecordKeyMap<
  OpenMeteoResponseComponents.CurrentSample,
  Samples.Current
>;

const hourlyMap = {
  ...currentMap,
  cloud_cover: "cloudCoverTotal",
  cloud_cover_high: "cloudCoverHigh",
  cloud_cover_low: "cloudCoverLow",
  cloud_cover_mid: "cloudCoverMedium",
  precipitation_probability: "precipitationProbability",
  visibility: "visibility",
} as const satisfies util.RecordKeyMap<
  OpenMeteoResponseComponents.HourlySample,
  Samples.Hourly
>;

const dailyMap = {
  apparent_temperature_max: "maxApparentTemperature",
  apparent_temperature_min: "minApparentTemperature",
  precipitation_hours: "precipitationHours",
  precipitation_probability_max: "precipitationProbabilityMax",
  precipitation_sum: "precipitationSum",
  rain_sum: "rainSum",
  showers_sum: "showersSum",
  snowfall_sum: "snowfallSum",
  sunrise: "sunrise",
  sunset: "sunset",
  temperature_2m_max: "maxTemperature",
  temperature_2m_min: "minTemperature",
  time: "time",
  weather_code: "weatherCode",
  wind_direction_10m_dominant: "dominantWindDirection",
  wind_gusts_10m_max: "maximumWindGusts",
  wind_speed_10m_max: "maximumWindSpeed",
} as const satisfies util.RecordKeyMap<
  OpenMeteoResponseComponents.DailySample,
  Samples.Daily
>;

export function mapCurrentSample(
  current: OpenMeteoResponseComponents.Current,
): SamplesWithUnit.Current {
  return {
    data: {
      ...util.normalize(current.current, currentMap),
      type: "current",
    },
    units: util.normalize(current.current_units, currentMap),
  };
}

export function mapHourlySample(
  hourly: OpenMeteoResponseComponents.Hourly,
): SamplesWithUnit.Hourly {
  return {
    data: {
      ...util.normalize(hourly.hourly, hourlyMap),
      type: "hourly",
    },
    units: util.normalize(hourly.hourly_units, hourlyMap),
  };
}

export function mapDailySample(
  daily: OpenMeteoResponseComponents.Daily,
): SamplesWithUnit.Daily {
  return {
    data: {
      ...util.normalize(daily.daily, dailyMap),
      type: "daily",
    },
    units: util.normalize(daily.daily_units, dailyMap),
  };
}

namespace util {
  export type RecordKeyMap<From, To> = Record<keyof From, keyof To | null>;
  export type Normalized<
    T extends Record<string, any>,
    M extends Record<keyof T, string | null>,
  > = {
    // [K in keyof T as Exclude<M[K], null>]: T[keyof T] extends Array<infer A> ? A : T[keyof T];
    [K in keyof M as Exclude<M[K], null>]: T[Extract<K, keyof T>];
  };
  export function normalize<
    Base extends Record<string, any>,
    Using extends Record<keyof Base, string | null>,
  >(base: Base, using: Using): Normalized<Base, Using> {
    const sampleProperty = base[Object.keys(using)[0] as string];
    if (sampleProperty == null)
      throw new TypeError("Fail to sample base object!");

    const mapper = (record: any, index?: number) => {
      for (const [from, to] of Object.entries(using)) {
        if (to == null) continue;
        if (index != null) record[to] = base[from][index];
        else record[to] = base[from];
      }
    };

    const record = Object.create({});
    mapper(record);
    return record as any;
  }
}
