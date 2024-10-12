import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	mock,
	setSystemTime,
} from "bun:test";
import { WeatherRepository } from "./weather";
import { createMockPersistence } from "../test/helper";
import type { WeatherData } from "@deweazer/weather";
import merge from "merge";
import expected from "../test/example.expected.json";
import {
	addDays,
	addHours,
	addMilliseconds,
	addMinutes,
	addMonths,
	addSeconds,
	addWeeks,
	addYears,
	subDays,
	subHours,
	subMilliseconds,
	subMinutes,
	subMonths,
	subSeconds,
	subWeeks,
	subYears,
} from "date-fns";
import type { GetResult } from "@deweazer/persistence";
import type { Point3D } from "@deweazer/common";

const { persistence, cache, storage } = createMockPersistence();

afterEach(() => {
	mock.restore();
	setSystemTime();
});

const date = new Date("2000-01-02T01:00:00.000Z");
const data = (v: Partial<WeatherData>) =>
	merge({}, expected, v) as Required<WeatherData>;
const dataWithTimestamp = (date: Date) =>
	data({ sampleTimestamp: date.getTime() });

const storageMiss = () =>
	({ cacheHit: false, storageHit: false, value: null }) satisfies GetResult;
const storageHit = (v: any) =>
	({ cacheHit: false, storageHit: true, value: v }) satisfies GetResult;
const cacheHit = (v: any) =>
	({ cacheHit: true, storageHit: false, value: v }) satisfies GetResult;

describe(WeatherRepository.name, () => {
	it("should return correct key partitions", async () => {
		const repo = new WeatherRepository(persistence);

		setSystemTime(date);
		const staleData = dataWithTimestamp(subHours(date, 24));
		const tuples = (
			n: number,
			k: Point3D,
			v: GetResult<Required<WeatherData>>,
		) =>
			Array(n)
				.fill(0)
				.map((_, index) => [{ ...k, longitude: index }, v] as const) as [
				typeof k,
				typeof v,
			][];
		const bulk = [
			...tuples(100, { latitude: 1, longitude: 0 }, storageMiss()),
			...tuples(25, { latitude: 2, longitude: 0 }, storageHit(staleData)),
			...tuples(7, { latitude: 3, longitude: 0 }, cacheHit(staleData)),
			...tuples(25, { latitude: 4, longitude: 0 }, storageHit(staleData)),
			...tuples(200, { latitude: 5, longitude: 0 }, storageMiss()),
			...tuples(13, { latitude: 6, longitude: 0 }, cacheHit(staleData)),
		];
		const keys = bulk.map((v) => v[0]);
		const values = bulk.map((v) => v[1]);
		persistence.bulkGet.mockResolvedValueOnce(values);

		const result = await repo.getWeathers(keys);
		expect(keys.map((key) => result.results.get(key))).toEqual(values);
		expect(persistence.bulkGet).toHaveBeenLastCalledWith(
			keys.map(WeatherRepository.serializePoint),
		);

		const isLat = (n: number) => (k: Point3D) => k.latitude === n;
		expect(result.cacheHit).toEqual([
			...keys.filter(isLat(3)),
			...keys.filter(isLat(6)),
		]);
		expect(result.storageHit).toEqual([
			...keys.filter(isLat(2)),
			...keys.filter(isLat(4)),
		]);
		expect(result.storageMiss).toEqual([
			...keys.filter(isLat(1)),
			...keys.filter(isLat(5)),
		]);
		expect(result.stale).toEqual([
			...keys.filter(isLat(2)),
			...keys.filter(isLat(3)),
			...keys.filter(isLat(4)),
			...keys.filter(isLat(6)),
		]);
	});

	it("should correctly identify stale data", async () => {
		const repo = new WeatherRepository(persistence);

		// we are testing the expire boundary...
		// since data is using interval 900s, we are substracting 900s from base date
		setSystemTime(addSeconds(date, 900));
		const point = (x: number, y: number) => ({ latitude: y, longitude: x });
		const bulk = [
			[point(1, 2), storageMiss()], // miss

			// exact time should result to stale response
			[point(2, 1), cacheHit(dataWithTimestamp(date))], // exact time
			[point(2, 2), cacheHit(dataWithTimestamp(date))], // exact time

			// ms test
			// 1ms difference should matter
			[point(3, 1), storageHit(dataWithTimestamp(addMilliseconds(date, 1)))],
			[point(3, 2), storageHit(dataWithTimestamp(subMilliseconds(date, 1)))], // stale

			// s test
			// 1s difference should matter
			[point(4, 1), cacheHit(dataWithTimestamp(addSeconds(date, 1)))],
			[point(4, 2), cacheHit(dataWithTimestamp(subSeconds(date, 1)))], // stale

			// backtrack test
			// should stale
			[point(5, 1), storageHit(dataWithTimestamp(subMinutes(date, 1)))],
			[point(5, 2), storageHit(dataWithTimestamp(subHours(date, 1)))],
			[point(5, 3), storageHit(dataWithTimestamp(subDays(date, 1)))],
			[point(5, 4), storageHit(dataWithTimestamp(subWeeks(date, 1)))],
			[point(5, 5), storageHit(dataWithTimestamp(subMonths(date, 1)))],
			[point(5, 6), storageHit(dataWithTimestamp(subYears(date, 1)))],

			// forward test
			[point(6, 1), cacheHit(dataWithTimestamp(addMinutes(date, 1)))],
			[point(6, 2), cacheHit(dataWithTimestamp(addHours(date, 1)))],
			[point(6, 3), cacheHit(dataWithTimestamp(addDays(date, 1)))],
			[point(6, 4), cacheHit(dataWithTimestamp(addWeeks(date, 1)))],
			[point(6, 5), cacheHit(dataWithTimestamp(addMonths(date, 1)))],
			[point(6, 6), cacheHit(dataWithTimestamp(addYears(date, 1)))],
		] satisfies [Point3D, GetResult<Required<WeatherData>>][];
		const keys = bulk.map((v) => v[0]);
		const values = bulk.map((v) => v[1]);
		const shouldStale = [
			keys[1],
			keys[2],
			keys[4],
			keys[6],
			...keys.filter((k) => k.longitude === 5),
		] as Point3D[];

		persistence.bulkGet.mockResolvedValueOnce(values);
		const result = await repo.getWeathers(keys);
		expect(keys.map((k) => result.results.get(k))).toEqual(values);
		expect(persistence.bulkGet).toHaveBeenLastCalledWith(
			keys.map(WeatherRepository.serializePoint),
		);

		expect(result.cacheHit).toEqual(
			keys.filter((k) => [2, 4, 6].includes(k.longitude)),
		);
		expect(result.storageHit).toEqual(
			keys.filter((k) => [3, 5].includes(k.longitude)),
		);
		expect(result.storageMiss).toEqual(
			keys.filter((k) => [1].includes(k.longitude)),
		);

		expect(result.stale).toEqual(shouldStale);
	});
});
