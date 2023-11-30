export class EventRouteError extends Error {
	public typeError = 'EventRouteError';
	constructor(public name: string) {
		super(name);
	}
}
