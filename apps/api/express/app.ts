import type { Express } from "express";
import express from "express";
import { weathers } from "./v1/weathers";

export function createServer(): Express {
	const app = express();

	const v1 = express.Router();
	v1.get("/weathers", weathers());

	app.get("/v1", v1);
	return app;
}
