import { cn } from "#lib/utils";
import { useMemo, type PropsWithChildren } from "react";
import { Sparkline } from "./sparkline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { WMOCode, type WeatherData } from "@skywatch/weather";
import type { Cities } from "@skywatch/city-list";
import type { AxisDomain } from "recharts/types/util/types";
import { Flag } from "./flag";
import { WeatherIcon, WeatherText } from "./weather-code";
import { compareAsc, isSameDay } from "date-fns";

export interface WeatherCardProps {
  city: (typeof Cities)[keyof typeof Cities];
  data: Required<WeatherData>;
  domainY?: {
    temperature?: AxisDomain;
    relativeHumidity?: AxisDomain;
    windSpeed?: AxisDomain;
  };
}
export function WeatherCard(props: WeatherCardProps) {
  const { data, city, domainY } = props;

  const sampleTime = useMemo(() => new Date(data.sampleTimestamp), [data]);
  const currentDay = useMemo(() => {
    return data.daily.data.time.findIndex((time) =>
      isSameDay(sampleTime, new Date(time)),
    );
  }, [sampleTime, data]);
  const isDay = useMemo(() => {
    if (currentDay === -1) return true;
    const sunrise = new Date(data.daily.data.sunrise[currentDay]!);
    const sunset = new Date(data.daily.data.sunset[currentDay]!);
    return (
      compareAsc(sampleTime, sunrise) >= 0 && compareAsc(sunset, sampleTime) > 0
    );
  }, [sampleTime, currentDay, data]);

  return (
    <Card>
      <CardHeader className="p-0 h-24 box-content">
        <div className="p-6 flex">
          <div>
            <CardTitle className="flex items-center">
              <Flag
                country={city.code}
                className="h-4 inline-block mr-2 shadow"
              />
              {city.displayName}
            </CardTitle>
            <CardDescription>
              <WeatherText code={data.current.data.weatherCode} />
            </CardDescription>
          </div>
          <div className="ml-auto">
            <p>{sampleTime.toLocaleTimeString()}</p>
            <p className="text-xs text-right">
              {sampleTime.toLocaleDateString()}
            </p>
          </div>
          <div className="size-12 ml-3">
            <WeatherIcon
              code={data.current.data.weatherCode}
              variant={isDay ? "day" : "night"}
              width="100%"
              height="auto"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-36 flex flex-col justify-end">
        <div className="grid grid-cols-3">
          <div className="grid row-span-2 grid-rows-subgrid pt-6 border-t border-r">
            <Parameter
              title="Temperature"
              value={
                data.current.data.temperature + data.current.units.temperature
              }
            />
            <Sparkline
              data={data.hourly.data.temperature.map((value) => ({ value }))}
              className="text-blue-400"
              domainY={domainY?.temperature ?? [0, 40]}
            />
          </div>
          <div className="grid row-span-2 grid-rows-subgrid pt-6 border-t border-r">
            <Parameter
              title="Humidity"
              value={
                data.current.data.relativeHumidity +
                data.current.units.relativeHumidity
              }
            />
            <Sparkline
              data={data.hourly.data.relativeHumidity.map((value) => ({
                value,
              }))}
              className="text-blue-400"
              domainY={domainY?.relativeHumidity ?? [0, 100]}
            />
          </div>
          <div className="grid row-span-2 grid-rows-subgrid pt-6 border-t">
            <Parameter
              title="Wind Speed"
              value={data.current.data.windSpeed + data.current.units.windSpeed}
            />
            <Sparkline
              data={data.hourly.data.windSpeed.map((value) => ({ value }))}
              className="text-blue-400"
              domainY={domainY?.windSpeed ?? [0, 20]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ParameterProps extends PropsWithChildren {
  title: string;
  value: string;
  styles?: {
    value?: string;
  };
}
function Parameter(props: ParameterProps) {
  return (
    <div className="px-6 last:border-r-0 mb-2">
      <div className="">
        <div className="text-xs">{props.title}</div>
        <div>
          <div className={cn("text-2xl", props.styles?.value)}>
            {props.value}
          </div>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  );
}

function SubParameter(props: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs">{props.title}</div>
      <div>
        <div className="text-sm">{props.value}</div>
      </div>
    </div>
  );
}
