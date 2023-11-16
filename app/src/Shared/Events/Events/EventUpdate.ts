import { v4 } from 'uuid';
import { Event } from './Event';

export class EventUpdate<P = unknown, D = unknown> implements Event<P, D> {
	public readonly id: string = v4();

	public readonly eventName: string;
	public readonly params?: P;
	public readonly data?: D;

	constructor(eventName: string, eventData?: {params?: P | undefined, data?: D}) {
		this.eventName = eventName;
		this.params = eventData?.params;
		this.data = eventData?.data;
	}
}
