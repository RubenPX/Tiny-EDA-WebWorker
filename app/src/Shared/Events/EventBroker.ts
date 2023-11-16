import { Event } from './Events/Event';
import { EventRunner } from './EventRunner';
import { EventReturn } from './Events/EventReturn';

export abstract class EventBroker {
	constructor(
        private eventRoutes: EventRunner<unknown>[]
	) {}

	public publishEvent(event: Event<any>): boolean {
		const filteredEvent = this.eventRoutes.find(v => v.eventName === event.eventName);
		if (filteredEvent) {
			filteredEvent.runEvent(event);
			return true;
		}
		return false;
	}

	abstract processEvent(event: Event<any>): void;
	abstract sendEvent(event: EventReturn<any>): void;
}
