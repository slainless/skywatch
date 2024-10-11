import type { Point3D } from "@deweazer/common";
import { GlobalCity } from "./enum";

const point = (latitude: number, longitude: number): Point3D => ({
	latitude,
	longitude,
});

const data = (
	displayName: string,
	ISO3166Alpha2: string,
	tz: string,
	point: Point3D,
) => ({
	displayName,
	point,
	tz,
	code: ISO3166Alpha2,
});

// biome-ignore format: table view
export const Cities = {
	// city                                              | alpha-2  | timezone             | latitude, longitude
	[GlobalCity.London]:         data("London",          "GB", "Europe/London",       point(51.507222, -0.1275)),
	[GlobalCity.NewYorkCity]:    data("New York City",   "US", "America/New_York",    point(40.712776, -74.005974)),
	[GlobalCity.Beijing]:        data("Beijing",         "CN", "Asia/Shanghai",       point(39.9042, 116.4074)),
	[GlobalCity.Dubai]:          data("Dubai",           "AE", "Asia/Dubai",          point(25.276987, 55.296249)),
	[GlobalCity.HongKong]:       data("Hong Kong",       "HK", "Asia/Hong_Kong",      point(22.3193, 114.1694)),
	[GlobalCity.Paris]:          data("Paris",           "FR", "Europe/Paris",        point(48.8566, 2.3522)),
	[GlobalCity.Shanghai]:       data("Shanghai",        "CN", "Asia/Shanghai",       point(31.2304, 121.4737)),
	[GlobalCity.Singapore]:      data("Singapore",       "SG", "Asia/Singapore",      point(1.3521, 103.8198)),
	[GlobalCity.Tokyo]:          data("Tokyo",           "JP", "Asia/Tokyo",          point(35.682839, 139.759455)),
	[GlobalCity.Amsterdam]:      data("Amsterdam",       "NL", "Europe/Amsterdam",    point(52.3676, 4.9041)),
	[GlobalCity.Brussels]:       data("Brussels",        "BE", "Europe/Brussels",     point(50.8503, 4.3517)),
	[GlobalCity.Chicago]:        data("Chicago",         "US", "America/Chicago",     point(41.8781, -87.6298)),
	[GlobalCity.Frankfurt]:      data("Frankfurt",       "DE", "Europe/Berlin",       point(50.1109, 8.6821)),
	[GlobalCity.Istanbul]:       data("Istanbul",        "TR", "Europe/Istanbul",     point(41.0082, 28.9784)),
	[GlobalCity.Jakarta]:        data("Jakarta",         "ID", "Asia/Jakarta",        point(-6.2088, 106.8456)),
	[GlobalCity.KualaLumpur]:    data("Kuala Lumpur",    "MY", "Asia/Kuala_Lumpur",   point(3.1390, 101.6869)),
	[GlobalCity.LosAngeles]:     data("Los Angeles",     "US", "America/Los_Angeles", point(34.0522, -118.2437)),
	[GlobalCity.LuxembourgCity]: data("Luxembourg City", "LU", "Europe/Luxembourg",   point(49.6117, 6.13)),
	[GlobalCity.Madrid]:         data("Madrid",          "ES", "Europe/Madrid",       point(40.4168, -3.7038)),
	[GlobalCity.MexicoCity]:     data("Mexico City",     "MX", "America/Mexico_City", point(19.4326, -99.1332)),
	[GlobalCity.Milan]:          data("Milan",           "IT", "Europe/Rome",         point(45.4642, 9.19)),
	[GlobalCity.Mumbai]:         data("Mumbai",          "IN", "Asia/Kolkata",        point(19.0760, 72.8777)),
	[GlobalCity.SaoPaulo]:       data("São Paulo",       "BR", "America/Sao_Paulo",   point(-23.5505, -46.6333)),
	[GlobalCity.Seoul]:          data("Seoul",           "KR", "Asia/Seoul",          point(37.5665, 126.978)),
	[GlobalCity.Sydney]:         data("Sydney",          "AU", "Australia/Sydney",    point(-33.8688, 151.2093)),
	[GlobalCity.Toronto]:        data("Toronto",         "CA", "America/Toronto",     point(43.65107, -79.347015)),
	[GlobalCity.Warsaw]:         data("Warsaw",          "PL", "Europe/Warsaw",       point(52.2297, 21.0122)),
};

function serializePoint(latitude: number, longitude: number) {
	return `${latitude},${longitude}`;
}

const pointToCityMap = {
	[serializePoint(51.507222, -0.1275)]: GlobalCity.London,
	[serializePoint(40.712776, -74.005974)]: GlobalCity.NewYorkCity,
	[serializePoint(39.9042, 116.4074)]: GlobalCity.Beijing,
	[serializePoint(25.276987, 55.296249)]: GlobalCity.Dubai,
	[serializePoint(22.3193, 114.1694)]: GlobalCity.HongKong,
	[serializePoint(48.8566, 2.3522)]: GlobalCity.Paris,
	[serializePoint(31.2304, 121.4737)]: GlobalCity.Shanghai,
	[serializePoint(1.3521, 103.8198)]: GlobalCity.Singapore,
	[serializePoint(35.682839, 139.759455)]: GlobalCity.Tokyo,
	[serializePoint(52.3676, 4.9041)]: GlobalCity.Amsterdam,
	[serializePoint(50.8503, 4.3517)]: GlobalCity.Brussels,
	[serializePoint(41.8781, -87.6298)]: GlobalCity.Chicago,
	[serializePoint(50.1109, 8.6821)]: GlobalCity.Frankfurt,
	[serializePoint(41.0082, 28.9784)]: GlobalCity.Istanbul,
	[serializePoint(-6.2088, 106.8456)]: GlobalCity.Jakarta,
	[serializePoint(3.139, 101.6869)]: GlobalCity.KualaLumpur,
	[serializePoint(34.0522, -118.2437)]: GlobalCity.LosAngeles,
	[serializePoint(49.6117, 6.13)]: GlobalCity.LuxembourgCity,
	[serializePoint(40.4168, -3.7038)]: GlobalCity.Madrid,
	[serializePoint(19.4326, -99.1332)]: GlobalCity.MexicoCity,
	[serializePoint(45.4642, 9.19)]: GlobalCity.Milan,
	[serializePoint(19.076, 72.8777)]: GlobalCity.Mumbai,
	[serializePoint(-23.5505, -46.6333)]: GlobalCity.SaoPaulo,
	[serializePoint(37.5665, 126.978)]: GlobalCity.Seoul,
	[serializePoint(-33.8688, 151.2093)]: GlobalCity.Sydney,
	[serializePoint(43.65107, -79.347015)]: GlobalCity.Toronto,
	[serializePoint(52.2297, 21.0122)]: GlobalCity.Warsaw,
};

export function pointToCity(latitude: number, longitude: number) {
	return pointToCityMap[serializePoint(latitude, longitude)];
}
