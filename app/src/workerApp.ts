import { Event } from './Shared/Events/Event';
import { EventBroker } from './Shared/Events/EventBroker';
import { EventError } from './Shared/Events/EventError';
import { EventRunner } from './Shared/Events/EventRunner';

const instance = this as unknown as Worker;

export class WorkerApp extends EventBroker {
	constructor(eventRoutes: EventRunner<unknown>[]) {
		super(eventRoutes);
		console.log('WORKER APP INITIALIZED');
	}

	processEvent(event: Event<unknown>): void {
		if (!(event instanceof Event)) {
			this.sendEvent(new Event('', { data: new EventError('post message is not a event type', event) }));
		}

		try {
			console.info('Event recived');
			this.publishEvent(event);
		} catch (error) {
			this.sendEvent(new Event(event.EventName, { data: error }));
		}
	}

	sendEvent(event: Event<any>): void {
		instance.postMessage(event);
	}
}

const app = new WorkerApp([]);
