import { EventBroker } from './Shared/Events/EventBroker';
import { Event } from './Shared/Events/Events/Event';
import { EventError } from './Shared/Events/Events/EventError';
import { EventReturn } from './Shared/Events/Events/EventReturn';

const instance = this as unknown as Worker;

export class WorkerApp extends EventBroker {
	constructor() {
		super();
		console.log('WORKER APP INITIALIZED');
		instance.onmessage = this.processEvent
	}

	processEvent(msgEvent: MessageEvent<any>): void {
		const { data } = msgEvent;

		if (!(data instanceof Event)) {
			this.sendEvent(new EventError(new Event(''), 'post message is not a event type', data));
			return;
		}

		try {
			console.info('Event recived');
			this.sendEvent(data);
		} catch (error) {
			this.sendEvent(new EventError(data, data.method, { data: error }));
		}
	}

	sendEvent(event: Event | EventError | EventReturn): void {
		instance.postMessage(event);
	}
}

const app = new WorkerApp();
