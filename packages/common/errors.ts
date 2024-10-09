export class HTTPError extends Error {
	name = "HTTPError";

	constructor(
		public status: number,
		error: string | Error,
	) {
		const err = error instanceof Error ? error : new Error(error);
		super(`Status(${status}): ${err.message}`);
	}
}
