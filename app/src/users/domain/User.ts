export class User {
	public id: string;
	public name: string;
	public count: number;

	constructor(
		data: { id: string, name: string, count?: number }
	) {
		this.id = data.id;
		this.name = data.name;
		this.count = data.count ?? 0;
	}
}
