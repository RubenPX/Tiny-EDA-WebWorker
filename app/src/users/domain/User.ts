export class User {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly count: number = 0
	) {}
}
