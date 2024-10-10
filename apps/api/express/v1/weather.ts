import type { Request, Response, RequestHandler } from "express";
import { Backend, HTTPError, type Point3D } from "@deweazer/common";
import type { WeatherService } from "../../service/weather";
import type { CacheMetadata, CacheRepository } from "../../repository/cache";
import type { WeatherData } from "@deweazer/weather";
import {
	assertWeathersQuery,
	type WeathersQuery,
} from "../../guard/artifact/weather-query";
import { Cities } from "@deweazer/city-list";

export type { WeathersQuery } from "../../guard/artifact/weather-query";

interface WeatherControllerOptions {
	revalidateWindow?: number;
}
export class WeatherController extends Backend.Component {
	private options: Required<WeatherControllerOptions>;
	constructor(
		private service: WeatherService,
		private cache: CacheRepository,
		options?: WeatherControllerOptions,
	) {
		super();

		this.options = Object.assign(
			{ revalidateWindow: 60 } satisfies WeatherControllerOptions,
			options,
		);
	}

	mount(): RequestHandler {
		return async (req, res) => {
			const query = this.parseQuery(req);
			if (query.length < 1) return void res.json([]);

			const cache = await this.getResponseCache(req);
			if (cache != null) return this.sendResponseCache(res, cache);

			const weathers = await this.getWeathers(query);
			const metadata = await this.cacheResponse(weathers);
			return this.sendResponse(res, weathers, metadata);
		};
	}

	sendResponse(
		res: Response,
		weathers: WeatherData[],
		metadata: CacheMetadata,
	): void {
		res
			.status(304)
			.set("Etag", metadata.etag)
			.set(
				"Cache-Control",
				`max-age=${metadata.maxAge}, stale-while-revalidate=${this.options.revalidateWindow}`,
			)
			.json({ data: weathers });
	}

	getWeathers(query: Point3D[]): Promise<WeatherData[]> {
		return this.service.getWeathers(query);
	}

	parseQuery(req: Request): Point3D[] {
		try {
			const locations = req.query.locations;
			if (locations == null || typeof locations !== "string")
				throw new TypeError("Empty location");

			const parsed = JSON.parse(locations);
			assertWeathersQuery(parsed);

			return parsed.map((location) =>
				typeof location === "string" ? Cities[location].point : location,
			);
		} catch (e) {
			throw new HTTPError(400, e as Error);
		}
	}

	cacheResponse(weathers: WeatherData[]): Promise<CacheMetadata> {
		const sample = weathers[0]!;
		return this.cache.cache(
			JSON.stringify(weathers),
			sample.sampleTimestamp + sample.sampleInterval,
			sample.sampleInterval,
		);
	}

	async getResponseCache(req: Request): Promise<CacheMetadata | undefined> {
		const etags = WeatherController.getEtags(req);
		return this.cache.get(etags);
	}

	sendResponseCache(res: Response, cache: CacheMetadata) {
		res
			.status(304)
			.set("Etag", cache.etag)
			.set(
				"Cache-Control",
				`max-age=${cache.maxAge}, stale-while-revalidate=${this.options.revalidateWindow}`,
			)
			.send();
	}

	// format: "<ASCII>" /W"<ASCII>"
	// or: just "<ASCII>"
	private static regexpEtag =
		/(?:W\/)?"([a-zA-Z0-9~`!@#$%^&*_\-+()={\[\]|\\:;'<,>.?/]+)"(?: |$)/g;
	private static getEtags(req: Request): string[] {
		const header = req.get("If-None-Match");
		if (header == null) return [];

		const etags = header.matchAll(WeatherController.regexpEtag);
		return Array.from(etags).map((etag) => etag[1]!);
	}
}
