import { afterAll, describe, expect, it, mock, setSystemTime } from "bun:test";
import { WeatherController } from "./weather";
import express from "express";
import { ErrorHandler } from "./error";
import {
	MockCacheMetadataRepository,
	MockWeatherService,
} from "../../test/helper";
import ky, { HTTPError } from "ky";
import type { Point3D } from "@skywatch/common";
import {
	CacheMetadataRepository,
	type CacheMetadata,
} from "../../repository/cache-metadata";
import { addHours, addSeconds, subHours } from "date-fns";
import { dataWithTimestamp } from "../../test/weather";

const PORT = 4567;

const cache = new MockCacheMetadataRepository();
const service = new MockWeatherService();
const controller = new WeatherController(service, cache);

const error = new ErrorHandler();
const app = express().get("/weather", controller.mount()).use(error.mount());
app.listen(PORT);

const req = ky.create({
	prefixUrl: `http://localhost:${PORT}`,
	throwHttpErrors: false,
});

afterAll(() => {
	mock.restore();
	setSystemTime();
});

const point = (x: number, y: number) =>
	({ longitude: x, latitude: y }) satisfies Point3D;

describe(WeatherController.name, () => {
	it("should return 400 on invalid query", async () => {
		let result = await req.get("weather");
		expect(result.status).toBe(400);
		expect(result.text()).resolves.toContain(
			"Location query must be a valid JSON string",
		);

		result = await req.get("weather?locations");
		expect(result.status).toBe(400);
		expect(result.text()).resolves.toContain(
			"Location query is not a valid JSON",
		);

		result = await req.get("weather?locations=AXASDXAS(]}}}}{?ASD?^^^&#*");
		expect(result.status).toBe(400);
		expect(result.text()).resolves.toContain(
			"Location query is not a valid JSON",
		);

		result = await req.get(
			`weather?locations=${JSON.stringify({
				wrong: "format",
			})}`,
		);
		expect(result.status).toBe(400);
		expect(result.text()).resolves.toContain("typia.assertGuard");

		result = await req.get(
			`weather?locations=${JSON.stringify([{ a: 1, b: 99 }])}`,
		);
		expect(result.status).toBe(400);
		expect(result.text()).resolves.toContain("typia.assertGuard");

		service.getWeathers.mockImplementationOnce(() => {
			throw new Error("Checkpoint");
		});
		result = await req.get(
			`weather?locations=${JSON.stringify([point(1, 2)])}`,
		);
		expect(result.status).toBe(500);
		expect(result.text()).resolves.toContain("Checkpoint");
	});

	it("should return early when received empty query", async () => {
		const result = await req.get(`weather?locations=${JSON.stringify([])}`);
		expect(result.status).toBe(200);
		expect(result.json()).resolves.toEqual([]);
	});

	describe("If-None-Match and ETag", async () => {
		it("should skip cache metadata check on invalid or empty If-None-Match", async () => {
			service.getWeathers.mockImplementation(() => {
				throw new Error("Checkpoint");
			});

			const url = `weather?locations=${JSON.stringify([point(3, 5)])}`;
			let result = await req.get(url, {
				headers: {
					"If-None-Match": "ABCD",
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toBeCalledTimes(0);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `""`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toBeCalledTimes(0);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `""" "" """"""" "" W/"" WWWWWWWWWWWWWWWWWWWWWW/"" W/""`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toBeCalledTimes(0);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `/"hehe" /"hello"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toBeCalledTimes(0);
		});

		it("should correctly parse etag", async () => {
			service.getWeathers.mockImplementation(() => {
				throw new Error("Should not go here");
			});

			cache.get.mockImplementation(() => {
				throw new Error("Checkpoint");
			});

			const url = `weather?locations=${JSON.stringify([point(3, 5)])}`;
			let result = await req.get(url, {
				headers: {
					"If-None-Match": `"thisisetag"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith(["thisisetag"]);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `"multi" "ple" "etag" "is" "also" "allowed"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith([
				"multi",
				"ple",
				"etag",
				"is",
				"also",
				"allowed",
			]);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `"multi" W/"ple" W/"etag"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith(["multi", "ple", "etag"]);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `"part"W/ "partially" XXXSSSS///"bro" W/"kenn" /"ken"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith(["partially", "kenn"]);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `"+"     "-extreme-"   "pissedoffbro"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith([
				"+",
				"-extreme-",
				"pissedoffbro",
			]);

			result = await req.get(url, {
				headers: {
					"If-None-Match": `"82903*#$!@#%)))))" "L33TC0D3" W/"h4ck4" W/"cr1ng3&&&&&&&&&&&&&@&@^#*#(*#&#^&#(*#&^#^#(*#(#&^#^#*@#(@"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith([
				"82903*#$!@#%)))))",
				"L33TC0D3",
				"h4ck4",
				"cr1ng3&&&&&&&&&&&&&@&@^#*#(*#&#^&#(*#&^#^#(*#(#&^#^#*@#(@",
			]);
		});

		it("should return 304 response on first cache metadata found and not stale", async () => {
			service.getWeathers.mockImplementation(() => {
				throw new Error("Should not go here");
			});

			const url = `weather?locations=${JSON.stringify([point(3, 5)])}`;
			const metadata = {
				etag: "single-etag",
				maxAgeMs: 900e3,
				expireAt: addHours(new Date(), 2).getTime(),
			} satisfies CacheMetadata;

			cache.get.mockResolvedValueOnce(metadata);
			let result = await req.get(url, {
				headers: {
					"If-None-Match": `"single-etag"`,
				},
			});
			expect(result.status).toBe(304);
			expect(result.text()).resolves.toEqual("");
			expect(result.headers.get("Cache-Control")).toEqual(
				`max-age=${metadata.maxAgeMs / 1000}, stale-while-revalidate=60`,
			);
			expect(result.headers.get("Etag")).toEqual(`"${metadata.etag}"`);
			expect(cache.get).toHaveBeenLastCalledWith(["single-etag"]);

			cache.get.mockResolvedValueOnce(metadata);
			result = await req.get(url, {
				headers: {
					"If-None-Match": `"1-etag" "2-etag" "3-tag"`,
				},
			});
			expect(result.status).toBe(304);
			expect(result.text()).resolves.toEqual("");
			expect(result.headers.get("Cache-Control")).toEqual(
				`max-age=${metadata.maxAgeMs / 1000}, stale-while-revalidate=60`,
			);
			expect(result.headers.get("Etag")).toEqual(`"${metadata.etag}"`);
			expect(cache.get).toHaveBeenLastCalledWith(["1-etag", "2-etag", "3-tag"]);
		});

		it("should continue normally on stale cache metadata", async () => {
			service.getWeathers.mockImplementation(() => {
				throw new Error("Checkpoint");
			});

			const url = `weather?locations=${JSON.stringify([point(3, 5)])}`;
			const metadata = {
				etag: "single-etag",
				maxAgeMs: 900e3,
				expireAt: subHours(new Date(), 2).getTime(),
			} satisfies CacheMetadata;

			cache.get.mockResolvedValueOnce(metadata);
			let result = await req.get(url, {
				headers: {
					"If-None-Match": `"single-etag"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith(["single-etag"]);

			cache.get.mockResolvedValueOnce(metadata);
			result = await req.get(url, {
				headers: {
					"If-None-Match": `"1-etag" "2-etag" "3-tag"`,
				},
			});
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.get).toHaveBeenLastCalledWith(["1-etag", "2-etag", "3-tag"]);
		});
	});

	describe("Normal request", () => {
		it("should store result metadata for fresh data in cache repository", async () => {
			cache.cache.mockImplementation(() => {
				throw new Error("Checkpoint");
			});

			const now = new Date();
			setSystemTime(now);
			const data = [
				dataWithTimestamp(now),
				dataWithTimestamp(now),
				dataWithTimestamp(now),
			];
			service.getWeathers.mockResolvedValueOnce(data);

			const url = `weather?locations=${JSON.stringify([point(0, 0), point(0, 1), point(0, 2)])}`;
			const result = await req.get(url);
			expect(result.status).toBe(500);
			expect(result.text()).resolves.toEqual("Checkpoint");
			expect(cache.cache).toHaveBeenLastCalledWith(
				JSON.stringify(data),
				addSeconds(now, 900).getTime(),
				900e3,
			);
		});

		it("should skip result metadata cache for stale data", async () => {
			cache.cache.mockClear();
			cache.cache.mockImplementation(() => {
				throw new Error("Should not go here");
			});

			const now = new Date();
			setSystemTime(now);
			const data = [
				dataWithTimestamp(subHours(now, 1)),
				dataWithTimestamp(subHours(now, 1)),
				dataWithTimestamp(subHours(now, 1)),
			];
			service.getWeathers.mockResolvedValueOnce(data);

			const url = `weather?locations=${JSON.stringify([point(0, 0), point(0, 1), point(0, 2)])}`;
			const result = await req.get(url);
			expect(result.status).toBe(200);
			// express default etag
			expect(result.headers.get("Etag")).toStartWith(`W/"`);
			expect(result.headers.get("Cache-Control")).toBe(
				"max-age=0, stale-while-revalidate=60",
			);
			expect(result.json()).resolves.toEqual({ data });
			expect(cache.cache).toHaveBeenCalledTimes(0);
		});

		it("should return fresh data with cache-control", async () => {
			cache.cache.mockClear();

			const now = new Date();
			setSystemTime(now);
			const data = [
				dataWithTimestamp(now),
				dataWithTimestamp(now),
				dataWithTimestamp(now),
			];
			service.getWeathers.mockResolvedValueOnce(data);
			cache.cache.mockResolvedValueOnce({
				etag: "AAAAAAAAAAAAAAA",
				expireAt: addSeconds(now, 900).getTime(),
				maxAgeMs: 900e3,
			} satisfies CacheMetadata);

			const url = `weather?locations=${JSON.stringify([point(0, 0), point(0, 1), point(0, 2)])}`;
			const result = await req.get(url);
			expect(result.status).toBe(200);
			// express default etag
			expect(result.headers.get("Etag")).toEqual(`"AAAAAAAAAAAAAAA"`);
			expect(result.headers.get("Cache-Control")).toBe(
				"max-age=900, stale-while-revalidate=60",
			);
			expect(result.json()).resolves.toEqual({ data });
			expect(cache.cache).toHaveBeenLastCalledWith(
				JSON.stringify(data),
				addSeconds(now, 900).getTime(),
				900e3,
			);
		});
	});
});
