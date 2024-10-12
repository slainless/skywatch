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

export class AsymmetricalError extends Error {
	name = "AsymmetricalError";

	constructor(
		public left: any,
		public right: any,
		public reason: string,
	) {
		super(
			`Asymmetrical found between ${JSON.stringify(left)} and ${JSON.stringify(right)}:\n${reason}`,
		);
	}
}
