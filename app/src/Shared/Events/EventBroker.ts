import { userRepository } from '../../users/domain/userRepository';
import { EventRunner } from './EventRunner';
import { Event } from './Events/Event';
import { EventError } from './Events/EventError';
import { EventReturn } from './Events/EventReturn';

type eventCallback<P = undefined> = (event: Event<P>) => void
type errEventCallback = (event: EventError) => void

export class EventBroker {
	/** EVENT LISTENERS **/
	private eventHandlers: { [method: string]: { id: string, success: eventCallback<any>, error?: errEventCallback }[] } = {};

	subscribe<P, D>(eventRunner: EventRunner<D, P>, id: string, clbk: eventCallback<P>, clbkErr?: errEventCallback): void {
		const foundMethod = this.eventHandlers[eventRunner.runnerMethod];
		if (!foundMethod) this.eventHandlers[eventRunner.runnerMethod] = [];
		const foundIndex = this.eventHandlers[eventRunner.runnerMethod].findIndex(cl => cl.id === id);

		if (foundIndex !== -1) {
			this.eventHandlers[eventRunner.runnerMethod].push({ id, success: clbk, error: clbkErr });
		} else {
			console.info('Replaced callback with id: ' + id);
			this.eventHandlers[eventRunner.runnerMethod][foundIndex] = { id, success: clbk, error: clbkErr };
		}
	}

	unsubscribe(eventRunner: EventRunner, id: string): void {
		const handlers = this.eventHandlers[eventRunner.runnerMethod];
		if (handlers) {
			const foundIndex = handlers.findIndex(h => h.id === id);
			if (foundIndex !== -1) handlers.splice(foundIndex, 1);
		}
	}

	publish(event: Event | EventReturn | EventError): void {
		if (event instanceof EventError) {
			const handlers = this.eventHandlers[event.event.method];
			if (handlers) handlers.forEach((clbk) => { if (clbk.error) clbk.error(event); });
		} else {
			const handlers = this.eventHandlers[event.method];
			if (handlers) handlers.forEach((clbk) => clbk.success(event));
		}
	}
}
