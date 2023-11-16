import { EventBroker } from './EventBroker';
import { Event } from './Events/Event';
import { EventReturn } from './Events/EventReturn';
import { EventUpdate } from './Events/EventUpdate';

export abstract class EventRunner<returnData = any, params = {}> {
	constructor(
		private readonly broker: EventBroker
	) {}

	// eslint-disable-next-line no-use-before-define
	private observers: EventRunner[] = [];
	attach(observer: EventRunner): void {
		if (!this.observers.includes(observer)) this.observers.push(observer);
	}

	detach(observer: EventRunner): void {
		const index = this.observers.indexOf(observer);
		if (index !== -1) this.observers.splice(index, 1);
	}

	notify<P, D>(event: EventUpdate<P, D>): void {
		this.observers.forEach((observer) => observer.run(event));
	}

	public runEvent(event: Event<params>) {
		const returnData = this.run(event);
		this.broker.sendEvent(new EventReturn(event.eventName, { params: event.params, data: returnData }));
	}

    /** related events runners **/
    public abstract eventName: string;
    protected abstract run(event: Event<params> | EventUpdate): Promise<returnData>;
}
