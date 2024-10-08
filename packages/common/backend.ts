import type { Logger } from "pino";
import type { Loggable } from "./loggable";

export namespace Backend {
	export abstract class Component implements Loggable {
		protected logger?: Logger;

		setLogger(logger: Logger) {
			const name = this.getConstructorName();
			if (name)
				this.logger = logger.child({
					class: this.getConstructorName(),
				});
			else this.logger = logger;
			return this;
		}

		private getConstructorName() {
			const prototype = Object.getPrototypeOf(this);
			return prototype?.constructor?.name;
		}
	}
}
