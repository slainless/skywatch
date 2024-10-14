import { createServer } from "../express/app";
import { bootstrap } from "./bootstrap";

const { logger, config, service, repository } = await bootstrap();
const app = createServer(service, repository.metadata);
logger.info({ config }, "Starting server");
app.listen(config["server.port"]);
