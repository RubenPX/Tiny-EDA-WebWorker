export class ApiBuilder {
	private filter: { [key: string]: (objeto: any) => boolean } = {};
	private sorters: ((a: any, b: any) => number) | null = null;
	private params: { [key: string]: any };

	constructor(endpoint: string, params: { [key: string]: any }) {
		this.params = params;
		this.params.endpoint = endpoint;
	}

	setFilter(filterName: string, filterFunction: (objeto: any) => boolean) {
		this.filter[filterName] = filterFunction;
	}

	sort(sortFunction: (a: any, b: any) => number) {
		this.sorters = sortFunction;
	}

	build(): { [key: string]: any } {
		return {
			endpoint     : this.params.endpoint,
			filter       : this.filter,
			sortFunction : this.sorters
		};
	}
}
