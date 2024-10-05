import { coverageConfigDefaults, type UserConfig } from "vitest/config";

export default {
	test: {
		coverage: {
			exclude: ["**/artifact/**", ...coverageConfigDefaults.exclude],
		},
	},
} satisfies UserConfig;
