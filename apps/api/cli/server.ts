import pino from "pino";
import httpLogger from "pino-http";
import { createServer } from "../express/v1/app";
import { bootstrap } from "./bootstrap";
import express from "express";

const logger = pino({
  transport: { target: "pino-pretty" },
});
const { config, service, repository } = await bootstrap(logger);

const app = express();
app.use(httpLogger({ logger }));
app.use("/v1", createServer(service, repository.metadata));

logger.info(
  { port: config["server.port"] },
  "Ready to accept request. Listening...",
);
app.listen(config["server.port"]);
