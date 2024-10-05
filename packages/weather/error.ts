export class WeatherAPIMismatchError extends Error {
	constructor(
		public url: URL,
		public reason: Error,
	) {
		super(
			// biome-ignore lint/style/useTemplate: <explanation>
			`${WeatherAPIMismatchError.name}: Mismatching weather API response against schema\n` +
				reason.message,
		);
	}
}

export class WeatherQueryError extends TypeError {}
