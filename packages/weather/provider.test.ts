import { describe, expect, it } from "vitest";
import {
	DEFAULT_FORECAST_DAYS,
	DEFAULT_FORECAST_HOURS,
	DEFAULT_PAST_DAYS,
	DEFAULT_PAST_HOURS,
	Provider,
} from "./provider.js";
import type { NormalizedQueryOptions, QueryOptions } from "./query.js";

describe(`Provider.${Provider.normalizeOptions.name}`, () => {
	const fullOpts = {
		current: true,
		daily: {
			forecastDays: DEFAULT_FORECAST_DAYS,
			pastDays: DEFAULT_PAST_DAYS,
		},
		hourly: {
			forecastHours: DEFAULT_FORECAST_HOURS,
			pastHours: DEFAULT_PAST_HOURS,
		},
	} satisfies NormalizedQueryOptions;

	it("should normalize properties when undefined", () => {
		expect(Provider.normalizeOptions({})).toEqual(fullOpts);
	});

	it("should prioritize default properties over true", () => {
		expect(
			Provider.normalizeOptions({
				current: true,
				daily: true,
				hourly: true,
			}),
		).toEqual(fullOpts);
	});

	it("should always override default properties with false", () => {
		expect(
			Provider.normalizeOptions({
				current: false,
				daily: false,
				hourly: false,
			}),
		).toEqual({
			current: false,
			daily: false,
			hourly: false,
		} satisfies QueryOptions);
	});

	it("should normalize and merge with default properties", () => {
		expect(
			Provider.normalizeOptions({
				daily: { pastDays: 999 },
			}),
		).toEqual({
			...fullOpts,
			daily: { ...fullOpts.daily, pastDays: 999 },
		} satisfies QueryOptions);

		expect(
			Provider.normalizeOptions({
				daily: { pastDays: 999 },
				hourly: { forecastHours: 23 },
			}),
		).toEqual({
			...fullOpts,
			daily: { ...fullOpts.daily, pastDays: 999 },
			hourly: { ...fullOpts.hourly, forecastHours: 23 },
		} satisfies QueryOptions);
	});
});
