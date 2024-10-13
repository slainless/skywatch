import { describe, expect, it } from "bun:test";
import { MessagePackSerializer } from "./msgpackr.js";
import example from "./test/example.expected.json" assert { type: "json" };

describe(`${MessagePackSerializer.name} e2e`, () => {
  const packer = new MessagePackSerializer();
  const e2e = (value: any) => packer.deserialize(packer.serialize(value));

  it("should correctly serialize primitive value", () => {
    expect(e2e("Hola")).toBe("Hola");
    expect(e2e(999999999999)).toBe(999999999999);
    expect(e2e(BigInt(22222))).toBe(BigInt(22222));
    expect(e2e(null)).toBe(null);
    expect(e2e(undefined)).toBe(undefined);
  });

  it("should correctly serialize complex value", () => {
    expect(e2e({})).toEqual({});
    expect(e2e([])).toEqual([]);

    const object = {
      number: [
        Math.random(),
        0,
        Number.NaN,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ],
      string: ["hello world", "<script>Hello World</script>"],
      boolean: [true, false],
      null: null,
      undefined: undefined,
      bigint: 9007199254740991n,
      date: new Date(),
    };
    expect(e2e(object)).toEqual(object);
  });

  it("should correctly serialize big JSON value", () => {
    expect(e2e(example)).toEqual(example);
  });
});
