import type { WeatherRepository } from "../repository/weather";
import type { Provider } from "@deweazer/weather";
import type { EventService } from "./event";
import { Backend } from "@deweazer/common";

export class WeatherService extends Backend.Component {
	constructor(
		private weatherRepository: WeatherRepository,
		private eventService: EventService,
		private weatherProvider: Provider,
	) {
		super();
	}
}
