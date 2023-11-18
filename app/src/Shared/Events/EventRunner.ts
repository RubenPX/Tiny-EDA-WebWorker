import { EventBroker } from './EventBroker';
import { Event } from './Events/Event';
import { EventError } from './Events/EventError';
import { EventReturn } from './Events/EventReturn';

export abstract class EventRunner<returnData = undefined, runnerParams = undefined> {
	private events: { [idEvent: string]: (data: returnData) => void } = {};
	public readonly abstract runnerMethod: string;

	constructor(private eventBroker: EventBroker) {
		this.initialize();
	}

	private initialize() {
		this.eventBroker.subscribe(this, this.runnerMethod, (event) => {
			try {
				const processedData = this.runEvent(event);
				this.eventBroker.publish(new EventReturn(this.runnerMethod, { data: processedData, params: event.params }));
			} catch (error) {
				if (error instanceof EventError) {
					this.eventBroker.publish(error);
				}

				console.error('Uncontrolled error', error);
				this.eventBroker.publish(new EventError('Uncontrolled error', error, new Event('')));
			}
		});
	}

	/**
	 * Listen to specified event
	 * @param idEvent event id (if exists it will be replaced)
	 * @param callback callback that returns data
	 * @param params If specified, the event will be executed immediately with params
	 */
	on(idEvent: string, callback: (data: returnData) => void) {
		const foundEvent = this.events[idEvent] as ((data: returnData) => void) | undefined;
		if (foundEvent) console.log('Replaced event with id: ' + idEvent);
		this.events[idEvent] = callback;
	}

	protected abstract runEvent(event: Event<runnerParams>): Promise<returnData>;
}
