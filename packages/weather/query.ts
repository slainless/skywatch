import type { Point3D } from "@deweazer/common";

export type QueryLocation = Point3D;

export interface HourlyQueryOptions {
	pastHours?: number;
	forecastHours?: number;
}

export interface DailyQueryOptions {
	pastDays?: number;
	forecastDays?: number;
}

export interface QueryOptions {
	current?: boolean;
	daily?: boolean | DailyQueryOptions;
	hourly?: boolean | HourlyQueryOptions;
}

export type NormalizedQueryOptions = {
	[K in keyof QueryOptions]-?: Extract<QueryOptions[K], object> extends never
		? boolean
		: Required<Extract<QueryOptions[K], object>> | false;
};

type NotFalse<T, K extends string> = T extends { [_ in K]: false } ? never : K;
export type SampleUsed<T extends QueryOptions> =
	| NotFalse<T, "current">
	| NotFalse<T, "daily">
	| NotFalse<T, "hourly">;
