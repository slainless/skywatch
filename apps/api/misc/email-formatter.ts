import { Cities, pointToCity, type GlobalCity } from "@deweazer/city-list";
import type { Point3D } from "@deweazer/common";
import type { WeatherData } from "@deweazer/weather";
import { WMOCode } from "@deweazer/weather";

export function format(
	name: string,
	points: Point3D[],
	weathers: Required<WeatherData>[],
) {
	return /*html*/ `
    <h1>OK, hear me out: 🌦️ New weather just dropped!</h1>
    
    <p>Good day to you ${name}!</p>
    <p>So, we have some fresh weather samples that we want to share with you:</p>
    <ul>
      ${formatLocations(points, weathers).map(({ location, weather }) => {
				return /*html*/ `<li>${location}: ${weather}</li>`;
			})}
    </ul>
    <br></br>
    <p>Have a good day,</p>
    <p>@deweazer</p>
    <br></br>
    <p>Click here to <a href="#">Stop subscribing</a></p>
  `;
}

// const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
function formatLocations(
	points: Point3D[],
	weathers: Required<WeatherData>[],
): { location: string; weather: string }[] {
	return points.map((point, index) => {
		const weather = weathers[index]!;
		const weatherCode = weather.current.data.weatherCode;
		const city = pointToCity(point.latitude, point.longitude);

		return {
			location: formatLocation(city ?? point),
			weather: formatWeather(weatherCode),
		};
	});
}

function formatLocation(location: Point3D | GlobalCity): string {
	if (typeof location === "object")
		return `🗺️ Coordinate(${location.latitude}, ${location.longitude})`;
	const city = Cities[location];
	return `${formatCountryEmote(city.code)} ${city.displayName}`;
}

const WW = WMOCode.WorldWide;
function formatWeather(code: WMOCode.WorldWide): string {
	switch (code) {
		case WW.Clear:
			return "Clear sky ☀️";
		case WW.MainlyClear:
			return "Mostly clear sky 🌤️";
		case WW.PartlyCloudy:
			return "Partly clear sky ⛅";
		case WW.Overcast:
			return "Overcast ☁️";

		case WW.Fog:
			return "Foggy 🌫️";
		case WW.DepositingRimeFog:
			return "Foggy, depositing rime 🌫️🥶";

		case WW.LightDrizzle:
			return "Light drizzle 🌦️";
		case WW.ModerateDrizzle:
			return "Moderate drizzle 🌧️";
		case WW.DenseDrizzle:
			return "Dense drizzle 🌧️";

		case WW.LightFreezingDrizzle:
			return "Light drizzle, freezing 🌧️🥶";
		case WW.DenseFreezingDrizzle:
			return "Moderate to dense drizzle, freezing 🌧️🥶";

		case WW.SlightRain:
			return "Slight rain 🌧️";
		case WW.ModerateRain:
			return "Moderate rain 🌧️";
		case WW.HeavyRain:
			return "Heavy rain ☔";

		case WW.LightFreezingRain:
			return "Light rain, freezing 🌧️🥶";
		case WW.HeavyFreezingRain:
			return "Heavy rain, freezing ☔🥶";

		case WW.SlightSnowFall:
			return "Slight snowfall 🌨️";
		case WW.ModerateSnowFall:
			return "Moderate snowfall 🌨️";
		case WW.HeavySnowFall:
			return "Heavy snowfall 🌨️❄️";

		case WW.SnowGrain:
			return "Snow grain 🌨️❄️";

		case WW.SlightRainShowers:
			return "Slight rain shower 🌧️";
		case WW.ModerateRainShowers:
			return "Moderate rain shower ☔";
		case WW.ViolentRainShowers:
			return "Violent rain shower ☔";

		case WW.SlightSnowShowers:
			return "Slight snow shower 🌨️";
		case WW.HeavySnowShowers:
			return "Heavy snow shower 🌨️";

		case WW.Thunderstorm:
			return "Thunderstorm ⛈️";

		case WW.ThunderstormWithSlightHail:
			return "Thunderstorm with slight hail ⛈️❄️";
		case WW.ThunderstormWithHeavyHail:
			return "Thunderstorm with heavy hail ⛈️❄️";
	}
}

function formatCountryEmote(countryCode: string): string {
	switch (countryCode) {
		case "GB":
			return "🇬🇧";
		case "US":
			return "🇺🇸";
		case "CN":
			return "🇨🇳";
		case "AE":
			return "🇦🇪";
		case "HK":
			return "🇭🇰";
		case "FR":
			return "🇫🇷";
		case "SG":
			return "🇸🇬";
		case "JP":
			return "🇯🇵";
		case "NL":
			return "🇳🇱";
		case "BE":
			return "🇧🇪";
		case "DE":
			return "🇩🇪";
		case "TR":
			return "🇹🇷";
		case "ID":
			return "🇮🇩";
		case "MY":
			return "🇲🇾";
		case "LU":
			return "🇱🇺";
		case "ES":
			return "🇪🇸";
		case "MX":
			return "🇲🇽";
		case "IT":
			return "🇮🇹";
		case "IN":
			return "🇮🇳";
		case "BR":
			return "🇧🇷";
		case "KR":
			return "🇰🇷";
		case "AU":
			return "🇦🇺";
		case "CA":
			return "🇨🇦";
		case "PL":
			return "🇵🇱";
		default:
			return "🇺🇳";
	}
}
