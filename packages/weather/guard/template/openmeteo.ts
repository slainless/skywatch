import { type AssertionGuard, createAssertGuard } from "typia";
import type { OpenMeteoResponse } from "../../provider/openmeteo/schema.js";

export const assertHttpResponse: AssertionGuard<OpenMeteoResponse[]> =
  createAssertGuard<OpenMeteoResponse[]>();
