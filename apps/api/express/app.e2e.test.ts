import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	setSystemTime,
} from "bun:test";
import { createServer } from "./app";
import { WeatherService } from "../service/weather";
import { WeatherRepository } from "../repository/weather";
import { EventService } from "../service/event";
import { EmailPusher } from "@skywatch/email";
import { OpenMeteoProvider } from "@skywatch/weather/openmeteo";
import { CacheMetadataRepository } from "../repository/cache-metadata";
import { RedisKV } from "@skywatch/persistence/redis-kv";
import { LazyLoadPersistence } from "@skywatch/persistence/lazy-load";
import { MongoKV } from "@skywatch/persistence/mongo-kv";
import ky from "ky";
import { MailHog, Mongo, RabbitMQ, Redis } from "../test/container";
import type { WeatherData } from "@skywatch/weather";
import { Cities, type GlobalCity } from "@skywatch/city-list";
import { createEmailSender } from "@skywatch/email/sender";
import { createEmailPusher } from "@skywatch/email/pusher";
import { createTransport } from "nodemailer";
import { addHours, addSeconds, getTime, subHours } from "date-fns";
import { dataWithTimestamp, storageMiss } from "../test/weather";
import pino from "pino";

const mq = RabbitMQ().orchestrate();
const redis = Redis().orchestrate();
const mongo = Mongo().orchestrate();
const mh = MailHog().orchestrate();

async function orchestrate() {
	const PORT = 8765;
	const EMAIL_SENDER = "noreply@localhost";

	const req = ky.create({
		prefixUrl: `http://localhost:${PORT}/v1`,
		throwHttpErrors: false,
	});
	const mailhog = ky.create({ prefixUrl: "http://localhost:8025/api/v1" });

	const logger = pino({
		transport: {
			target: "pino-pretty",
		},
	});

	const kv = {
		requestCache: new RedisKV(redis.client, { keyPrefix: "cache:" }),
		weatherCache: new RedisKV(redis.client, { keyPrefix: "weather:" }),
		weatherStorage: new MongoKV(mongo.client, mongo.collection, {
			idField: mongo.key,
		}),
	};

	const persistence = new LazyLoadPersistence(
		kv.weatherCache,
		kv.weatherStorage,
	);
	const repo = {
		weather: new WeatherRepository(persistence).setLogger(logger),
		cache: new CacheMetadataRepository(kv.requestCache),
	};

	const provider = new OpenMeteoProvider();

	const emailPusher = await createEmailPusher(mq.channel, EMAIL_SENDER);

	const event = new EventService(emailPusher).setLogger(logger);
	const service = new WeatherService(repo.weather, event, provider).setLogger(
		logger,
	);

	const app = createServer(service, repo.cache);

	app.listen(PORT);

	const transport = createTransport({
		port: 1025,
		host: "localhost",
		secure: false,
		ignoreTLS: true,
		from: EMAIL_SENDER,
		auth: {
			user: EMAIL_SENDER,
			pass: "abc",
		},
	});

	const emailSender = await createEmailSender(
		mq.channel,
		EMAIL_SENDER,
		transport,
	);
	await emailSender.startSending();

	event.weather().addPushTarget("aiman@localhost", "Aiman Fauzy");

	return {
		kv,
		persistence,
		repo,
		provider,
		emailPusher,
		event,
		service,
		app,
		PORT,
		req,
		mailhog,
		emailSender,
	};
}

let env: Awaited<ReturnType<typeof orchestrate>> = {} as any;
beforeAll(async () => {
	env = await orchestrate();
});

beforeEach(async () => {
	await Bun.sleep(500);

	setSystemTime();
	await env.emailSender.stopSending();

	await Promise.all([
		redis.client.flushAll(),
		mongo.collection.deleteMany({}),
		mq.channel.queueDelete("email_queue"),
	]);

	await mq.channel.queueDeclare("email_queue");
	await env.emailSender.startSending();

	await env.mailhog.delete("messages");
});

describe("/v1/weathers", () => {
	it("should be able to handle basic all fresh data", async () => {
		const queries = ["tokyo", "amsterdam", "beijing", "jakarta"];
		const result = await env.req.get("weathers", {
			searchParams: {
				locations: JSON.stringify(queries),
			},
		});
		const resultBody = await result.json<{ data: Required<WeatherData>[] }>();
		expect(result.status).toBe(200);
		expect(resultBody.data).toBeArrayOfSize(queries.length);

		await Bun.sleep(500);
		const receivedEmail = await env.mailhog.get("messages").json<any>();
		expect(receivedEmail).toBeArrayOfSize(1);
		const email = receivedEmail[0];

		for (const [index, city] of Object.entries([queries[0]])) {
			const weather = resultBody.data[Number(index)]!;
			const cityData = Cities[city as GlobalCity];
			const point = cityData.point;

			const [cache, storage] = await Promise.all([
				env.kv.weatherCache.get(WeatherRepository.serializePoint(point)),
				env.kv.weatherStorage.get(WeatherRepository.serializePoint(point)),
			]);

			expect(weather.location.latitude).toBeCloseTo(cityData.point.latitude, 1);
			expect(weather.location.longitude).toBeCloseTo(
				cityData.point.longitude,
				1,
			);
			expect(weather).toEqual(cache);
			expect(weather).toEqual(storage);
			expect(email.Content.Body).toContain(cityData.displayName);
		}
	});

	it("should be able to handle ETag cached request", async () => {
		const now = new Date();
		setSystemTime(now);

		const queries = [
			"tokyo",
			"amsterdam",
			"beijing",
			"jakarta",
		] as GlobalCity[];
		const etags = await Promise.all([
			env.repo.cache.cache(1, addSeconds(now, 300).getTime(), 300e3),
			env.repo.cache.cache(2, addSeconds(now, 300).getTime(), 300e3),
			env.repo.cache.cache(3, addSeconds(now, 300).getTime(), 300e3),
		]);

		const result = await env.req.get("weathers", {
			searchParams: {
				locations: JSON.stringify(queries),
			},
			headers: {
				"If-None-Match": `"${etags[1].etag}" "${etags[0].etag}"`,
			},
		});

		await Bun.sleep(500);

		const resultBody = await result.text();
		expect(result.status).toBe(304);
		expect(result.headers.get("Etag")).toBe(`"${etags[1].etag}"`);
		expect(result.headers.get("Cache-Control")).toBe(
			"max-age=300, stale-while-revalidate=60",
		);
		expect(resultBody).toBe("");
	});

	it("should return stale date early and renew data in background", async () => {
		const now = new Date();
		setSystemTime(now);

		const queries = ["new-york-city", "singapore", "seoul", "mexico-city"];
		const data = Array(queries.length).fill(
			dataWithTimestamp(subHours(now, 1)),
		);

		await env.repo.weather.setWeathers(
			queries.map((query) => Cities[query as GlobalCity].point),
			data,
		);

		const result = await env.req.get("weathers", {
			searchParams: {
				locations: JSON.stringify(queries),
			},
		});
		let resultBody = await result.json<{ data: Required<WeatherData>[] }>();
		expect(result.status).toBe(200);
		expect(resultBody.data).toBeArrayOfSize(queries.length);
		expect(resultBody.data).toEqual(data);

		await Bun.sleep(500);
		const receivedEmail = await env.mailhog.get("messages").json<any>();
		expect(receivedEmail).toBeArrayOfSize(1);
		const email = receivedEmail[0];

		const result2 = await env.req.get("weathers", {
			searchParams: {
				locations: JSON.stringify(queries),
			},
			headers: {
				"If-None-Match": result.headers.get("If-None-Match") ?? "",
			},
		});

		resultBody = await result2.json<{ data: Required<WeatherData>[] }>();
		expect(result.status).toBe(200);
		expect(resultBody.data).toBeArrayOfSize(queries.length);
		expect(resultBody.data).not.toEqual(data);

		for (const [index, city] of Object.entries(queries)) {
			const weather = resultBody.data[Number(index)];
			const cityData = Cities[city as GlobalCity];
			expect(weather?.receivedTimestamp).toBe(now.getTime());
			expect(email.Content.Body).toContain(cityData.displayName);
		}
	});

	it("should sync data renew and data return when there is hole in the persistence data", async () => {
		const now = new Date();
		setSystemTime(now);

		const queries = ["istanbul", "frankfurt", "brussels", "chicago"];
		const data = Array(queries.length).fill(
			dataWithTimestamp(addHours(now, 1)),
		);

		await env.repo.weather.setWeathers(
			queries.map((query) => Cities[query as GlobalCity].point).slice(0, -1),
			data.slice(0, -1),
		);

		const result = await env.req.get("weathers", {
			searchParams: {
				locations: JSON.stringify(queries),
			},
		});

		await Bun.sleep(500);

		const receivedEmail = await env.mailhog.get("messages").json<any>();
		expect(receivedEmail).toBeArrayOfSize(1);
		const email = receivedEmail[0];

		const resultBody = await result.json<{ data: Required<WeatherData>[] }>();
		expect(result.status).toBe(200);
		expect(resultBody.data).toBeArrayOfSize(queries.length);
		expect(resultBody.data.slice(0, -1)).toEqual(data.slice(0, -1));

		expect(resultBody.data.at(-1)?.receivedTimestamp).toBe(now.getTime());
		expect(email.Content.Body).toContain(
			Cities[queries.at(-1) as GlobalCity].displayName,
		);
	});
});
