import type { Express } from "express";
import express from "express";
import type { CacheMetadataRepository } from "../repository/cache-metadata";
import type { WeatherService } from "../service/weather";
import { WeatherController } from "./v1/weather";
import { ErrorHandler } from "./v1/error";

export function createServer(
	weatherService: WeatherService,
	weatherCache: CacheMetadataRepository,
): Express {
	const app = express();

	const error = new ErrorHandler();
	const weather = new WeatherController(weatherService, weatherCache);

	const v1 = express.Router();
	v1.get("/weathers", weather.mount());

	app.use("/v1", v1);
	app.use(error.mount());
	return app;
}
