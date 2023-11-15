import { Event } from './Event';
import { EventRunner } from './EventRunner';

export abstract class EventBroker {
	constructor(
        private eventRoutes: EventRunner<unknown>[]
	) {}

	public publishEvent<T>(event: Event<T>): boolean {
		const filteredEvent = this.eventRoutes.find(v => v.EventName === event.EventName);
		if (filteredEvent) {
			filteredEvent.runEvent(event);
			return true;
		}
		return false;
	}

	abstract processEvent(event: Event<any>): void;
	abstract sendEvent(event: Event<any>): void;
}
