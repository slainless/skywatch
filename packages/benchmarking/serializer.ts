import { run, bench, group } from "mitata";
import { deserialize, serialize } from "seroval";
import example from "./big_json/large-file.json" assert { type: "json" };
import { pack, unpack } from "msgpackr";
import { BSON } from "bson";
import { sia, desia } from "sializer";

group(() => {
	bench("E2E: seroval", () => deserialize(serialize(example)));
	bench("E2E: msgpackr", () => unpack(pack(example)));
	bench("E2E: JSON", () => JSON.parse(JSON.stringify(example)));
	bench("E2E: BSON", () => BSON.deserialize(BSON.serialize(example)));
	bench("E2E: sia", () => desia(sia(example)));
});

group(() => {
	bench("Serialize: seroval", () => serialize(example));
	bench("Serialize: msgpackr", () => pack(example));
	bench("Serialize: JSON", () => JSON.stringify(example));
	bench("Serialize: BSON", () => BSON.serialize(example));
	bench("Serialize: sia", () => sia(example));
});

group(() => {
	const serialized_seroval = serialize(example);
	const serialized_msgpackr = pack(example);
	const serialized_JSON = JSON.stringify(example);
	// const serialized_BSON = BSON.serialize(example);
	const serialized_sia = sia(example);

	bench("Deserialize: seroval", () => deserialize(serialized_seroval));
	bench("Deserialize: msgpackr", () => unpack(serialized_msgpackr));
	bench("Deserialize: JSON", () => JSON.parse(serialized_JSON));
	// bench("Deserialize: BSON", () => BSON.deserialize(serialized_BSON));
	bench("Deserialize: sia", () => desia(serialized_sia));
});

await run();
