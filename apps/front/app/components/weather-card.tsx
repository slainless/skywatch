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

export interface WeatherCardProps {
  city: (typeof Cities)[keyof typeof Cities];
  data: Required<WeatherData>;
}
export function WeatherCard(props: WeatherCardProps) {
  const { data, city } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{city.displayName}</CardTitle>
        <CardDescription>Overcast ☁️</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="grid grid-cols-subgrid col-span-full">
            <Parameter
              title="Temperature"
              value={
                data.current.data.temperature + data.current.units.temperature
              }
            >
              <Sparkline
                data={data.hourly.data.map((v) => ({ value: v.temperature }))}
              />
              {/* <div className="grid grid-cols-3 opacity-50">
                <SubParameter title="App." value="80°C" />
                <SubParameter title="Min." value="80°C" />
                <SubParameter title="Max." value="80°C" />
              </div> */}
            </Parameter>
            <Parameter
              title="Humidity"
              value={
                data.current.data.relativeHumidity +
                data.current.units.relativeHumidity
              }
            >
              <Sparkline
                data={data.hourly.data.map((v) => ({
                  value: v.relativeHumidity,
                }))}
              />
            </Parameter>
            <Parameter
              title="Precipitation"
              value={
                data.current.data.precipitation +
                data.current.units.precipitation
              }
            >
              <Sparkline
                data={data.hourly.data.map((v) => ({ value: v.precipitation }))}
              />
            </Parameter>
            <Parameter
              title="Wind Speed"
              value={data.current.data.windSpeed + data.current.units.windSpeed}
            >
              <Sparkline
                data={data.hourly.data.map((v) => ({ value: v.windSpeed }))}
              />
              {/* <div className="grid grid-cols-2 opacity-50">
                <SubParameter title="Direction" value="12.4°" />
                <SubParameter title="Gusts" value="34km/h" />
              </div> */}
            </Parameter>
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
    <div>
      <div className="text-xs">{props.title}</div>
      <div>
        <div className={cn("text-2xl", props.styles?.value)}>{props.value}</div>
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
