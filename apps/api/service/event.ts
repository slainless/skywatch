import { Backend, Decorators, type Point3D } from "@deweazer/common";
import type { EmailPusher } from "@deweazer/email";
import type { WeatherData } from "@deweazer/weather";
import { format } from "../misc/email-formatter";

export class EventService extends Backend.Component {
	private weatherHandler: WeatherEventHandler;
	constructor(emailPusher: EmailPusher) {
		super();
		this.weatherHandler = new WeatherEventHandler(emailPusher);
	}

	weather() {
		return this.weatherHandler;
	}
}

export class WeatherEventHandler extends Backend.Component {
	emailPushTargets: Set<string> = new Set();

	constructor(private emailPusher: EmailPusher) {
		super();
	}

	// for now, only pushing email notification
	async new(
		query: Point3D[],
		weathers: Required<WeatherData>[],
	): Promise<void> {
		if (this.emailPushTargets.size < 1) return;
		return void Promise.all(
			this.emailPushTargets.values().map((target) => {
				const [email, name] = JSON.parse(target);
				return this.emailPusher.send({
					to: email,
					subject: "🌦️ New weather just dropped!",
					html: format(name, query, weathers),
				});
			}),
		);
	}

	addPushTarget(email: string, name: string) {
		this.emailPushTargets.add(JSON.stringify([email, name]));
	}

	removePushTarget(email: string, name: string) {
		this.emailPushTargets.delete(JSON.stringify([email, name]));
	}
}
