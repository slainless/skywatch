import { Backend, type Point3D } from "@skywatch/common";
import type { EmailPusher } from "@skywatch/email";
import type { WeatherData } from "@skywatch/weather";
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
	private emailPushTargets: Map<string, string> = new Map();

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
			// TODO: change to use iterator helper when this fixed:
			// https://github.com/oven-sh/bun/issues/14426
			// https://bugs.webkit.org/show_bug.cgi?id=280811
			Array.from(this.emailPushTargets.entries()).map(([email, name]) => {
				return this.emailPusher.send({
					to: email,
					subject: "🌦️ New weather just dropped!",
					html: format(name, query, weathers),
				});
			}),
		);
	}

	addPushTarget(email: string, name: string) {
		this.emailPushTargets.set(email, name);
	}

	removePushTarget(email: string) {
		this.emailPushTargets.delete(email);
	}
}
