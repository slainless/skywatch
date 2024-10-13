import { afterEach, describe, expect, it, mock, setSystemTime } from "bun:test";
import type { WeatherData } from "@skywatch/weather";
import { subSeconds } from "date-fns";
import type { WeatherRepositoryResult } from "../repository/weather";
import {
  MockEventService,
  MockWeatherEventHandler,
  MockWeatherRepository,
  createMockProvider,
} from "../test/helper";
import {
  type WeatherGetResultTuple,
  type WeatherTuple,
  cacheHit,
  dataWithTimestamp,
  point,
  storageHit,
  storageMiss,
} from "../test/weather";
import { WeatherService } from "./weather";

const repo = new MockWeatherRepository();
const weatherEvent = new MockWeatherEventHandler();
const event = new MockEventService(weatherEvent);
const provider = createMockProvider();

afterEach(() => {
  mock.restore();
  setSystemTime();
});

const date = new Date("2000-01-02T01:00:00.000Z");

describe(WeatherService.name, () => {
  it("should return early when all data exists in persistence and no stale data", async () => {
    const service = new WeatherService(repo, event, provider);

    setSystemTime(date);
    const sample = dataWithTimestamp(date);
    const bulk = [
      [point(0, 0), storageHit(sample)],
      [point(0, 1), storageHit(sample)],
      [point(0, 2), storageHit(sample)],
      [point(1, 3), cacheHit(sample)],
      [point(1, 4), cacheHit(sample)],
      [point(0, 5), storageHit(sample)],
      [point(0, 6), storageHit(sample)],
    ] as WeatherGetResultTuple[];
    const keys = bulk.map((v) => v[0]);
    const values = bulk.map((v) => v[1]);

    repo.getWeathers.mockResolvedValueOnce({
      results: new Map(bulk),
      cacheHit: keys.filter((v) => v.longitude === 1),
      storageHit: keys.filter((v) => v.longitude === 0),
      storageMiss: [],
      stale: [],
    } satisfies WeatherRepositoryResult);

    await expect(service.getWeathers(keys)).resolves.toEqual(
      values.map((v) => v.value as any),
    );
    expect(repo.getWeathers).toHaveBeenLastCalledWith(keys);
    expect(provider.getWeathers).toBeCalledTimes(0);
    expect(repo.setWeathers).toBeCalledTimes(0);
    expect(weatherEvent.new).toBeCalledTimes(0);
  });

  it("should return early but renew weathers in background when there is stale data", async () => {
    const service = new WeatherService(repo, event, provider);

    const date = new Date();
    const sample = dataWithTimestamp(date);
    const staleSample = dataWithTimestamp(subSeconds(date, 900));
    const bulk = [
      [point(0, 0), storageHit(sample)],
      [point(0, 1), storageHit(staleSample)],
      [point(0, 2), storageHit(sample)],
      [point(1, 3), cacheHit(staleSample)],
      [point(1, 4), cacheHit(sample)],
      [point(0, 5), storageHit(staleSample)],
      [point(0, 6), storageHit(sample)],
    ] as WeatherGetResultTuple[];
    const keys = bulk.map((v) => v[0]);
    const values = bulk.map((v) => v[1]);

    const repoResult = {
      results: new Map(bulk),
      cacheHit: keys.filter((v) => v.longitude === 1),
      storageHit: keys.filter((v) => v.longitude === 0),
      storageMiss: [],
      stale: [keys[1], keys[3], keys[5]] as any,
    } satisfies WeatherRepositoryResult;
    repo.getWeathers.mockResolvedValueOnce(repoResult);

    let returnTime: number;
    let fetchTime: number;
    const simulatedWait = 700;

    provider.getWeathers.mockImplementationOnce(async (args) => {
      await Bun.sleep(simulatedWait);
      fetchTime = Date.now();
      return Array(repoResult.stale.length).fill(sample);
    });
    await expect(
      service.getWeathers(keys).then((result) => {
        returnTime = Date.now();
        return result;
      }),
    ).resolves.toEqual(values.map((v) => v.value as any));
    await provider.getWeathers.mock.results.at(-1)?.value;
    expect(fetchTime! - returnTime!).toBeWithin(
      simulatedWait - 50,
      simulatedWait + 50,
    );
    await Bun.sleep(50);

    expect(repo.getWeathers).toHaveBeenLastCalledWith(keys);
    expect(provider.getWeathers).toHaveBeenLastCalledWith(repoResult.stale);
    expect(repo.setWeathers).toHaveBeenCalledWith(
      repoResult.stale,
      Array(repoResult.stale.length).fill(sample),
    );
    expect(weatherEvent.new).toHaveBeenCalledWith(
      repoResult.stale,
      Array(repoResult.stale.length).fill(sample),
    );
  });

  it("should fetch and wait for new weathers when there is missing data", async () => {
    const service = new WeatherService(repo, event, provider);

    const date = new Date();
    const sample = dataWithTimestamp(date);
    const staleSample = dataWithTimestamp(subSeconds(date, 900));
    const bulk = [
      [point(0, 0), storageHit(sample)],
      [point(0, 1), storageHit(staleSample)],
      [point(0, 2), storageMiss()],
      [point(1, 3), cacheHit(staleSample)],
      [point(1, 4), cacheHit(sample)],
      [point(0, 5), storageHit(staleSample)],
      [point(0, 6), storageMiss()],
    ] as WeatherGetResultTuple[];
    const keys = bulk.map((v) => v[0]);
    const values = bulk.map((v) => v[1]);

    const repoResult = {
      results: new Map(bulk),
      cacheHit: keys.filter((v) => v.longitude === 1),
      storageHit: keys.filter((v) => v.longitude === 0),
      storageMiss: [keys[2], keys[6]] as any,
      stale: [keys[1], keys[3], keys[5]] as any,
    } satisfies WeatherRepositoryResult;
    repo.getWeathers.mockResolvedValueOnce(repoResult);

    const toBeFetched = [...repoResult.storageMiss, ...repoResult.stale];

    let returnTime: number;
    let fetchTime: number;
    const simulatedWait = 700;

    provider.getWeathers.mockImplementationOnce(async (args) => {
      await Bun.sleep(simulatedWait);
      fetchTime = Date.now();
      return Array(toBeFetched.length).fill(sample);
    });
    const result = await service.getWeathers(keys).then((result) => {
      returnTime = Date.now();
      return result;
    });
    expect(result).toEqual(Array(bulk.length).fill(sample));
    await provider.getWeathers.mock.results.at(-1)?.value;
    expect(fetchTime! - returnTime!).toBeWithin(-50, 50);
    await Bun.sleep(50);

    expect(repo.getWeathers).toHaveBeenLastCalledWith(keys);
    expect(provider.getWeathers).toHaveBeenLastCalledWith(toBeFetched);
    expect(repo.setWeathers).toHaveBeenCalledWith(
      toBeFetched,
      Array(toBeFetched.length).fill(sample),
    );
    expect(weatherEvent.new).toHaveBeenCalledWith(
      toBeFetched,
      Array(toBeFetched.length).fill(sample),
    );
  });
});
