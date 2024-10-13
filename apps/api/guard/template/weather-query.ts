import type { GlobalCity } from "@skywatch/city-list";
import type { QueryLocation, WeatherData } from "@skywatch/weather";
import { type AssertionGuard, createAssertGuard, createIs } from "typia";

export type WeathersQuery = Array<GlobalCity | QueryLocation>;

export const assertWeathersQuery: AssertionGuard<WeathersQuery> =
  createAssertGuard<WeathersQuery>();
export const isWeatherData = createIs<Required<WeatherData>>();
