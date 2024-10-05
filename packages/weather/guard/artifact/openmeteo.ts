import { createAssertGuard, type AssertionGuard } from "typia";
import type { OpenMeteoResponse } from "../../provider/openmeteo/schema.js";
export const assertHttpResponse: AssertionGuard<OpenMeteoResponse[]> = (() => { const $guard = (createAssertGuard as any).guard; const $io0 = (input: any): boolean => "number" === typeof input.latitude && "number" === typeof input.longitude && "number" === typeof input.elevation && "number" === typeof input.generationtime_ms && "number" === typeof input.utc_offset_seconds && (undefined === input.location_id || "number" === typeof input.location_id) && "string" === typeof input.timezone && "string" === typeof input.timezone_abbreviation; const $io1 = (input: any): boolean => "number" === typeof input.latitude && "number" === typeof input.longitude && "number" === typeof input.elevation && "number" === typeof input.generationtime_ms && "number" === typeof input.utc_offset_seconds && (undefined === input.location_id || "number" === typeof input.location_id) && "string" === typeof input.timezone && "string" === typeof input.timezone_abbreviation && ("object" === typeof input.current && null !== input.current && $io2(input.current)) && ("object" === typeof input.current_units && null !== input.current_units && $io3(input.current_units)); const $io2 = (input: any): boolean => "string" === typeof input.time && "number" === typeof input.interval && "number" === typeof input.temperature_2m && "number" === typeof input.relative_humidity_2m && "number" === typeof input.apparent_temperature && "number" === typeof input.precipitation && "number" === typeof input.rain && "number" === typeof input.showers && "number" === typeof input.snowfall && "number" === typeof input.weather_code && "number" === typeof input.cloud_cover && "number" === typeof input.wind_speed_10m && "number" === typeof input.wind_direction_10m && "number" === typeof input.wind_gusts_10m; const $io3 = (input: any): boolean => "string" === typeof input.time && "string" === typeof input.interval && "string" === typeof input.temperature_2m && "string" === typeof input.relative_humidity_2m && "string" === typeof input.apparent_temperature && "string" === typeof input.precipitation && "string" === typeof input.rain && "string" === typeof input.showers && "string" === typeof input.snowfall && "string" === typeof input.weather_code && "string" === typeof input.cloud_cover && "string" === typeof input.wind_speed_10m && "string" === typeof input.wind_direction_10m && "string" === typeof input.wind_gusts_10m; const $io4 = (input: any): boolean => "number" === typeof input.latitude && "number" === typeof input.longitude && "number" === typeof input.elevation && "number" === typeof input.generationtime_ms && "number" === typeof input.utc_offset_seconds && (undefined === input.location_id || "number" === typeof input.location_id) && "string" === typeof input.timezone && "string" === typeof input.timezone_abbreviation && ("object" === typeof input.daily && null !== input.daily && $io5(input.daily)) && ("object" === typeof input.daily_units && null !== input.daily_units && $io6(input.daily_units)); const $io5 = (input: any): boolean => Array.isArray(input.time) && input.time.every((elem: any) => "string" === typeof elem) && (Array.isArray(input.weather_code) && input.weather_code.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.temperature_2m_max) && input.temperature_2m_max.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.temperature_2m_min) && input.temperature_2m_min.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.apparent_temperature_max) && input.apparent_temperature_max.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.apparent_temperature_min) && input.apparent_temperature_min.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.sunrise) && input.sunrise.every((elem: any) => "string" === typeof elem)) && (Array.isArray(input.sunset) && input.sunset.every((elem: any) => "string" === typeof elem)) && (Array.isArray(input.precipitation_sum) && input.precipitation_sum.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.rain_sum) && input.rain_sum.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.showers_sum) && input.showers_sum.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.snowfall_sum) && input.snowfall_sum.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.precipitation_hours) && input.precipitation_hours.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.precipitation_probability_max) && input.precipitation_probability_max.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.wind_speed_10m_max) && input.wind_speed_10m_max.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.wind_gusts_10m_max) && input.wind_gusts_10m_max.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.wind_direction_10m_dominant) && input.wind_direction_10m_dominant.every((elem: any) => "number" === typeof elem)); const $io6 = (input: any): boolean => "string" === typeof input.time && "string" === typeof input.weather_code && "string" === typeof input.temperature_2m_max && "string" === typeof input.temperature_2m_min && "string" === typeof input.apparent_temperature_max && "string" === typeof input.apparent_temperature_min && "string" === typeof input.sunrise && "string" === typeof input.sunset && "string" === typeof input.precipitation_sum && "string" === typeof input.rain_sum && "string" === typeof input.showers_sum && "string" === typeof input.snowfall_sum && "string" === typeof input.precipitation_hours && "string" === typeof input.precipitation_probability_max && "string" === typeof input.wind_speed_10m_max && "string" === typeof input.wind_gusts_10m_max && "string" === typeof input.wind_direction_10m_dominant; const $io7 = (input: any): boolean => "number" === typeof input.latitude && "number" === typeof input.longitude && "number" === typeof input.elevation && "number" === typeof input.generationtime_ms && "number" === typeof input.utc_offset_seconds && (undefined === input.location_id || "number" === typeof input.location_id) && "string" === typeof input.timezone && "string" === typeof input.timezone_abbreviation && ("object" === typeof input.hourly && null !== input.hourly && $io8(input.hourly)) && ("object" === typeof input.hourly_units && null !== input.hourly_units && $io9(input.hourly_units)); const $io8 = (input: any): boolean => Array.isArray(input.time) && input.time.every((elem: any) => "string" === typeof elem) && (Array.isArray(input.temperature_2m) && input.temperature_2m.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.relative_humidity_2m) && input.relative_humidity_2m.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.apparent_temperature) && input.apparent_temperature.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.precipitation_probability) && input.precipitation_probability.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.precipitation) && input.precipitation.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.rain) && input.rain.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.showers) && input.showers.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.snowfall) && input.snowfall.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.weather_code) && input.weather_code.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.cloud_cover) && input.cloud_cover.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.cloud_cover_low) && input.cloud_cover_low.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.cloud_cover_mid) && input.cloud_cover_mid.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.cloud_cover_high) && input.cloud_cover_high.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.visibility) && input.visibility.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.wind_speed_10m) && input.wind_speed_10m.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.wind_direction_10m) && input.wind_direction_10m.every((elem: any) => "number" === typeof elem)) && (Array.isArray(input.wind_gusts_10m) && input.wind_gusts_10m.every((elem: any) => "number" === typeof elem)); const $io9 = (input: any): boolean => "string" === typeof input.time && "string" === typeof input.temperature_2m && "string" === typeof input.relative_humidity_2m && "string" === typeof input.apparent_temperature && "string" === typeof input.precipitation_probability && "string" === typeof input.precipitation && "string" === typeof input.rain && "string" === typeof input.showers && "string" === typeof input.snowfall && "string" === typeof input.weather_code && "string" === typeof input.cloud_cover && "string" === typeof input.cloud_cover_low && "string" === typeof input.cloud_cover_mid && "string" === typeof input.cloud_cover_high && "string" === typeof input.visibility && "string" === typeof input.wind_speed_10m && "string" === typeof input.wind_direction_10m && "string" === typeof input.wind_gusts_10m; const $iu0 = (input: any): any => (() => {
    if (undefined !== input.current)
        return $io1(input);
    else if (undefined !== input.daily)
        return $io4(input);
    else if (undefined !== input.hourly)
        return $io7(input);
    else
        return $io0(input);
})(); const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.latitude || $guard(_exceptionable, {
    path: _path + ".latitude",
    expected: "number",
    value: input.latitude
}, _errorFactory)) && ("number" === typeof input.longitude || $guard(_exceptionable, {
    path: _path + ".longitude",
    expected: "number",
    value: input.longitude
}, _errorFactory)) && ("number" === typeof input.elevation || $guard(_exceptionable, {
    path: _path + ".elevation",
    expected: "number",
    value: input.elevation
}, _errorFactory)) && ("number" === typeof input.generationtime_ms || $guard(_exceptionable, {
    path: _path + ".generationtime_ms",
    expected: "number",
    value: input.generationtime_ms
}, _errorFactory)) && ("number" === typeof input.utc_offset_seconds || $guard(_exceptionable, {
    path: _path + ".utc_offset_seconds",
    expected: "number",
    value: input.utc_offset_seconds
}, _errorFactory)) && (undefined === input.location_id || "number" === typeof input.location_id || $guard(_exceptionable, {
    path: _path + ".location_id",
    expected: "(number | undefined)",
    value: input.location_id
}, _errorFactory)) && ("string" === typeof input.timezone || $guard(_exceptionable, {
    path: _path + ".timezone",
    expected: "string",
    value: input.timezone
}, _errorFactory)) && ("string" === typeof input.timezone_abbreviation || $guard(_exceptionable, {
    path: _path + ".timezone_abbreviation",
    expected: "string",
    value: input.timezone_abbreviation
}, _errorFactory)); const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.latitude || $guard(_exceptionable, {
    path: _path + ".latitude",
    expected: "number",
    value: input.latitude
}, _errorFactory)) && ("number" === typeof input.longitude || $guard(_exceptionable, {
    path: _path + ".longitude",
    expected: "number",
    value: input.longitude
}, _errorFactory)) && ("number" === typeof input.elevation || $guard(_exceptionable, {
    path: _path + ".elevation",
    expected: "number",
    value: input.elevation
}, _errorFactory)) && ("number" === typeof input.generationtime_ms || $guard(_exceptionable, {
    path: _path + ".generationtime_ms",
    expected: "number",
    value: input.generationtime_ms
}, _errorFactory)) && ("number" === typeof input.utc_offset_seconds || $guard(_exceptionable, {
    path: _path + ".utc_offset_seconds",
    expected: "number",
    value: input.utc_offset_seconds
}, _errorFactory)) && (undefined === input.location_id || "number" === typeof input.location_id || $guard(_exceptionable, {
    path: _path + ".location_id",
    expected: "(number | undefined)",
    value: input.location_id
}, _errorFactory)) && ("string" === typeof input.timezone || $guard(_exceptionable, {
    path: _path + ".timezone",
    expected: "string",
    value: input.timezone
}, _errorFactory)) && ("string" === typeof input.timezone_abbreviation || $guard(_exceptionable, {
    path: _path + ".timezone_abbreviation",
    expected: "string",
    value: input.timezone_abbreviation
}, _errorFactory)) && (("object" === typeof input.current && null !== input.current || $guard(_exceptionable, {
    path: _path + ".current",
    expected: "OpenMeteoResponseComponents.CurrentSample",
    value: input.current
}, _errorFactory)) && $ao2(input.current, _path + ".current", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".current",
    expected: "OpenMeteoResponseComponents.CurrentSample",
    value: input.current
}, _errorFactory)) && (("object" === typeof input.current_units && null !== input.current_units || $guard(_exceptionable, {
    path: _path + ".current_units",
    expected: "OpenMeteoResponseComponents.UnitsOf<OpenMeteoResponseComponents.CurrentSample>",
    value: input.current_units
}, _errorFactory)) && $ao3(input.current_units, _path + ".current_units", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".current_units",
    expected: "OpenMeteoResponseComponents.UnitsOf<OpenMeteoResponseComponents.CurrentSample>",
    value: input.current_units
}, _errorFactory)); const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.time || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "string",
    value: input.time
}, _errorFactory)) && ("number" === typeof input.interval || $guard(_exceptionable, {
    path: _path + ".interval",
    expected: "number",
    value: input.interval
}, _errorFactory)) && ("number" === typeof input.temperature_2m || $guard(_exceptionable, {
    path: _path + ".temperature_2m",
    expected: "number",
    value: input.temperature_2m
}, _errorFactory)) && ("number" === typeof input.relative_humidity_2m || $guard(_exceptionable, {
    path: _path + ".relative_humidity_2m",
    expected: "number",
    value: input.relative_humidity_2m
}, _errorFactory)) && ("number" === typeof input.apparent_temperature || $guard(_exceptionable, {
    path: _path + ".apparent_temperature",
    expected: "number",
    value: input.apparent_temperature
}, _errorFactory)) && ("number" === typeof input.precipitation || $guard(_exceptionable, {
    path: _path + ".precipitation",
    expected: "number",
    value: input.precipitation
}, _errorFactory)) && ("number" === typeof input.rain || $guard(_exceptionable, {
    path: _path + ".rain",
    expected: "number",
    value: input.rain
}, _errorFactory)) && ("number" === typeof input.showers || $guard(_exceptionable, {
    path: _path + ".showers",
    expected: "number",
    value: input.showers
}, _errorFactory)) && ("number" === typeof input.snowfall || $guard(_exceptionable, {
    path: _path + ".snowfall",
    expected: "number",
    value: input.snowfall
}, _errorFactory)) && ("number" === typeof input.weather_code || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "number",
    value: input.weather_code
}, _errorFactory)) && ("number" === typeof input.cloud_cover || $guard(_exceptionable, {
    path: _path + ".cloud_cover",
    expected: "number",
    value: input.cloud_cover
}, _errorFactory)) && ("number" === typeof input.wind_speed_10m || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m",
    expected: "number",
    value: input.wind_speed_10m
}, _errorFactory)) && ("number" === typeof input.wind_direction_10m || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m",
    expected: "number",
    value: input.wind_direction_10m
}, _errorFactory)) && ("number" === typeof input.wind_gusts_10m || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m",
    expected: "number",
    value: input.wind_gusts_10m
}, _errorFactory)); const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.time || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "string",
    value: input.time
}, _errorFactory)) && ("string" === typeof input.interval || $guard(_exceptionable, {
    path: _path + ".interval",
    expected: "string",
    value: input.interval
}, _errorFactory)) && ("string" === typeof input.temperature_2m || $guard(_exceptionable, {
    path: _path + ".temperature_2m",
    expected: "string",
    value: input.temperature_2m
}, _errorFactory)) && ("string" === typeof input.relative_humidity_2m || $guard(_exceptionable, {
    path: _path + ".relative_humidity_2m",
    expected: "string",
    value: input.relative_humidity_2m
}, _errorFactory)) && ("string" === typeof input.apparent_temperature || $guard(_exceptionable, {
    path: _path + ".apparent_temperature",
    expected: "string",
    value: input.apparent_temperature
}, _errorFactory)) && ("string" === typeof input.precipitation || $guard(_exceptionable, {
    path: _path + ".precipitation",
    expected: "string",
    value: input.precipitation
}, _errorFactory)) && ("string" === typeof input.rain || $guard(_exceptionable, {
    path: _path + ".rain",
    expected: "string",
    value: input.rain
}, _errorFactory)) && ("string" === typeof input.showers || $guard(_exceptionable, {
    path: _path + ".showers",
    expected: "string",
    value: input.showers
}, _errorFactory)) && ("string" === typeof input.snowfall || $guard(_exceptionable, {
    path: _path + ".snowfall",
    expected: "string",
    value: input.snowfall
}, _errorFactory)) && ("string" === typeof input.weather_code || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "string",
    value: input.weather_code
}, _errorFactory)) && ("string" === typeof input.cloud_cover || $guard(_exceptionable, {
    path: _path + ".cloud_cover",
    expected: "string",
    value: input.cloud_cover
}, _errorFactory)) && ("string" === typeof input.wind_speed_10m || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m",
    expected: "string",
    value: input.wind_speed_10m
}, _errorFactory)) && ("string" === typeof input.wind_direction_10m || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m",
    expected: "string",
    value: input.wind_direction_10m
}, _errorFactory)) && ("string" === typeof input.wind_gusts_10m || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m",
    expected: "string",
    value: input.wind_gusts_10m
}, _errorFactory)); const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.latitude || $guard(_exceptionable, {
    path: _path + ".latitude",
    expected: "number",
    value: input.latitude
}, _errorFactory)) && ("number" === typeof input.longitude || $guard(_exceptionable, {
    path: _path + ".longitude",
    expected: "number",
    value: input.longitude
}, _errorFactory)) && ("number" === typeof input.elevation || $guard(_exceptionable, {
    path: _path + ".elevation",
    expected: "number",
    value: input.elevation
}, _errorFactory)) && ("number" === typeof input.generationtime_ms || $guard(_exceptionable, {
    path: _path + ".generationtime_ms",
    expected: "number",
    value: input.generationtime_ms
}, _errorFactory)) && ("number" === typeof input.utc_offset_seconds || $guard(_exceptionable, {
    path: _path + ".utc_offset_seconds",
    expected: "number",
    value: input.utc_offset_seconds
}, _errorFactory)) && (undefined === input.location_id || "number" === typeof input.location_id || $guard(_exceptionable, {
    path: _path + ".location_id",
    expected: "(number | undefined)",
    value: input.location_id
}, _errorFactory)) && ("string" === typeof input.timezone || $guard(_exceptionable, {
    path: _path + ".timezone",
    expected: "string",
    value: input.timezone
}, _errorFactory)) && ("string" === typeof input.timezone_abbreviation || $guard(_exceptionable, {
    path: _path + ".timezone_abbreviation",
    expected: "string",
    value: input.timezone_abbreviation
}, _errorFactory)) && (("object" === typeof input.daily && null !== input.daily || $guard(_exceptionable, {
    path: _path + ".daily",
    expected: "OpenMeteoResponseComponents.DailySample",
    value: input.daily
}, _errorFactory)) && $ao5(input.daily, _path + ".daily", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".daily",
    expected: "OpenMeteoResponseComponents.DailySample",
    value: input.daily
}, _errorFactory)) && (("object" === typeof input.daily_units && null !== input.daily_units || $guard(_exceptionable, {
    path: _path + ".daily_units",
    expected: "OpenMeteoResponseComponents.UnitsOf<OpenMeteoResponseComponents.DailySample>",
    value: input.daily_units
}, _errorFactory)) && $ao6(input.daily_units, _path + ".daily_units", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".daily_units",
    expected: "OpenMeteoResponseComponents.UnitsOf<OpenMeteoResponseComponents.DailySample>",
    value: input.daily_units
}, _errorFactory)); const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ((Array.isArray(input.time) || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "Array<string>",
    value: input.time
}, _errorFactory)) && input.time.every((elem: any, _index38: number) => "string" === typeof elem || $guard(_exceptionable, {
    path: _path + ".time[" + _index38 + "]",
    expected: "string",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "Array<string>",
    value: input.time
}, _errorFactory)) && ((Array.isArray(input.weather_code) || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "Array<number>",
    value: input.weather_code
}, _errorFactory)) && input.weather_code.every((elem: any, _index39: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".weather_code[" + _index39 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "Array<number>",
    value: input.weather_code
}, _errorFactory)) && ((Array.isArray(input.temperature_2m_max) || $guard(_exceptionable, {
    path: _path + ".temperature_2m_max",
    expected: "Array<number>",
    value: input.temperature_2m_max
}, _errorFactory)) && input.temperature_2m_max.every((elem: any, _index40: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".temperature_2m_max[" + _index40 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".temperature_2m_max",
    expected: "Array<number>",
    value: input.temperature_2m_max
}, _errorFactory)) && ((Array.isArray(input.temperature_2m_min) || $guard(_exceptionable, {
    path: _path + ".temperature_2m_min",
    expected: "Array<number>",
    value: input.temperature_2m_min
}, _errorFactory)) && input.temperature_2m_min.every((elem: any, _index41: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".temperature_2m_min[" + _index41 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".temperature_2m_min",
    expected: "Array<number>",
    value: input.temperature_2m_min
}, _errorFactory)) && ((Array.isArray(input.apparent_temperature_max) || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_max",
    expected: "Array<number>",
    value: input.apparent_temperature_max
}, _errorFactory)) && input.apparent_temperature_max.every((elem: any, _index42: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_max[" + _index42 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_max",
    expected: "Array<number>",
    value: input.apparent_temperature_max
}, _errorFactory)) && ((Array.isArray(input.apparent_temperature_min) || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_min",
    expected: "Array<number>",
    value: input.apparent_temperature_min
}, _errorFactory)) && input.apparent_temperature_min.every((elem: any, _index43: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_min[" + _index43 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_min",
    expected: "Array<number>",
    value: input.apparent_temperature_min
}, _errorFactory)) && ((Array.isArray(input.sunrise) || $guard(_exceptionable, {
    path: _path + ".sunrise",
    expected: "Array<string>",
    value: input.sunrise
}, _errorFactory)) && input.sunrise.every((elem: any, _index44: number) => "string" === typeof elem || $guard(_exceptionable, {
    path: _path + ".sunrise[" + _index44 + "]",
    expected: "string",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".sunrise",
    expected: "Array<string>",
    value: input.sunrise
}, _errorFactory)) && ((Array.isArray(input.sunset) || $guard(_exceptionable, {
    path: _path + ".sunset",
    expected: "Array<string>",
    value: input.sunset
}, _errorFactory)) && input.sunset.every((elem: any, _index45: number) => "string" === typeof elem || $guard(_exceptionable, {
    path: _path + ".sunset[" + _index45 + "]",
    expected: "string",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".sunset",
    expected: "Array<string>",
    value: input.sunset
}, _errorFactory)) && ((Array.isArray(input.precipitation_sum) || $guard(_exceptionable, {
    path: _path + ".precipitation_sum",
    expected: "Array<number>",
    value: input.precipitation_sum
}, _errorFactory)) && input.precipitation_sum.every((elem: any, _index46: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".precipitation_sum[" + _index46 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".precipitation_sum",
    expected: "Array<number>",
    value: input.precipitation_sum
}, _errorFactory)) && ((Array.isArray(input.rain_sum) || $guard(_exceptionable, {
    path: _path + ".rain_sum",
    expected: "Array<number>",
    value: input.rain_sum
}, _errorFactory)) && input.rain_sum.every((elem: any, _index47: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".rain_sum[" + _index47 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".rain_sum",
    expected: "Array<number>",
    value: input.rain_sum
}, _errorFactory)) && ((Array.isArray(input.showers_sum) || $guard(_exceptionable, {
    path: _path + ".showers_sum",
    expected: "Array<number>",
    value: input.showers_sum
}, _errorFactory)) && input.showers_sum.every((elem: any, _index48: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".showers_sum[" + _index48 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".showers_sum",
    expected: "Array<number>",
    value: input.showers_sum
}, _errorFactory)) && ((Array.isArray(input.snowfall_sum) || $guard(_exceptionable, {
    path: _path + ".snowfall_sum",
    expected: "Array<number>",
    value: input.snowfall_sum
}, _errorFactory)) && input.snowfall_sum.every((elem: any, _index49: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".snowfall_sum[" + _index49 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".snowfall_sum",
    expected: "Array<number>",
    value: input.snowfall_sum
}, _errorFactory)) && ((Array.isArray(input.precipitation_hours) || $guard(_exceptionable, {
    path: _path + ".precipitation_hours",
    expected: "Array<number>",
    value: input.precipitation_hours
}, _errorFactory)) && input.precipitation_hours.every((elem: any, _index50: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".precipitation_hours[" + _index50 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".precipitation_hours",
    expected: "Array<number>",
    value: input.precipitation_hours
}, _errorFactory)) && ((Array.isArray(input.precipitation_probability_max) || $guard(_exceptionable, {
    path: _path + ".precipitation_probability_max",
    expected: "Array<number>",
    value: input.precipitation_probability_max
}, _errorFactory)) && input.precipitation_probability_max.every((elem: any, _index51: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".precipitation_probability_max[" + _index51 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".precipitation_probability_max",
    expected: "Array<number>",
    value: input.precipitation_probability_max
}, _errorFactory)) && ((Array.isArray(input.wind_speed_10m_max) || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m_max",
    expected: "Array<number>",
    value: input.wind_speed_10m_max
}, _errorFactory)) && input.wind_speed_10m_max.every((elem: any, _index52: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m_max[" + _index52 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m_max",
    expected: "Array<number>",
    value: input.wind_speed_10m_max
}, _errorFactory)) && ((Array.isArray(input.wind_gusts_10m_max) || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m_max",
    expected: "Array<number>",
    value: input.wind_gusts_10m_max
}, _errorFactory)) && input.wind_gusts_10m_max.every((elem: any, _index53: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m_max[" + _index53 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m_max",
    expected: "Array<number>",
    value: input.wind_gusts_10m_max
}, _errorFactory)) && ((Array.isArray(input.wind_direction_10m_dominant) || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m_dominant",
    expected: "Array<number>",
    value: input.wind_direction_10m_dominant
}, _errorFactory)) && input.wind_direction_10m_dominant.every((elem: any, _index54: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m_dominant[" + _index54 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m_dominant",
    expected: "Array<number>",
    value: input.wind_direction_10m_dominant
}, _errorFactory)); const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.time || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "string",
    value: input.time
}, _errorFactory)) && ("string" === typeof input.weather_code || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "string",
    value: input.weather_code
}, _errorFactory)) && ("string" === typeof input.temperature_2m_max || $guard(_exceptionable, {
    path: _path + ".temperature_2m_max",
    expected: "string",
    value: input.temperature_2m_max
}, _errorFactory)) && ("string" === typeof input.temperature_2m_min || $guard(_exceptionable, {
    path: _path + ".temperature_2m_min",
    expected: "string",
    value: input.temperature_2m_min
}, _errorFactory)) && ("string" === typeof input.apparent_temperature_max || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_max",
    expected: "string",
    value: input.apparent_temperature_max
}, _errorFactory)) && ("string" === typeof input.apparent_temperature_min || $guard(_exceptionable, {
    path: _path + ".apparent_temperature_min",
    expected: "string",
    value: input.apparent_temperature_min
}, _errorFactory)) && ("string" === typeof input.sunrise || $guard(_exceptionable, {
    path: _path + ".sunrise",
    expected: "string",
    value: input.sunrise
}, _errorFactory)) && ("string" === typeof input.sunset || $guard(_exceptionable, {
    path: _path + ".sunset",
    expected: "string",
    value: input.sunset
}, _errorFactory)) && ("string" === typeof input.precipitation_sum || $guard(_exceptionable, {
    path: _path + ".precipitation_sum",
    expected: "string",
    value: input.precipitation_sum
}, _errorFactory)) && ("string" === typeof input.rain_sum || $guard(_exceptionable, {
    path: _path + ".rain_sum",
    expected: "string",
    value: input.rain_sum
}, _errorFactory)) && ("string" === typeof input.showers_sum || $guard(_exceptionable, {
    path: _path + ".showers_sum",
    expected: "string",
    value: input.showers_sum
}, _errorFactory)) && ("string" === typeof input.snowfall_sum || $guard(_exceptionable, {
    path: _path + ".snowfall_sum",
    expected: "string",
    value: input.snowfall_sum
}, _errorFactory)) && ("string" === typeof input.precipitation_hours || $guard(_exceptionable, {
    path: _path + ".precipitation_hours",
    expected: "string",
    value: input.precipitation_hours
}, _errorFactory)) && ("string" === typeof input.precipitation_probability_max || $guard(_exceptionable, {
    path: _path + ".precipitation_probability_max",
    expected: "string",
    value: input.precipitation_probability_max
}, _errorFactory)) && ("string" === typeof input.wind_speed_10m_max || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m_max",
    expected: "string",
    value: input.wind_speed_10m_max
}, _errorFactory)) && ("string" === typeof input.wind_gusts_10m_max || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m_max",
    expected: "string",
    value: input.wind_gusts_10m_max
}, _errorFactory)) && ("string" === typeof input.wind_direction_10m_dominant || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m_dominant",
    expected: "string",
    value: input.wind_direction_10m_dominant
}, _errorFactory)); const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.latitude || $guard(_exceptionable, {
    path: _path + ".latitude",
    expected: "number",
    value: input.latitude
}, _errorFactory)) && ("number" === typeof input.longitude || $guard(_exceptionable, {
    path: _path + ".longitude",
    expected: "number",
    value: input.longitude
}, _errorFactory)) && ("number" === typeof input.elevation || $guard(_exceptionable, {
    path: _path + ".elevation",
    expected: "number",
    value: input.elevation
}, _errorFactory)) && ("number" === typeof input.generationtime_ms || $guard(_exceptionable, {
    path: _path + ".generationtime_ms",
    expected: "number",
    value: input.generationtime_ms
}, _errorFactory)) && ("number" === typeof input.utc_offset_seconds || $guard(_exceptionable, {
    path: _path + ".utc_offset_seconds",
    expected: "number",
    value: input.utc_offset_seconds
}, _errorFactory)) && (undefined === input.location_id || "number" === typeof input.location_id || $guard(_exceptionable, {
    path: _path + ".location_id",
    expected: "(number | undefined)",
    value: input.location_id
}, _errorFactory)) && ("string" === typeof input.timezone || $guard(_exceptionable, {
    path: _path + ".timezone",
    expected: "string",
    value: input.timezone
}, _errorFactory)) && ("string" === typeof input.timezone_abbreviation || $guard(_exceptionable, {
    path: _path + ".timezone_abbreviation",
    expected: "string",
    value: input.timezone_abbreviation
}, _errorFactory)) && (("object" === typeof input.hourly && null !== input.hourly || $guard(_exceptionable, {
    path: _path + ".hourly",
    expected: "OpenMeteoResponseComponents.HourlySample",
    value: input.hourly
}, _errorFactory)) && $ao8(input.hourly, _path + ".hourly", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".hourly",
    expected: "OpenMeteoResponseComponents.HourlySample",
    value: input.hourly
}, _errorFactory)) && (("object" === typeof input.hourly_units && null !== input.hourly_units || $guard(_exceptionable, {
    path: _path + ".hourly_units",
    expected: "OpenMeteoResponseComponents.UnitsOf<OpenMeteoResponseComponents.HourlySample>",
    value: input.hourly_units
}, _errorFactory)) && $ao9(input.hourly_units, _path + ".hourly_units", true && _exceptionable) || $guard(_exceptionable, {
    path: _path + ".hourly_units",
    expected: "OpenMeteoResponseComponents.UnitsOf<OpenMeteoResponseComponents.HourlySample>",
    value: input.hourly_units
}, _errorFactory)); const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ((Array.isArray(input.time) || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "Array<string>",
    value: input.time
}, _errorFactory)) && input.time.every((elem: any, _index55: number) => "string" === typeof elem || $guard(_exceptionable, {
    path: _path + ".time[" + _index55 + "]",
    expected: "string",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "Array<string>",
    value: input.time
}, _errorFactory)) && ((Array.isArray(input.temperature_2m) || $guard(_exceptionable, {
    path: _path + ".temperature_2m",
    expected: "Array<number>",
    value: input.temperature_2m
}, _errorFactory)) && input.temperature_2m.every((elem: any, _index56: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".temperature_2m[" + _index56 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".temperature_2m",
    expected: "Array<number>",
    value: input.temperature_2m
}, _errorFactory)) && ((Array.isArray(input.relative_humidity_2m) || $guard(_exceptionable, {
    path: _path + ".relative_humidity_2m",
    expected: "Array<number>",
    value: input.relative_humidity_2m
}, _errorFactory)) && input.relative_humidity_2m.every((elem: any, _index57: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".relative_humidity_2m[" + _index57 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".relative_humidity_2m",
    expected: "Array<number>",
    value: input.relative_humidity_2m
}, _errorFactory)) && ((Array.isArray(input.apparent_temperature) || $guard(_exceptionable, {
    path: _path + ".apparent_temperature",
    expected: "Array<number>",
    value: input.apparent_temperature
}, _errorFactory)) && input.apparent_temperature.every((elem: any, _index58: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".apparent_temperature[" + _index58 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".apparent_temperature",
    expected: "Array<number>",
    value: input.apparent_temperature
}, _errorFactory)) && ((Array.isArray(input.precipitation_probability) || $guard(_exceptionable, {
    path: _path + ".precipitation_probability",
    expected: "Array<number>",
    value: input.precipitation_probability
}, _errorFactory)) && input.precipitation_probability.every((elem: any, _index59: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".precipitation_probability[" + _index59 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".precipitation_probability",
    expected: "Array<number>",
    value: input.precipitation_probability
}, _errorFactory)) && ((Array.isArray(input.precipitation) || $guard(_exceptionable, {
    path: _path + ".precipitation",
    expected: "Array<number>",
    value: input.precipitation
}, _errorFactory)) && input.precipitation.every((elem: any, _index60: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".precipitation[" + _index60 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".precipitation",
    expected: "Array<number>",
    value: input.precipitation
}, _errorFactory)) && ((Array.isArray(input.rain) || $guard(_exceptionable, {
    path: _path + ".rain",
    expected: "Array<number>",
    value: input.rain
}, _errorFactory)) && input.rain.every((elem: any, _index61: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".rain[" + _index61 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".rain",
    expected: "Array<number>",
    value: input.rain
}, _errorFactory)) && ((Array.isArray(input.showers) || $guard(_exceptionable, {
    path: _path + ".showers",
    expected: "Array<number>",
    value: input.showers
}, _errorFactory)) && input.showers.every((elem: any, _index62: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".showers[" + _index62 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".showers",
    expected: "Array<number>",
    value: input.showers
}, _errorFactory)) && ((Array.isArray(input.snowfall) || $guard(_exceptionable, {
    path: _path + ".snowfall",
    expected: "Array<number>",
    value: input.snowfall
}, _errorFactory)) && input.snowfall.every((elem: any, _index63: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".snowfall[" + _index63 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".snowfall",
    expected: "Array<number>",
    value: input.snowfall
}, _errorFactory)) && ((Array.isArray(input.weather_code) || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "Array<number>",
    value: input.weather_code
}, _errorFactory)) && input.weather_code.every((elem: any, _index64: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".weather_code[" + _index64 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "Array<number>",
    value: input.weather_code
}, _errorFactory)) && ((Array.isArray(input.cloud_cover) || $guard(_exceptionable, {
    path: _path + ".cloud_cover",
    expected: "Array<number>",
    value: input.cloud_cover
}, _errorFactory)) && input.cloud_cover.every((elem: any, _index65: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".cloud_cover[" + _index65 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".cloud_cover",
    expected: "Array<number>",
    value: input.cloud_cover
}, _errorFactory)) && ((Array.isArray(input.cloud_cover_low) || $guard(_exceptionable, {
    path: _path + ".cloud_cover_low",
    expected: "Array<number>",
    value: input.cloud_cover_low
}, _errorFactory)) && input.cloud_cover_low.every((elem: any, _index66: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".cloud_cover_low[" + _index66 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".cloud_cover_low",
    expected: "Array<number>",
    value: input.cloud_cover_low
}, _errorFactory)) && ((Array.isArray(input.cloud_cover_mid) || $guard(_exceptionable, {
    path: _path + ".cloud_cover_mid",
    expected: "Array<number>",
    value: input.cloud_cover_mid
}, _errorFactory)) && input.cloud_cover_mid.every((elem: any, _index67: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".cloud_cover_mid[" + _index67 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".cloud_cover_mid",
    expected: "Array<number>",
    value: input.cloud_cover_mid
}, _errorFactory)) && ((Array.isArray(input.cloud_cover_high) || $guard(_exceptionable, {
    path: _path + ".cloud_cover_high",
    expected: "Array<number>",
    value: input.cloud_cover_high
}, _errorFactory)) && input.cloud_cover_high.every((elem: any, _index68: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".cloud_cover_high[" + _index68 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".cloud_cover_high",
    expected: "Array<number>",
    value: input.cloud_cover_high
}, _errorFactory)) && ((Array.isArray(input.visibility) || $guard(_exceptionable, {
    path: _path + ".visibility",
    expected: "Array<number>",
    value: input.visibility
}, _errorFactory)) && input.visibility.every((elem: any, _index69: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".visibility[" + _index69 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".visibility",
    expected: "Array<number>",
    value: input.visibility
}, _errorFactory)) && ((Array.isArray(input.wind_speed_10m) || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m",
    expected: "Array<number>",
    value: input.wind_speed_10m
}, _errorFactory)) && input.wind_speed_10m.every((elem: any, _index70: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m[" + _index70 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m",
    expected: "Array<number>",
    value: input.wind_speed_10m
}, _errorFactory)) && ((Array.isArray(input.wind_direction_10m) || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m",
    expected: "Array<number>",
    value: input.wind_direction_10m
}, _errorFactory)) && input.wind_direction_10m.every((elem: any, _index71: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m[" + _index71 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m",
    expected: "Array<number>",
    value: input.wind_direction_10m
}, _errorFactory)) && ((Array.isArray(input.wind_gusts_10m) || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m",
    expected: "Array<number>",
    value: input.wind_gusts_10m
}, _errorFactory)) && input.wind_gusts_10m.every((elem: any, _index72: number) => "number" === typeof elem || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m[" + _index72 + "]",
    expected: "number",
    value: elem
}, _errorFactory)) || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m",
    expected: "Array<number>",
    value: input.wind_gusts_10m
}, _errorFactory)); const $ao9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.time || $guard(_exceptionable, {
    path: _path + ".time",
    expected: "string",
    value: input.time
}, _errorFactory)) && ("string" === typeof input.temperature_2m || $guard(_exceptionable, {
    path: _path + ".temperature_2m",
    expected: "string",
    value: input.temperature_2m
}, _errorFactory)) && ("string" === typeof input.relative_humidity_2m || $guard(_exceptionable, {
    path: _path + ".relative_humidity_2m",
    expected: "string",
    value: input.relative_humidity_2m
}, _errorFactory)) && ("string" === typeof input.apparent_temperature || $guard(_exceptionable, {
    path: _path + ".apparent_temperature",
    expected: "string",
    value: input.apparent_temperature
}, _errorFactory)) && ("string" === typeof input.precipitation_probability || $guard(_exceptionable, {
    path: _path + ".precipitation_probability",
    expected: "string",
    value: input.precipitation_probability
}, _errorFactory)) && ("string" === typeof input.precipitation || $guard(_exceptionable, {
    path: _path + ".precipitation",
    expected: "string",
    value: input.precipitation
}, _errorFactory)) && ("string" === typeof input.rain || $guard(_exceptionable, {
    path: _path + ".rain",
    expected: "string",
    value: input.rain
}, _errorFactory)) && ("string" === typeof input.showers || $guard(_exceptionable, {
    path: _path + ".showers",
    expected: "string",
    value: input.showers
}, _errorFactory)) && ("string" === typeof input.snowfall || $guard(_exceptionable, {
    path: _path + ".snowfall",
    expected: "string",
    value: input.snowfall
}, _errorFactory)) && ("string" === typeof input.weather_code || $guard(_exceptionable, {
    path: _path + ".weather_code",
    expected: "string",
    value: input.weather_code
}, _errorFactory)) && ("string" === typeof input.cloud_cover || $guard(_exceptionable, {
    path: _path + ".cloud_cover",
    expected: "string",
    value: input.cloud_cover
}, _errorFactory)) && ("string" === typeof input.cloud_cover_low || $guard(_exceptionable, {
    path: _path + ".cloud_cover_low",
    expected: "string",
    value: input.cloud_cover_low
}, _errorFactory)) && ("string" === typeof input.cloud_cover_mid || $guard(_exceptionable, {
    path: _path + ".cloud_cover_mid",
    expected: "string",
    value: input.cloud_cover_mid
}, _errorFactory)) && ("string" === typeof input.cloud_cover_high || $guard(_exceptionable, {
    path: _path + ".cloud_cover_high",
    expected: "string",
    value: input.cloud_cover_high
}, _errorFactory)) && ("string" === typeof input.visibility || $guard(_exceptionable, {
    path: _path + ".visibility",
    expected: "string",
    value: input.visibility
}, _errorFactory)) && ("string" === typeof input.wind_speed_10m || $guard(_exceptionable, {
    path: _path + ".wind_speed_10m",
    expected: "string",
    value: input.wind_speed_10m
}, _errorFactory)) && ("string" === typeof input.wind_direction_10m || $guard(_exceptionable, {
    path: _path + ".wind_direction_10m",
    expected: "string",
    value: input.wind_direction_10m
}, _errorFactory)) && ("string" === typeof input.wind_gusts_10m || $guard(_exceptionable, {
    path: _path + ".wind_gusts_10m",
    expected: "string",
    value: input.wind_gusts_10m
}, _errorFactory)); const $au0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
    if (undefined !== input.current)
        return $ao1(input, _path, true && _exceptionable);
    else if (undefined !== input.daily)
        return $ao4(input, _path, true && _exceptionable);
    else if (undefined !== input.hourly)
        return $ao7(input, _path, true && _exceptionable);
    else
        return $ao0(input, _path, true && _exceptionable);
})(); const __is = (input: any): input is OpenMeteoResponse[] => Array.isArray(input) && input.every((elem: any) => "object" === typeof elem && null !== elem && $iu0(elem)); let _errorFactory: any; return (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): asserts input is OpenMeteoResponse[] => {
    if (false === __is(input)) {
        _errorFactory = errorFactory;
        ((input: any, _path: string, _exceptionable: boolean = true) => (Array.isArray(input) || $guard(true, {
            path: _path + "",
            expected: "Array<OpenMeteoResponse>",
            value: input
        }, _errorFactory)) && input.every((elem: any, _index37: number) => ("object" === typeof elem && null !== elem || $guard(true, {
            path: _path + "[" + _index37 + "]",
            expected: "(Common & { current: CurrentSample; } & { current_units: UnitsOf<CurrentSample>; } | Common & { daily: DailySample; } & { daily_units: UnitsOf<DailySample>; } | Common & { hourly: HourlySample; } & { hourly_units: UnitsOf<HourlySample>; } | OpenMeteoResponseComponents.Common)",
            value: elem
        }, _errorFactory)) && $au0(elem, _path + "[" + _index37 + "]", true) || $guard(true, {
            path: _path + "[" + _index37 + "]",
            expected: "(Common & { current: CurrentSample; } & { current_units: UnitsOf<CurrentSample>; } | Common & { daily: DailySample; } & { daily_units: UnitsOf<DailySample>; } | Common & { hourly: HourlySample; } & { hourly_units: UnitsOf<HourlySample>; } | OpenMeteoResponseComponents.Common)",
            value: elem
        }, _errorFactory)) || $guard(true, {
            path: _path + "",
            expected: "Array<OpenMeteoResponse>",
            value: input
        }, _errorFactory))(input, "$input", true);
    }
}; })();
