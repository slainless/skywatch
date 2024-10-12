import type { GlobalCity } from "@deweazer/city-list";
import type { QueryLocation, WeatherData } from "@deweazer/weather";
import { createAssertGuard, createIs, type AssertionGuard } from "typia";

export type WeathersQuery = Array<GlobalCity | QueryLocation>;

export const assertWeathersQuery: AssertionGuard<WeathersQuery> =
	createAssertGuard<WeathersQuery>();
export const isWeatherData = createIs<Required<WeatherData>>();
