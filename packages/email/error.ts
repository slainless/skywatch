import type { TypeGuardError } from "typia";

export class EmailFormatError extends Error {
	constructor(public reason: TypeGuardError) {
		super(`Mismatching weather API response against schema\n${reason.message}`);
	}
}
