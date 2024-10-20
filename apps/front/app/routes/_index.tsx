import { WeatherCard } from "#components/weather-card";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Cities, GlobalCity } from "@skywatch/city-list";
import type { WeatherData } from "@skywatch/weather";
import ky from "ky";

const cities = [
  GlobalCity.Tokyo,
  GlobalCity.Jakarta,
  GlobalCity.KualaLumpur,
  GlobalCity.NewYorkCity,
  GlobalCity.London,
];

export async function loader(args: LoaderFunctionArgs) {
  const weathers = await ky
    .get("http://localhost:7777/v1/weathers", {
      searchParams: {
        locations: JSON.stringify(cities),
      },
    })
    .json<{ data: Required<WeatherData>[] }>();
  return cities.map(
    (city, index) => [Cities[city], weathers.data[index]] as const,
  );
}

export default function Index() {
  const weathers = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-[320px_auto]">
      <section className="p-10 sticky top-0 h-[100vh]">
        <h1 className="text-5xl mb-4">Skywatch</h1>
        <p>Let us take a look at what the sky is up to, shall we?</p>
      </section>
      <main className="p-10">
        <div className="grid grid-cols-2 gap-4">
          {weathers?.map(([city, weather]) => (
            <WeatherCard city={city} data={weather} key={city.displayName} />
          ))}
        </div>
      </main>
    </div>
  );
}
