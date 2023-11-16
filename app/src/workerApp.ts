import { EventBroker } from './Shared/Events/EventBroker';
import { EventRunner } from './Shared/Events/EventRunner';
import { Event } from './Shared/Events/Events/Event';
import { EventError } from './Shared/Events/Events/EventError';
import { EventReturn } from './Shared/Events/Events/EventReturn';

const instance = this as unknown as Worker;

export class WorkerApp extends EventBroker {
	constructor(eventRoutes: EventRunner[]) {
		super(eventRoutes);
		console.log('WORKER APP INITIALIZED');
	}

	processEvent(event: Event<any>): void {
		if (!(event instanceof Event)) {
			this.sendEvent(new EventError('post message is not a event type', event));
		}

		try {
			console.info('Event recived');
			this.publishEvent(event);
		} catch (error) {
			this.sendEvent(new EventError(event.eventName, { data: error }));
		}
	}

	sendEvent(event: Event | EventError | EventReturn): void {
		instance.postMessage(event);
	}
}

const app = new WorkerApp([]);
