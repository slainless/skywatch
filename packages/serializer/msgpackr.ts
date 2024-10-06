import type { Serializer } from "../persistence/index.js";
import { pack, unpack } from "msgpackr";

export class MessagePackSerializer implements Serializer {
	serialize(value: any): Buffer {
		return pack(value);
	}

	deserialize(value: Buffer): any {
		return unpack(value);
	}
}
