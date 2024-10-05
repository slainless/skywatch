import { createAssertGuard, type AssertionGuard } from "typia";
import type { OpenMeteoResponse } from "../../provider/openmeteo/schema.js";

export const assertHttpResponse: AssertionGuard<OpenMeteoResponse[]> =
	createAssertGuard<OpenMeteoResponse[]>();
