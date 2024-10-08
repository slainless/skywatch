import type { Persistence } from "@deweazer/persistence";
import { Backend } from "@deweazer/common";

export class WeatherRepository extends Backend.Component {
	constructor(private persistence: Persistence) {
		super();
	}
}
