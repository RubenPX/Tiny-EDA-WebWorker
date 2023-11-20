import { Event } from './Event';

export class EventError extends Error {
	constructor(public readonly event: Event, message: string, public readonly data: any = undefined) {
		super(message);
	}
}
