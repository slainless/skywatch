import { describe, expect, it } from "bun:test";
import { mapCurrentSample, mapDailySample, mapHourlySample } from "./conv.js";
import exampleExpected from "./example.expected.json" assert { type: "json" };
import exampleResponse from "./example.response.json" assert { type: "json" };

describe(mapCurrentSample.name, () => {
	it("should correctly convert from openmeteo format to SamplesWithUnit.Current", () => {
		expect(mapCurrentSample(exampleResponse)).toEqual(
			exampleExpected.current as any,
		);
	});
});

describe(mapHourlySample.name, () => {
	it("should correctly convert from openmeteo format to SamplesWithUnit.Hourly", () => {
		expect(mapHourlySample(exampleResponse)).toEqual(
			exampleExpected.hourly as any,
		);
	});
});

describe(mapDailySample.name, () => {
	it("should correctly convert from openmeteo format to SamplesWithUnit.Daily", () => {
		expect(mapDailySample(exampleResponse)).toEqual(
			exampleExpected.daily as any,
		);
	});
});
