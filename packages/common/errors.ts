export class HTTPError extends Error {
  name = "HTTPError";

  constructor(
    public status: number,
    public cause: string | Error,
  ) {
    const err = cause instanceof Error ? cause : new Error(cause);
    super(`Status(${status}): ${err.message}`);
  }
}

export class AsymmetricalError extends Error {
  name = "AsymmetricalError";

  private static regexpTruncater = /(.{50})(?:.*)/;

  constructor(
    public left: any,
    public right: any,
    public reason: string,
  ) {
    super(
      `Asymmetricality found between two values: ${reason}\n` +
        `First: ${left?.toString().replace(AsymmetricalError.regexpTruncater, "$1...")}\n` +
        `Second: ${right?.toString().replace(AsymmetricalError.regexpTruncater, "$1...")}`,
    );
  }
}
