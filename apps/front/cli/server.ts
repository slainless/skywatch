// import build from "virtual:remix/server-build";
import type { ServerBuild } from "@remix-run/node";
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { pinoHttp } from "pino-http";
import pino from "pino";

const PORT = 3000;

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const app = express();

logger.info(
  { environment: process.env.NODE_ENV ?? "development" },
  "Starting server...",
);
let build: ServerBuild;
if (process.env.NODE_ENV === "production") {
  // @ts-expect-error
  build = await import("./build/server/index.js");
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
  });

  build = (await vite.ssrLoadModule("virtual:remix/server-build")) as any;
  app.use(vite.middlewares);
}

app.use(pinoHttp({ logger }));
app.all("*", createRequestHandler({ build }));

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Remix ready to accept request");
});
