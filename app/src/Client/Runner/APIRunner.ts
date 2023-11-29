import { ApiBuilder } from '../Builder/APIBuilder';

export class ApiRunner {
	private builder: ApiBuilder;

	constructor(builder: ApiBuilder) {
		this.builder = builder;
	}

	observe(callback: (data: any) => void) {
		// Implement observer logic here
	}

	async getData(): Promise<any> {
		// Implement data retrieval logic here
		return {};
	}
}
