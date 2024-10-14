import type { Router } from "express";
import express from "express";
import type { CacheMetadataRepository } from "../../repository/cache-metadata";
import type { WeatherService } from "../../service/weather";
import { ErrorHandler } from "./error";
import { WeatherController } from "./weather";

export function createServer(
  weatherService: WeatherService,
  weatherCache: CacheMetadataRepository,
): Router {
  const error = new ErrorHandler();
  const weather = new WeatherController(weatherService, weatherCache);

  const server = express.Router();
  server.get("/weathers", weather.mount());
  server.use(error.mount());

  return server;
}
