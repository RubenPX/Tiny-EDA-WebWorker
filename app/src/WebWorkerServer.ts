import { EventBroker } from './Shared/Events/EventBroker';
import { Event } from './Shared/Events/Events/Event';
import { EventError } from './Shared/Events/Events/EventError';
import { EventReturn } from './Shared/Events/Events/EventReturn';
import { events, repositories } from './dependencies';

const instance = this as unknown as Worker;

export class WorkerApp extends EventBroker {
	private repos: ReturnType<typeof repositories> | undefined = undefined;
	private useCases: ReturnType<typeof events> | undefined = undefined;

	private constructor() {
		super();
		instance.onmessage = this.processEvent
	}

	public static async initialize(callback: (app: WorkerApp) => void) {
		let app = new WorkerApp();
		app.repos = await repositories();
		app.useCases = await events(app, app.repos);
		console.log('WORKER APP INITIALIZED');
		callback(app);
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

instance.postMessage({ initialized: false, message: "initializing worker..." });
WorkerApp.initialize(() => {
	console.log("Worker fully initialized");
	instance.postMessage({ initialized: true, message: "App initialized" });
})
