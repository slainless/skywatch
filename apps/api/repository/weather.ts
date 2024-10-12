import type { GetResult, Persistence } from "@skywatch/persistence";
import { Backend, type Point3D } from "@skywatch/common";
import type { WeatherData } from "@skywatch/weather";
import { isWeatherData } from "../guard/artifact/weather-query";
import { AsymmetricalError } from "@skywatch/common/errors";

export interface WeatherRepositoryResult {
	results: Map<Point3D, GetResult<Required<WeatherData>>>;
	storageMiss: Point3D[];
	storageHit: Point3D[];
	cacheHit: Point3D[];
	stale: Point3D[];
}

export class WeatherRepository extends Backend.Component {
	constructor(private persistence: Persistence) {
		super();
	}

	async getWeathers(locations: Point3D[]): Promise<WeatherRepositoryResult> {
		const final: WeatherRepositoryResult = {
			results: new Map(),
			cacheHit: [],
			storageHit: [],
			storageMiss: [],
			stale: [],
		};

		const weathers = (await this.persistence.bulkGet(
			locations.map(WeatherRepository.serializePoint),
		)) as GetResult<Required<WeatherData>>[];

		if (locations.length !== weathers.length)
			throw new AsymmetricalError(weathers, locations, "Lengths doesn't match");

		const now = Date.now();
		for (const [index, point] of Object.entries(locations)) {
			const weather = weathers[Number(index)];
			if (weather == null)
				throw new TypeError(
					"Persistence should not return null/undefined result!",
				);

			final.results.set(point, weather);
			if (weather.cacheHit || weather.storageHit) {
				// guard against invalid value from persistence
				// we are skipping the wrong value entirely
				if (isWeatherData(weather.value) === false) {
					weather.value = null;
					weather.cacheHit = false;
					weather.storageHit = false;
					final.storageMiss.push(point);
					continue;
				}
				if (weather.cacheHit) final.cacheHit.push(point);
				else final.storageHit.push(point);

				// TODO: should attach expireAt and maxAge data into the result
				// so that subsequent process down the line dont have to calculate again
				const data = weather.value;
				const expireAt = data.sampleTimestamp + data.sampleIntervalMs;
				if (expireAt - now <= 0) final.stale.push(point);
			} else final.storageMiss.push(point);
		}

		return final;
	}

	async setWeathers(query: Point3D[], weathers: Required<WeatherData>[]) {
		if (query.length !== weathers.length)
			throw new AsymmetricalError(weathers, query, "Lengths doesn't match");

		const bulk = query
			.map(
				(point, index) =>
					[WeatherRepository.serializePoint(point), weathers[index]!] as const,
			)
			.filter(([k, v]) => isWeatherData(v));
		this.persistence.cache().bulkSet(bulk);

		// regardless of cache bulk set result, what matter is storage bulk set result
		return this.persistence.storage().bulkSet(bulk);
	}

	// private static pointFormatter = new Intl.NumberFormat(undefined, {
	// 	maximumFractionDigits: 3,
	// 	minimumFractionDigits: 3,
	// });
	static serializePoint(point: Point3D): string {
		// const format = WeatherRepository.pointFormatter.format.bind(
		// 	WeatherRepository.pointFormatter,
		// );
		// return `${format(point.latitude)},${format(point.longitude)}`;
		return `${point.latitude},${point.longitude}`;
	}
}
