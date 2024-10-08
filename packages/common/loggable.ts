import type { Logger } from "pino";

export interface Loggable {
	setLogger(logger: Logger): this;
}
