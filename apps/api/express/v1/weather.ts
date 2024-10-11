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
		metadata?: CacheMetadata | null,
	): void {
		if (metadata != null)
			res
				.set("Etag", metadata.etag)
				.set(
					"Cache-Control",
					`max-age=${metadata.maxAge}, stale-while-revalidate=${this.options.revalidateWindow}`,
				);
		else
			res.set(
				"Cache-Control",
				`max-age=0, stale-while-revalidate=${this.options.revalidateWindow}`,
			);

		res.status(200).json({ data: weathers });
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
				typeof location === "string"
					? Cities[location].point
					: WeatherController.normalizePoint(location),
			);
		} catch (e) {
			throw new HTTPError(400, e as Error);
		}
	}

	private static pointFormatter = new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 3,
		minimumFractionDigits: 3,
	});
	private static normalizePoint(point: Point3D): Point3D {
		const format = (v: number) => WeatherController.pointFormatter.format(v);
		const normalized = {
			latitude: Number(format(point.latitude)),
			longitude: Number(format(point.longitude)),
		} as Point3D;
		if (point.altitude != null)
			normalized.altitude = Number(format(point.altitude));
		return normalized;
	}

	// TODO: repository should return maxAge and expireAt to reduce the number of
	// operation against WeatherData[] since its probably has already been
	// iterated atleast once in repository...
	async cacheResponse(weathers: WeatherData[]): Promise<CacheMetadata | null> {
		const sample = weathers.toSorted(
			(a, b) => a.sampleTimestamp - b.sampleTimestamp,
		)[0]!;
		const expireAt = sample.sampleTimestamp + sample.sampleInterval;
		const maxAge = expireAt - Date.now();
		if (maxAge <= 0) return null;

		return this.cache.cache(JSON.stringify(weathers), expireAt, maxAge);
	}

	async getResponseCache(req: Request): Promise<CacheMetadata | null> {
		const etags = WeatherController.getEtags(req);
		const metadata = await this.cache.get(etags);
		if (metadata == null || metadata.expireAt - Date.now() <= 0) return null;

		return metadata;
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
