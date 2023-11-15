export class EventError extends Error {
	constructor(message: string, public readonly data: any) {
		super(message);
	}
}
