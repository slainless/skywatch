export enum GlobalCity {
	London = "london",
	NewYorkCity = "new-york-city",
	Beijing = "beijing",
	Dubai = "dubai",
	HongKong = "hong-kong",
	Paris = "paris",
	Shanghai = "shanghai",
	Singapore = "singapore",
	Tokyo = "tokyo",
	Amsterdam = "amsterdam",
	Brussels = "brussels",
	Chicago = "chicago",
	Frankfurt = "frankfurt",
	Istanbul = "istanbul",
	Jakarta = "jakarta",
	KualaLumpur = "kuala-lumpur",
	LosAngeles = "los-angeles",
	LuxembourgCity = "luxembourg-city",
	Madrid = "madrid",
	MexicoCity = "mexico-city",
	Milan = "milan",
	Mumbai = "mumbai",
	SaoPaulo = "sao-paulo",
	Seoul = "seoul",
	Sydney = "sydney",
	Toronto = "toronto",
	Warsaw = "warsaw",
}

export namespace GlobalCity {
	const values = new Set(Object.values(GlobalCity)) as Set<GlobalCity>;

	export function from(code: string): GlobalCity | null {
		if (values.has(code as any)) return code as any;
		return null;
	}
}
