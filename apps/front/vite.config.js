import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";

export default defineConfig({
  plugins: [
    // devServer({
    //   entry: "./cli/dev.ts",
    //   adapter: bunAdapter,
    // }),
    remix(),
  ],
});
