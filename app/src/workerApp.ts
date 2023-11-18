import { EventBroker } from './Shared/Events/EventBroker';
import { Event } from './Shared/Events/Events/Event';
import { EventError } from './Shared/Events/Events/EventError';
import { EventReturn } from './Shared/Events/Events/EventReturn';

const instance = this as unknown as Worker;

export class WorkerApp extends EventBroker {
	constructor() {
		super();
		console.log('WORKER APP INITIALIZED');
	}

	processEvent(event: Event<any>): void {
		if (!(event instanceof Event)) {
			this.sendEvent(new EventError('post message is not a event type', undefined, event));
		}

		try {
			console.info('Event recived');
			this.sendEvent(event);
		} catch (error) {
			this.sendEvent(new EventError(event.method, { data: error }, event));
		}
	}

	sendEvent(event: Event | EventError | EventReturn): void {
		instance.postMessage(event);
	}
}

const app = new WorkerApp();
