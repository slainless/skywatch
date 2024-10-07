import type { SendMailOptions } from "nodemailer";
import { createAssertGuard, type AssertionGuard } from "typia";

export const assertMail: AssertionGuard<SendMailOptions> =
	createAssertGuard<SendMailOptions>();
