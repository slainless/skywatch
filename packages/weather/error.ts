export class WeatherAPIMismatchError extends Error {
  name = WeatherAPIMismatchError.name;

  constructor(
    public url: URL,
    public reason: Error,
  ) {
    super(
      `Mismatching weather API response against schema:\n${reason.message}`,
    );
  }
}

export class WeatherQueryError extends TypeError {}
