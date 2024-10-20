import { WMOCode } from "@skywatch/weather";

const Code = WMOCode.WorldWide;

import type { ComponentProps, ComponentType } from "react";
import MeteoconsClearDayFill from "~icons/meteocons/clear-day-fill";
import MeteoconsExtremeFill from "~icons/meteocons/extreme-fill";
import MeteoconsPartlyCloudyDayFill from "~icons/meteocons/partly-cloudy-day-fill";
import MeteoconsOvercastDayFill from "~icons/meteocons/overcast-day-fill";
import MeteoconsFogFill from "~icons/meteocons/fog-fill";
import MeteoconsMistFill from "~icons/meteocons/mist-fill";
import MeteoconsPartlyCloudyDayDrizzleFill from "~icons/meteocons/partly-cloudy-day-drizzle-fill";
import MeteoconsOvercastDayDrizzleFill from "~icons/meteocons/overcast-day-drizzle-fill";
import MeteoconsOvercastDrizzleFill from "~icons/meteocons/overcast-drizzle-fill";
import MeteoconsDrizzleFill from "~icons/meteocons/drizzle-fill";
import MeteoconsPartlyCloudyDayRainFill from "~icons/meteocons/partly-cloudy-day-rain-fill";
import MeteoconsRainFill from "~icons/meteocons/rain-fill";
import MeteoconsOvercastRainFill from "~icons/meteocons/overcast-rain-fill";
import MeteoconsPartlyCloudyDaySnowFill from "~icons/meteocons/partly-cloudy-day-snow-fill";
import MeteoconsSnowFill from "~icons/meteocons/snow-fill";
import MeteoconsExtremeDrizzleFill from "~icons/meteocons/extreme-drizzle-fill";
import MeteoconsExtremeRainFill from "~icons/meteocons/extreme-rain-fill";
import MeteoconsOvercastSnowFill from "~icons/meteocons/overcast-snow-fill";
import MeteoconsExtremeSnowFill from "~icons/meteocons/extreme-snow-fill";
import MeteoconsThunderstormsFill from "~icons/meteocons/thunderstorms-fill";
import MeteoconsThunderstormsOvercastFill from "~icons/meteocons/thunderstorms-overcast-fill";

const meteoconsMap: Record<
  WMOCode.WorldWide,
  ComponentType<ComponentProps<"svg">>
> = {
  [Code.Clear]: MeteoconsClearDayFill,
  [Code.MainlyClear]: MeteoconsClearDayFill,
  [Code.PartlyCloudy]: MeteoconsPartlyCloudyDayFill,
  [Code.Overcast]: MeteoconsExtremeFill,

  [Code.Fog]: MeteoconsFogFill,
  [Code.DepositingRimeFog]: MeteoconsFogFill,

  [Code.LightDrizzle]: MeteoconsDrizzleFill,
  [Code.ModerateDrizzle]: MeteoconsOvercastDrizzleFill,
  [Code.DenseDrizzle]: MeteoconsExtremeDrizzleFill,

  [Code.LightFreezingDrizzle]: MeteoconsOvercastDrizzleFill,
  [Code.DenseFreezingDrizzle]: MeteoconsOvercastDrizzleFill,

  [Code.SlightRain]: MeteoconsRainFill,
  [Code.ModerateRain]: MeteoconsOvercastRainFill,
  [Code.HeavyRain]: MeteoconsExtremeRainFill,

  [Code.LightFreezingRain]: MeteoconsOvercastRainFill,
  [Code.HeavyFreezingRain]: MeteoconsExtremeRainFill,

  [Code.SlightSnowFall]: MeteoconsSnowFill,
  [Code.ModerateSnowFall]: MeteoconsOvercastSnowFill,
  [Code.HeavySnowFall]: MeteoconsExtremeSnowFill,

  [Code.SnowGrain]: MeteoconsSnowFill,
  [Code.SlightRainShowers]: MeteoconsRainFill,
  [Code.ModerateRainShowers]: MeteoconsOvercastRainFill,
  [Code.ViolentRainShowers]: MeteoconsExtremeRainFill,
  [Code.SlightSnowShowers]: MeteoconsSnowFill,
  [Code.HeavySnowShowers]: MeteoconsExtremeSnowFill,

  [Code.Thunderstorm]: MeteoconsThunderstormsFill,
  [Code.ThunderstormWithSlightHail]: MeteoconsThunderstormsOvercastFill,
  [Code.ThunderstormWithHeavyHail]: MeteoconsThunderstormsOvercastFill,
};

import WiDaySunny from "~icons/wi/day-sunny";
import WiDayCloudy from "~icons/wi/day-cloudy";
import WiDayFog from "~icons/wi/day-fog";
import WiDayShowers from "~icons/wi/day-showers";
import WiDayThunderstorm from "~icons/wi/day-thunderstorm";
import WiDaySnow from "~icons/wi/day-snow";
import WiDaySnowWind from "~icons/wi/day-snow-wind";
import WiDayRain from "~icons/wi/day-rain";
import WiDayRainWind from "~icons/wi/day-rain-wind";
import WiDayRainMix from "~icons/wi/day-rain-mix";

import WiNightSunny from "~icons/wi/night-clear";
import WiNightCloudy from "~icons/wi/night-cloudy";
import WiNightFog from "~icons/wi/night-fog";
import WiNightShowers from "~icons/wi/night-showers";
import WiNightThunderstorm from "~icons/wi/night-thunderstorm";
import WiNightSnow from "~icons/wi/night-snow";
import WiNightSnowWind from "~icons/wi/night-snow-wind";
import WiNightRain from "~icons/wi/night-rain";
import WiNightRainWind from "~icons/wi/night-rain-wind";
import WiNightRainMix from "~icons/wi/night-rain-mix";

const wiDayMap: Record<
  WMOCode.WorldWide,
  ComponentType<ComponentProps<"svg">>
> = {
  [Code.Clear]: WiDaySunny,
  [Code.MainlyClear]: WiDaySunny,
  [Code.PartlyCloudy]: WiDayCloudy,
  [Code.Overcast]: WiDayCloudy,

  [Code.Fog]: WiDayFog,
  [Code.DepositingRimeFog]: WiDayFog,

  [Code.LightDrizzle]: WiDayRainMix,
  [Code.ModerateDrizzle]: WiDayRainMix,
  [Code.DenseDrizzle]: WiDayRainMix,

  [Code.LightFreezingDrizzle]: WiDayRainMix,
  [Code.DenseFreezingDrizzle]: WiDayRainMix,

  [Code.SlightRain]: WiDayRain,
  [Code.ModerateRain]: WiDayRain,
  [Code.HeavyRain]: WiDayRain,

  [Code.LightFreezingRain]: WiDayRainWind,
  [Code.HeavyFreezingRain]: WiDayRainWind,

  [Code.SlightSnowFall]: WiDaySnow,
  [Code.ModerateSnowFall]: WiDaySnow,
  [Code.HeavySnowFall]: WiDaySnowWind,

  [Code.SnowGrain]: WiDaySnow,

  [Code.SlightRainShowers]: WiDayShowers,
  [Code.ModerateRainShowers]: WiDayShowers,
  [Code.ViolentRainShowers]: WiDayShowers,
  [Code.SlightSnowShowers]: WiDayShowers,
  [Code.HeavySnowShowers]: WiDayShowers,

  [Code.Thunderstorm]: WiDayThunderstorm,
  [Code.ThunderstormWithSlightHail]: WiDayThunderstorm,
  [Code.ThunderstormWithHeavyHail]: WiDayThunderstorm,
};

const wiNightMap: Record<
  WMOCode.WorldWide,
  ComponentType<ComponentProps<"svg">>
> = {
  [Code.Clear]: WiNightSunny,
  [Code.MainlyClear]: WiNightSunny,
  [Code.PartlyCloudy]: WiNightCloudy,
  [Code.Overcast]: WiNightCloudy,

  [Code.Fog]: WiNightFog,
  [Code.DepositingRimeFog]: WiNightFog,

  [Code.LightDrizzle]: WiNightRainMix,
  [Code.ModerateDrizzle]: WiNightRainMix,
  [Code.DenseDrizzle]: WiNightRainMix,

  [Code.LightFreezingDrizzle]: WiNightRainMix,
  [Code.DenseFreezingDrizzle]: WiNightRainMix,

  [Code.SlightRain]: WiNightRain,
  [Code.ModerateRain]: WiNightRain,
  [Code.HeavyRain]: WiNightRain,

  [Code.LightFreezingRain]: WiNightRainWind,
  [Code.HeavyFreezingRain]: WiNightRainWind,

  [Code.SlightSnowFall]: WiNightSnow,
  [Code.ModerateSnowFall]: WiNightSnow,
  [Code.HeavySnowFall]: WiNightSnowWind,

  [Code.SnowGrain]: WiNightSnow,

  [Code.SlightRainShowers]: WiNightShowers,
  [Code.ModerateRainShowers]: WiNightShowers,
  [Code.ViolentRainShowers]: WiNightShowers,
  [Code.SlightSnowShowers]: WiNightShowers,
  [Code.HeavySnowShowers]: WiNightShowers,

  [Code.Thunderstorm]: WiNightThunderstorm,
  [Code.ThunderstormWithSlightHail]: WiNightThunderstorm,
  [Code.ThunderstormWithHeavyHail]: WiNightThunderstorm,
};

export interface WeatherIconProps extends ComponentProps<"svg"> {
  code: WMOCode.WorldWide;
  variant: "day" | "night";
}
export function WeatherIcon(props: WeatherIconProps) {
  const { code, variant, ...rest } = props;
  const Component = variant === "day" ? wiDayMap[code] : wiNightMap[code];
  return <Component {...rest} />;
}

const textMap: Record<WMOCode.WorldWide, string> = {
  [Code.Clear]: "Clear sky",
  [Code.MainlyClear]: "Mostly clear sky",
  [Code.PartlyCloudy]: "Partly clear sky",
  [Code.Overcast]: "Overcast",

  [Code.Fog]: "Foggy",
  [Code.DepositingRimeFog]: "Foggy, depositing rime",

  [Code.LightDrizzle]: "Light drizzle",
  [Code.ModerateDrizzle]: "Moderate drizzle",
  [Code.DenseDrizzle]: "Dense drizzle",

  [Code.LightFreezingDrizzle]: "Light drizzle, freezing",
  [Code.DenseFreezingDrizzle]: "Moderate to dense drizzle, freezing",

  [Code.SlightRain]: "Slight rain",
  [Code.ModerateRain]: "Moderate rain",
  [Code.HeavyRain]: "Heavy rain",

  [Code.LightFreezingRain]: "Light rain, freezing",
  [Code.HeavyFreezingRain]: "Heavy rain, freezing",

  [Code.SlightSnowFall]: "Slight snowfall",
  [Code.ModerateSnowFall]: "Moderate snowfall",
  [Code.HeavySnowFall]: "Heavy snowfall",

  [Code.SnowGrain]: "Snow grain",

  [Code.SlightRainShowers]: "Slight rain shower",
  [Code.ModerateRainShowers]: "Moderate rain shower",
  [Code.ViolentRainShowers]: "Violent rain shower",

  [Code.SlightSnowShowers]: "Slight snow shower",
  [Code.HeavySnowShowers]: "Heavy snow shower",

  [Code.Thunderstorm]: "Thunderstorm",

  [Code.ThunderstormWithSlightHail]: "Thunderstorm with slight hail",
  [Code.ThunderstormWithHeavyHail]: "Thunderstorm with heavy hail",
};

export interface WeatherTextProps extends ComponentProps<"span"> {
  code: WMOCode.WorldWide;
}
export function WeatherText(props: WeatherTextProps) {
  const { code, ...rest } = props;
  return <span {...rest}>{textMap[code]}</span>;
}
