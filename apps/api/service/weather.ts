import { Backend, type Point3D } from "@skywatch/common";
import { AsymmetricalError } from "@skywatch/common/errors";
import type { Provider, QueryOptions, WeatherData } from "@skywatch/weather";
import type {
  WeatherRepository,
  WeatherRepositoryResult,
} from "../repository/weather";
import type { EventService } from "./event";

export class WeatherService extends Backend.Component {
  private event: EventService;
  private repository: WeatherRepository;
  private provider: Provider;

  constructor(
    weatherRepository: WeatherRepository,
    eventService: EventService,
    weatherProvider: Provider,
  ) {
    super();
    this.repository = weatherRepository;
    this.provider = weatherProvider;
    this.event = eventService;
  }

  async getWeathers(query: Point3D[]): Promise<Required<WeatherData>[]> {
    const result = await this.repository.getWeathers(query);
    const hasMissingData = result.storageMiss.length > 0;
    const toBeQueried = [...result.storageMiss, ...result.stale];
    if (toBeQueried.length < 1)
      return WeatherService.mapToReturn(query, result);

    const renewed = this.fetchWeathers(toBeQueried)
      .then((weathers) => {
        this.onNewWeathers(toBeQueried, weathers).catch((error) => {
          this.logger?.error(
            { error, toBeQueried, weathers },
            "Fail on new weather hook",
          );
          throw error;
        });
        return weathers;
      })
      .catch((error) => {
        this.logger?.error({ error, toBeQueried }, "Fail to renew weathers");
        throw error;
      });
    if (hasMissingData === false)
      return WeatherService.mapToReturn(query, result);

    const resolved = await renewed;
    for (const [index, point] of Object.entries(toBeQueried)) {
      const oldWeather = result.results.get(point);
      const newWeather = resolved[Number(index)];
      if (oldWeather == null || newWeather == null)
        throw new TypeError("Old weather and new weather must not be nullish");

      oldWeather.value = newWeather;
    }

    return WeatherService.mapToReturn(query, result);
  }

  private async fetchWeathers(
    query: Point3D[],
  ): Promise<Array<Required<WeatherData>>> {
    const result = await this.provider.getWeathers(query);
    if (result.length !== query.length)
      throw new AsymmetricalError(result, query, "Lengths doesn't match");
    return result;
  }

  private onNewWeathers(query: Point3D[], weathers: Required<WeatherData>[]) {
    return Promise.all([
      this.event.weather().new(query, weathers),
      this.repository.setWeathers(query, weathers),
    ]);
  }

  private static mapToReturn(
    query: Point3D[],
    result: WeatherRepositoryResult,
  ) {
    return query.map((point) => {
      const weather = result.results.get(point);
      if (weather == null)
        throw new TypeError("Result should be symmetric to query");
      if (weather.value == null)
        throw new TypeError("Service should not return nullish data");
      return weather.value;
    });
  }
}
