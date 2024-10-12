import { afterEach, describe, expect, it, mock, test } from "bun:test";
import { EventService, WeatherEventHandler } from "./event";
import { MockEmailPusher } from "../test/helper";
import expected from "../test/example.expected.json";
import { Cities, GlobalCity } from "@skywatch/city-list";
import { format } from "../misc/email-formatter";

describe(EventService.name, () => {
	test("basic member/instance test", () => {
		const mockPusher = new MockEmailPusher();
		const service = new EventService(mockPusher);

		expect(service.weather()).toBeInstanceOf(WeatherEventHandler);
	});
});

const emailPusher = new MockEmailPusher();

afterEach(() => mock.restore());

describe(WeatherEventHandler.name, () => {
	it("should ignore event on zero length push target", async () => {
		const handler = new WeatherEventHandler(emailPusher);
		await handler.new([{ latitude: 0, longitude: 0 }], [expected] as any);
		expect(emailPusher.send).toBeCalledTimes(0);
	});

	it("should push email for all targets", async () => {
		const handler = new WeatherEventHandler(emailPusher);
		const targets = [
			["aiman@localhost.io", "Aiman Fauzy"],
			["hola@hello.io", "Cowsay: Moo"],
			["hello@world.com", "WHAT"],
		] satisfies [string, string][];
		const query = [
			Cities[GlobalCity.Dubai].point,
			Cities[GlobalCity.Tokyo].point,
			Cities[GlobalCity.Amsterdam].point,
		];
		const weather = [expected, expected, expected] as any;
		await handler.new(query, weather);

		for (const [email, name] of targets) handler.addPushTarget(email, name);
		await handler.new(query, weather);
		expect(emailPusher.send).toBeCalledTimes(3);
		expect(emailPusher.send.mock.calls).toEqual(
			targets.map(([email, name]) => [
				{
					to: email,
					subject: "🌦️ New weather just dropped!",
					html: format(name, query, weather),
				},
			]),
		);
	});
});
