import type { GetResult } from "@skywatch/persistence";
import type { WeatherData } from "@skywatch/weather";
import { merge } from "merge";
import expected from "./example.expected.json";
import type { Point3D } from "@skywatch/common";

export const data = (v: Partial<WeatherData>) =>
	merge({}, expected, v) as Required<WeatherData>;
export const dataWithTimestamp = (date: Date) =>
	data({ sampleTimestamp: date.getTime() });

export const storageMiss = () =>
	({ cacheHit: false, storageHit: false, value: null }) satisfies GetResult;
export const storageHit = (v: any) =>
	({ cacheHit: false, storageHit: true, value: v }) satisfies GetResult;
export const cacheHit = (v: any) =>
	({ cacheHit: true, storageHit: false, value: v }) satisfies GetResult;

export const point = (x: number, y: number) => ({ latitude: y, longitude: x });

export type WeatherTuple = [Point3D, Required<WeatherData>];
export type WeatherGetResultTuple = [Point3D, GetResult<Required<WeatherData>>];
