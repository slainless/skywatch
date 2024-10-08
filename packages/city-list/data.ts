import type { Point3D } from "@deweazer/common";
import { GlobalCity } from "./enum";

const point = (latitude: number, longitude: number): Point3D => ({
	latitude,
	longitude,
});

const data = (ISO3166Alpha2: string, tz: string, point: Point3D) => ({
	point,
	tz,
	code: ISO3166Alpha2,
});

// biome-ignore format: table view
export const cities = {
	// city										   | alpha-2  | timezone             | latitude, longitude
	[GlobalCity.London]:         data("GB", "Europe/London",       point(51.507222, -0.1275)),
	[GlobalCity.NewYorkCity]:    data("US", "America/New_York",    point(40.712776, -74.005974)),
	[GlobalCity.Beijing]:        data("CN", "Asia/Shanghai",       point(39.9042, 116.4074)),
	[GlobalCity.Dubai]:          data("AE", "Asia/Dubai",          point(25.276987, 55.296249)),
	[GlobalCity.HongKong]:       data("HK", "Asia/Hong_Kong",      point(22.3193, 114.1694)),
	[GlobalCity.Paris]:          data("FR", "Europe/Paris",        point(48.8566, 2.3522)),
	[GlobalCity.Shanghai]:       data("CN", "Asia/Shanghai",       point(31.2304, 121.4737)),
	[GlobalCity.Singapore]:      data("SG", "Asia/Singapore",      point(1.3521, 103.8198)),
	[GlobalCity.Tokyo]:          data("JP", "Asia/Tokyo",          point(35.682839, 139.759455)),
	[GlobalCity.Amsterdam]:      data("NL", "Europe/Amsterdam",    point(52.3676, 4.9041)),
	[GlobalCity.Brussels]:       data("BE", "Europe/Brussels",     point(50.8503, 4.3517)),
	[GlobalCity.Chicago]:        data("US", "America/Chicago",     point(41.8781, -87.6298)),
	[GlobalCity.Frankfurt]:      data("DE", "Europe/Berlin",       point(50.1109, 8.6821)),
	[GlobalCity.Istanbul]:       data("TR", "Europe/Istanbul",     point(41.0082, 28.9784)),
	[GlobalCity.Jakarta]:        data("ID", "Asia/Jakarta",        point(-6.2088, 106.8456)),
	[GlobalCity.KualaLumpur]:    data("MY", "Asia/Kuala_Lumpur",   point(3.1390, 101.6869)),
	[GlobalCity.LosAngeles]:     data("US", "America/Los_Angeles", point(34.0522, -118.2437)),
	[GlobalCity.LuxembourgCity]: data("LU", "Europe/Luxembourg",   point(49.6117, 6.13)),
	[GlobalCity.Madrid]:         data("ES", "Europe/Madrid",       point(40.4168, -3.7038)),
	[GlobalCity.MexicoCity]:     data("MX", "America/Mexico_City", point(19.4326, -99.1332)),
	[GlobalCity.Milan]:          data("IT", "Europe/Rome",         point(45.4642, 9.19)),
	[GlobalCity.Mumbai]:         data("IN", "Asia/Kolkata",        point(19.0760, 72.8777)),
	[GlobalCity.SaoPaulo]:       data("BR", "America/Sao_Paulo",   point(-23.5505, -46.6333)),
	[GlobalCity.Seoul]:          data("KR", "Asia/Seoul",          point(37.5665, 126.978)),
	[GlobalCity.Sydney]:         data("AU", "Australia/Sydney",    point(-33.8688, 151.2093)),
	[GlobalCity.Toronto]:        data("CA", "America/Toronto",     point(43.65107, -79.347015)),
	[GlobalCity.Warsaw]:         data("PL", "Europe/Warsaw",       point(52.2297, 21.0122)),
};
