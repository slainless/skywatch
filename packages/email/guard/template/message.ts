import type { SendMailOptions } from "nodemailer";
import { type AssertionGuard, createAssertGuard } from "typia";

export const assertMail: AssertionGuard<SendMailOptions> =
  createAssertGuard<SendMailOptions>();
