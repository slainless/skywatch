import type { Express } from "express";
import express from "express";
import type { CacheMetadataRepository } from "../repository/cache-metadata";
import type { WeatherService } from "../service/weather";
import { WeatherController } from "./v1/weather";

export function createServer(
	weatherService: WeatherService,
	weatherCache: CacheMetadataRepository,
): Express {
	const app = express();

	const weather = new WeatherController(weatherService, weatherCache);

	const v1 = express.Router();
	v1.get("/weathers", weather.mount());

	app.get("/v1", v1);
	return app;
}
