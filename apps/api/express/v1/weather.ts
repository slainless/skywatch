import { Cities } from "@skywatch/city-list";
import { Backend, HTTPError, type Point3D } from "@skywatch/common";
import type { WeatherData } from "@skywatch/weather";
import type { Request, RequestHandler, Response } from "express";
import { TypeGuardError } from "typia";
import { assertWeathersQuery } from "../../guard/artifact/weather-query";
import type {
  CacheMetadata,
  CacheMetadataRepository,
} from "../../repository/cache-metadata";
import type { WeatherService } from "../../service/weather";

export type { WeathersQuery } from "../../guard/artifact/weather-query";

interface WeatherControllerOptions {
  revalidateWindow?: number;
}
export class WeatherController extends Backend.Component {
  private options: Required<WeatherControllerOptions>;
  constructor(
    private service: WeatherService,
    private cache: CacheMetadataRepository,
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

  async getResponseCache(req: Request): Promise<CacheMetadata | null> {
    const header = req.get("If-None-Match");
    const etags = WeatherController.getEtags(header);
    if (etags == null || etags.length < 1) return null;

    const metadata = await this.cache.get(etags);
    if (metadata == null || metadata.expireAt - Date.now() <= 0) return null;

    return metadata;
  }

  sendResponseCache(res: Response, cache: CacheMetadata) {
    res
      .status(304)
      .set("Etag", `"${cache.etag}"`)
      .set(
        "Cache-Control",
        `max-age=${Math.round(cache.maxAgeMs / 1000)}, stale-while-revalidate=${this.options.revalidateWindow}`,
      )
      .send();
  }

  getWeathers(query: Point3D[]): Promise<WeatherData[]> {
    return this.service.getWeathers(query);
  }

  // TODO: repository should return maxAge and expireAt to reduce the number of
  // operation against WeatherData[] since its probably has already been
  // iterated atleast once in repository...
  async cacheResponse(weathers: WeatherData[]): Promise<CacheMetadata | null> {
    const sample = weathers.toSorted(
      (a, b) => a.sampleTimestamp - b.sampleTimestamp,
    )[0]!;
    const expireAt = sample.sampleTimestamp + sample.sampleIntervalMs;
    const maxAgeMs = expireAt - Date.now();
    if (maxAgeMs <= 0) return null;

    return this.cache.cache(JSON.stringify(weathers), expireAt, maxAgeMs);
  }

  sendResponse(
    res: Response,
    weathers: WeatherData[],
    metadata?: CacheMetadata | null,
  ): void {
    if (metadata != null)
      res
        .set("Etag", `"${metadata.etag}"`)
        .set(
          "Cache-Control",
          `max-age=${Math.round(metadata.maxAgeMs / 1000)}, stale-while-revalidate=${this.options.revalidateWindow}`,
        );
    else
      res.set(
        "Cache-Control",
        `max-age=0, stale-while-revalidate=${this.options.revalidateWindow}`,
      );

    res.status(200).json({ data: weathers });
  }

  parseQuery(req: Request): Point3D[] {
    try {
      const locations = req.query.locations;
      if (locations == null || typeof locations !== "string")
        throw new TypeError("Location query must be a valid JSON string");

      const parsed = JSON.parse(locations);
      assertWeathersQuery(parsed);

      return parsed.map((location) =>
        typeof location === "string"
          ? Cities[location].point
          : WeatherController.normalizePoint(location),
      );
    } catch (e) {
      if (e instanceof SyntaxError)
        throw new HTTPError(
          400,
          new SyntaxError("Location query is not a valid JSON", { cause: e }),
        );
      throw new HTTPError(400, e as Error);
    }
  }

  // format: "<ASCII>" /W"<ASCII>"
  // or: just "<ASCII>"
  private static regexpEtag =
    /(?<= |^)(?:W\/)?"([a-zA-Z0-9~`!@#$%^&*_\-+()={\[\]|\\:;'<,>.?/]+)"(?= |$)/g;
  static getEtags(header?: string | null): string[] {
    if (header == null) return [];

    const etags = header.matchAll(WeatherController.regexpEtag);
    return Array.from(etags)
      .map((etag) => etag[1]!)
      .filter((etag) => etag !== "");
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
}
