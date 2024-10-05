import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			exclude: ["**/artifact/**", ...coverageConfigDefaults.exclude],
		},
	},
});
