export class InvalidEnvError extends TypeError {
  name = InvalidEnvError.name;

  constructor(key: string, named: { name: string } | string, value: any) {
    super(
      `Expecting ${key} to be of type ${typeof named === "string" ? named : named.name}, instead got: ${value}`,
    );
  }
}

export namespace Env {
  export function boolean(envKey: string, defaults: boolean) {
    const env = process.env[envKey];

    if (env === "" || env == null) return defaults;
    if (typeof env === "boolean") return env;
    switch (env.toLowerCase()) {
      case "true":
      case "yes":
      case "y":
      case "1":
      case "✅":
      case "👍":
        return true;
      case "false":
      case "no":
      case "n":
      case "0":
      case "❎":
      case "👎":
        return false;
      default:
        throw new InvalidEnvError(envKey, Boolean, env);
    }
  }

  export function number(envKey: string, defaults: number) {
    const env = process.env[envKey];

    if (env === "" || env == null) return defaults;
    if (typeof env === "number") return env;
    const value = Number(env);
    if (Number.isNaN(value) || Number.isFinite(value) === false)
      throw new InvalidEnvError(envKey, Number, value);
    return value;
  }

  export function positiveInt(envKey: string, defaults: number) {
    if (Number.isInteger(defaults) === false)
      throw new TypeError("Defaults should be an integer!");

    const n = number(envKey, defaults);
    if (Number.isInteger(n) === false)
      throw new InvalidEnvError(envKey, "PositiveInteger", n);
    return n;
  }

  export function positiveFloat(envKey: string, defaults: number) {
    if (Number.isInteger(defaults))
      throw new TypeError("Defaults should be a float!");

    const n = number(envKey, defaults);
    if (Number.isInteger(n))
      throw new InvalidEnvError(envKey, "PositiveFloat", n);
    return n;
  }

  export function string(envKey: string, defaults: string) {
    const env = process.env[envKey];

    if (env === "" || env == null) return defaults;
    return env;
  }
}
