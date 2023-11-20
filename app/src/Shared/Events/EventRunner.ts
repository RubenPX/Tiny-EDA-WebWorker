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
				if (event instanceof EventReturn) {
					this.postRunEvent && this.postRunEvent(event);
				} else {
					const processedData = this.runEvent(event);
					this.eventBroker.publish(new EventReturn(this.runnerMethod, { data: processedData, params: event.params }));
				}
			} catch (error) {
				if (error instanceof EventError) this.eventBroker.publish(error);

				console.error('Uncontrolled error', error);
				this.eventBroker.publish(new EventError(new Event(''), 'Uncontrolled error', error));
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

	/**
	 * Este metodo se ejecuta cada vez que se intercepta un evento nuevo
	 * @param event Evento consumido
	 */
	protected abstract runEvent(event: Event<runnerParams>): Promise<returnData>;

	/**
	 * Este metodo se ejecuta cada vez que un evento de retorno es interceptado
	 * @param event Evento de retorno
	 */
	protected postRunEvent?(event: EventReturn<runnerParams>): void;
}
