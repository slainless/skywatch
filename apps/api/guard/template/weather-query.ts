import type { GlobalCity } from "@deweazer/city-list";
import type { QueryLocation } from "@deweazer/weather";
import { createAssertGuard, type AssertionGuard } from "typia";

export type WeathersQuery = Array<GlobalCity | QueryLocation>;

export const assertWeathersQuery: AssertionGuard<WeathersQuery> =
	createAssertGuard<WeathersQuery>();
