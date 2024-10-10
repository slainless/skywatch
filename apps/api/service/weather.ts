import type { WeatherRepository } from "../repository/weather";
import type { Provider, WeatherData } from "@deweazer/weather";
import type { EventService } from "./event";
import { Backend, type Point3D } from "@deweazer/common";
import type { CacheRepository } from "../repository/cache";

export class WeatherService extends Backend.Component {
	private repository: WeatherRepository;
	private provider: Provider;

	constructor(
		weatherRepository: WeatherRepository,
		private eventService: EventService,
		weatherProvider: Provider,
	) {
		super();
		this.repository = weatherRepository;
		this.provider = weatherProvider;
	}

	async getWeathers(query: Point3D[]): Promise<WeatherData[]> {}
}
