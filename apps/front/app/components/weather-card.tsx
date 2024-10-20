import { cn } from "#lib/utils";
import type { PropsWithChildren } from "react";
import { Sparkline } from "./sparkline";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import type { WeatherData } from "@skywatch/weather";
import type { Cities } from "@skywatch/city-list";
import type { AxisDomain } from "recharts/types/util/types";
import { Flag } from "./flag";

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
  const sampleTime = new Date(data.sampleTimestamp);
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
            <CardDescription>Overcast ☁️</CardDescription>
          </div>
          <div className="ml-auto">
            <p>{sampleTime.toLocaleTimeString()}</p>
            <p className="text-xs text-right">
              {sampleTime.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-28 flex flex-col justify-end">
        <div className="grid grid-cols-3">
          <div className="grid grid-cols-subgrid col-span-full">
            <Parameter
              title="Temperature"
              value={
                data.current.data.temperature + data.current.units.temperature
              }
            >
              {}
            </Parameter>
            <Parameter
              title="Humidity"
              value={
                data.current.data.relativeHumidity +
                data.current.units.relativeHumidity
              }
            >
              {}
            </Parameter>
            <Parameter
              title="Wind Speed"
              value={data.current.data.windSpeed + data.current.units.windSpeed}
            >
              {}
            </Parameter>
          </div>
          <div className="grid grid-cols-subgrid col-span-full [&>*]:border-r [&>*:last-child]:border-r-0 ">
            <Sparkline
              data={data.hourly.data.temperature.map((value) => ({ value }))}
              className="text-blue-400"
              domainY={domainY?.temperature ?? [0, 40]}
            />
            <Sparkline
              data={data.hourly.data.relativeHumidity.map((value) => ({
                value,
              }))}
              className="text-blue-400"
              domainY={domainY?.relativeHumidity ?? [0, 100]}
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
    <div className="px-6 border-r last:border-r-0">
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
