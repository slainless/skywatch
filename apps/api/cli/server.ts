import pino from "pino";
import { createServer } from "../express/app";
import { bootstrap } from "./bootstrap";

const logger = pino({
  transport: { target: "pino-pretty" },
});
const { config, service, repository } = await bootstrap(logger);
const app = createServer(service, repository.metadata);
logger.info(
  { port: config["server.port"] },
  "Ready to accept request. Listening...",
);
app.listen(config["server.port"]);
