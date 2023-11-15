import { Event } from './Event';

export abstract class EventRunner<params> {
	// eslint-disable-next-line no-use-before-define
	private observers: EventRunner<any>[] = [];
	attach(observer: EventRunner<any>): void {
		if (!this.observers.includes(observer)) this.observers.push(observer);
	}

	detach(observer: EventRunner<any>): void {
		const index = this.observers.indexOf(observer);
		if (index !== -1) this.observers.splice(index, 1);
	}

	notify(event: Event<params>): void {
		this.observers.forEach((observer) => observer.update(event));
	}

    /** related events runners **/
    public abstract EventName: string;
    public abstract update(event: Event<params>): Promise<void>;
    public abstract runEvent(event: Event<params>): Promise<void>;
}
