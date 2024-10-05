export interface Point3D {
	latitude: number;
	longitude: number;
	altitude?: number;
}

export namespace WMOCode {
	export enum WorldWide {
		Clear = 0,

		MainlyClear = 1,
		PartlyCloudy = 2,
		Overcast = 3,

		Fog = 45,
		DepositingRimeFog = 48,

		LightDrizzle = 51,
		ModerateDrizzle = 53,
		DenseDrizzle = 55,

		LightFreezingDrizzle = 56,
		DenseFreezingDrizzle = 57,

		SlightRain = 61,
		ModerateRain = 63,
		HeavyRain = 65,

		LightFreezingRain = 66,
		HeavyFreezingRain = 67,

		SlightSnowFall = 71,
		ModerateSnowFall = 73,
		HeavySnowFall = 75,

		SnowGrain = 77,

		SlightRainShowers = 80,
		ModerateRainShowers = 81,
		ViolentRainShowers = 82,

		SlightSnowShowers = 85,
		HeavySnowShowers = 86,

		Thunderstorm = 95,

		ThunderstormWithSlightHail = 96,
		ThunderstormWithHeavyHail = 99,
	}
}

export namespace Samples {
	export interface Current {
		type: "current";
		time: string;
		temperature: number;
		relativeHumidity: number;
		apparentTemperature: number;
		precipitation: number;
		rain: number;
		showers: number;
		snowfall: number;
		weatherCode: WMOCode.WorldWide;
		cloudCoverTotal: number;
		windSpeed: number;
		windDirection: number;
		windGusts: number;
	}

	export interface Hourly extends Omit<Current, "type"> {
		type: "hourly";
		time: string;
		cloudCoverLow: number;
		cloudCoverMedium: number;
		cloudCoverHigh: number;
		precipitationProbability: number;
		visibility: number;
	}

	export interface Daily {
		type: "daily";
		time: string;
		weatherCode: WMOCode.WorldWide;
		maxTemperature: number;
		minTemperature: number;
		maxApparentTemperature: number;
		minApparentTemperature: number;
		sunrise: string;
		sunset: string;
		precipitationSum: number;
		rainSum: number;
		showersSum: number;
		snowfallSum: number;
		precipitationHours: number;
		precipitationProbabilityMax: number;
		maximumWindSpeed: number;
		maximumWindGusts: number;
		dominantWindDirection: number;
	}
}
export type Samples = Samples.Current | Samples.Daily | Samples.Hourly;

export namespace SamplesWithUnit {
	interface Entry<T extends Samples, IsMany extends boolean> {
		units: { [K in keyof Omit<T, "type">]: string };
		data: IsMany extends true ? T[] : T;
	}

	export type Current = Entry<Samples.Current, false>;
	export type Hourly = Entry<Samples.Hourly, true>;
	export type Daily = Entry<Samples.Daily, true>;
}

export interface WeatherData {
	current?: SamplesWithUnit.Current;
	hourly?: SamplesWithUnit.Hourly;
	daily?: SamplesWithUnit.Daily;
	location: Point3D;
	timezone: string;
	timezoneAbbr: string;
}

export type WeatherDataComposition = "current" | "hourly" | "daily";
export type ComposableWeatherData<T extends WeatherDataComposition> = Pick<
	Required<WeatherData>,
	T
> &
	Omit<Required<WeatherData>, WeatherDataComposition>;

// export type ComposableWeatherResult<T extends Samples> = OmitNever<{
// 	current: Entry<T, Samples.Current, false>;
// 	hourly: Entry<T, Samples.Hourly, true>;
// 	daily: Entry<T, Samples.Daily, true>;
// }>;

// type OmitNever<T> = ConditionalExcept<T, never>;
// type Entry<
// 	T,
// 	S extends Samples,
// 	IsMany extends boolean,
// > = T extends S ? ObservationSampleEntry<S, IsMany> : never;
