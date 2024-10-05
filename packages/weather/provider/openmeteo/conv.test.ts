import { describe, expect, it } from "vitest";
import { mapCurrentSample, mapDailySample, mapHourlySample } from "./conv.js";
import exampleResponse from "./example.response.json" assert { type: "json" };
import exampleExpected from "./example.expected.json" assert { type: "json" };

describe(mapCurrentSample.name, () => {
	it("should correctly convert from openmeteo format to SamplesWithUnit.Current", () => {
		expect(mapCurrentSample(exampleResponse)).toEqual(exampleExpected.current);
	});
});

describe(mapHourlySample.name, () => {
	it("should correctly convert from openmeteo format to SamplesWithUnit.Hourly", () => {
		expect(mapHourlySample(exampleResponse)).toEqual(exampleExpected.hourly);
	});
});

describe(mapDailySample.name, () => {
	it("should correctly convert from openmeteo format to SamplesWithUnit.Daily", () => {
		expect(mapDailySample(exampleResponse)).toEqual(exampleExpected.daily);
	});
});
