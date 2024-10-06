import type { Serializer } from "./index.js";
import { pack, unpack } from "msgpackr";

export class MessagePackSerializer implements Serializer {
	static serializer = new MessagePackSerializer();

	serialize(value: any): Buffer {
		return pack(value);
	}

	deserialize(value: Buffer): any {
		return unpack(value);
	}
}
