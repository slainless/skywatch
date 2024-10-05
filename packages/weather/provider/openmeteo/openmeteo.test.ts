import { describe, expect, it } from "bun:test";
import {
	buildUrl,
	mapResponseToResult,
	OPENMETEO_API_BASE_URL,
	OpenMeteoProvider,
} from "./openmeteo.js";
import {
	DEFAULT_FORECAST_DAYS,
	DEFAULT_FORECAST_HOURS,
	DEFAULT_PAST_DAYS,
	DEFAULT_PAST_HOURS,
	Provider,
	type Point3D,
	type QueryLocation,
	type QueryOptions,
} from "../../index.js";
import { OpenMeteoParameters } from "./schema.js";
import exampleResponse from "./example.response.json" assert { type: "json" };
import exampleExpected from "./example.expected.json" assert { type: "json" };

describe(buildUrl.name, () => {
	const point = (x: number, y: number) =>
		({ longitude: x, latitude: y }) satisfies QueryLocation;
	it("should build correct url for all normalized options", () => {
		const locations = [
			point(0, -9991.999),
			point(-1.2222222, 2),
			point(2, -3),
		] satisfies QueryLocation[];
		const opts = Provider.normalizeOptions({});
		const url = buildUrl(locations, opts);
		const search = url.searchParams;

		expect(url.origin + url.pathname).toBe(OPENMETEO_API_BASE_URL);

		expect(search.get("longitude")).toBe("0,-1.2222222,2");
		expect(search.get("latitude")).toBe("-9991.999,2,-3");

		expect(search.get("past_hours")).toBe(DEFAULT_PAST_HOURS.toString());
		expect(search.get("forecast_hours")).toBe(
			DEFAULT_FORECAST_HOURS.toString(),
		);
		expect(search.get("past_days")).toBe(DEFAULT_PAST_DAYS.toString());
		expect(search.get("forecast_days")).toBe(DEFAULT_FORECAST_DAYS.toString());

		expect(search.get("current")).toBe(OpenMeteoParameters.current.join(","));
		expect(search.get("daily")).toBe(OpenMeteoParameters.daily.join(","));
		expect(search.get("hourly")).toBe(OpenMeteoParameters.hourly.join(","));
	});

	it("should build correct url for partial options", () => {
		const locations = [] satisfies QueryLocation[];
		const opts = Provider.normalizeOptions({
			current: false,
			daily: false,
			hourly: {
				forecastHours: 777,
			},
		});
		const url = buildUrl(locations, opts);
		const search = url.searchParams;

		expect(url.origin + url.pathname).toBe(OPENMETEO_API_BASE_URL);

		expect(search.get("longitude")).toBe("");
		expect(search.get("latitude")).toBe("");

		expect(search.get("past_hours")).toBe(DEFAULT_PAST_HOURS.toString());
		expect(search.get("forecast_hours")).toBe((777).toString());
		expect(search.has("past_days")).toBe(false);
		expect(search.has("forecast_days")).toBe(false);

		expect(search.has("current")).toBe(false);
		expect(search.has("daily")).toBe(false);
		expect(search.get("hourly")).toBe(OpenMeteoParameters.hourly.join(","));
	});

	it("should build correct url for nothing", () => {
		const locations = [] satisfies QueryLocation[];
		const opts = Provider.normalizeOptions({
			current: false,
			daily: false,
			hourly: false,
		});
		const url = buildUrl(locations, opts);
		const search = url.searchParams;

		expect(url.origin + url.pathname).toBe(OPENMETEO_API_BASE_URL);

		expect(search.get("longitude")).toBe("");
		expect(search.get("latitude")).toBe("");

		expect(search.has("past_hours")).toBe(false);
		expect(search.has("forecast_hours")).toBe(false);
		expect(search.has("past_days")).toBe(false);
		expect(search.has("forecast_days")).toBe(false);

		expect(search.has("current")).toBe(false);
		expect(search.has("daily")).toBe(false);
		expect(search.has("hourly")).toBe(false);
	});
});

describe(mapResponseToResult.name, () => {
	it("should map full response to unified WeatherResult", () => {
		expect(mapResponseToResult(exampleResponse)).toEqual(
			exampleExpected as any,
		);
	});

	it("should map partial response to unified WeatherResult", () => {
		const { hourly: _, ...response } = exampleResponse;
		const { hourly: $, ...expected } = exampleExpected;
		expect(mapResponseToResult(response)).toEqual(expected as any);
	});

	it("should map barebone response to unified WeatherResult", () => {
		const { hourly: _, daily: __, current: ___, ...response } = exampleResponse;
		const { hourly: $, daily: $$, current: $$$, ...expected } = exampleExpected;
		expect(mapResponseToResult(response)).toEqual(expected as any);
	});
});

describe(`${OpenMeteoProvider.name}.${OpenMeteoProvider.prototype.getWeathers.name}`, () => {
	const point = (x: number, y: number) =>
		({ latitude: y, longitude: x }) satisfies Point3D;
	it("should return full WeatherResult spec for full query options", async () => {
		const provider = new OpenMeteoProvider();
		const results = await provider.getWeathers([
			point(0, 1),
			point(1, 2),
			point(2, 3),
		]);

		expect(results.length).toBe(3);
		for (const result of results) {
			expect("daily" in result).toBe(true);
			expect("current" in result).toBe(true);
			expect("hourly" in result).toBe(true);

			expect(result.daily.data.length).toBe(
				DEFAULT_FORECAST_DAYS + DEFAULT_PAST_DAYS,
			);
			expect(result.hourly.data.length).toBe(
				DEFAULT_FORECAST_HOURS + DEFAULT_PAST_HOURS,
			);
		}
		// expect(result[0])
	});

	it("should return partial WeatherResult spec for partial query options", async () => {
		const provider = new OpenMeteoProvider();
		const results = await provider.getWeathers(
			[point(0, 1), point(1, 2), point(2, 3)],
			{ hourly: false },
		);

		expect(results.length).toBe(3);
		for (const result of results) {
			expect("daily" in result).toBe(true);
			expect("current" in result).toBe(true);
			expect("hourly" in result).toBe(false);

			expect(result.daily.data.length).toBe(
				DEFAULT_FORECAST_DAYS + DEFAULT_PAST_DAYS,
			);
		}
	});

	it("should return empty WeatherResult spec for empty query options", async () => {
		const provider = new OpenMeteoProvider();
		const results = await provider.getWeathers(
			[point(0, 1), point(1, 2), point(2, 3)],
			{ current: false, daily: false, hourly: false },
		);

		expect(results.length).toBe(3);
		for (const result of results) {
			expect("daily" in result).toBe(false);
			expect("current" in result).toBe(false);
			expect("hourly" in result).toBe(false);
		}
	});

	it("should return correct sample range", async () => {
		const provider = new OpenMeteoProvider();
		const opts = {
			daily: { forecastDays: 3, pastDays: 2 },
			hourly: { forecastHours: 4, pastHours: 5 },
		} satisfies QueryOptions;
		const results = await provider.getWeathers(
			[point(0, 1), point(1, 2), point(2, 3)],
			opts,
		);

		expect(results.length).toBe(3);
		for (const result of results) {
			expect("daily" in result).toBe(true);
			expect("current" in result).toBe(true);
			expect("hourly" in result).toBe(true);

			expect(result.daily.data.length).toBe(
				opts.daily.forecastDays + opts.daily.pastDays,
			);
			expect(result.hourly.data.length).toBe(
				opts.hourly.forecastHours + opts.hourly.pastHours,
			);
		}
	});
});
