import { Event } from './Event';

export class EventError extends Error {
	constructor(message: string, public readonly data: any, public readonly event: Event<any, any>) {
		super(message);
	}
}
