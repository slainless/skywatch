export namespace OpenMeteoResponseComponents {
  export interface Common {
    latitude: number;
    longitude: number;
    elevation: number;

    generationtime_ms: number;
    utc_offset_seconds: number;
    location_id?: number;

    // TODO: provide concrete types for these two
    timezone: string;
    timezone_abbreviation: string;
  }

  export interface CurrentSample {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  }

  export interface HourlySample {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    rain: number[];
    showers: number[];
    snowfall: number[];
    weather_code: number[];
    cloud_cover: number[];
    cloud_cover_low: number[];
    cloud_cover_mid: number[];
    cloud_cover_high: number[];
    visibility: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
  }

  export interface DailySample {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
  }

  type UnitsOf<T extends Record<string, any>> = {
    [K in keyof T]: string;
  };

  type Entry<T extends Record<string, any>, K extends string> = {
    [_ in `${K}`]: T;
  } & {
    [_ in `${K}_units`]: UnitsOf<T>;
  };

  export type Daily = Entry<DailySample, "daily">;
  export type Hourly = Entry<HourlySample, "hourly">;
  export type Current = Entry<CurrentSample, "current">;
}

export type OpenMeteoResponseComponents =
  | OpenMeteoResponseComponents.Common
  | OpenMeteoResponseComponents.Current
  | OpenMeteoResponseComponents.Daily
  | OpenMeteoResponseComponents.Hourly;

export type OpenMeteoResponse = OpenMeteoResponseComponents.Common &
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  Exclude<OpenMeteoResponseComponents | {}, OpenMeteoResponseComponents.Common>;

export namespace OpenMeteoParameters {
  export const current = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ] satisfies (keyof OpenMeteoResponseComponents.CurrentSample)[];

  export const hourly = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation_probability",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weather_code",
    "cloud_cover",
    "cloud_cover_low",
    "cloud_cover_mid",
    "cloud_cover_high",
    "visibility",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ] satisfies (keyof OpenMeteoResponseComponents.HourlySample)[];

  export const daily = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "sunrise",
    "sunset",
    "precipitation_sum",
    "rain_sum",
    "showers_sum",
    "snowfall_sum",
    "precipitation_hours",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "wind_direction_10m_dominant",
  ] satisfies (keyof OpenMeteoResponseComponents.DailySample)[];
}
