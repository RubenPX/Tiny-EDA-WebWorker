import { ConsoleColors, ConsolePrefix } from '../ConsoleColors';
import { EventMessage } from './EventMessage';
import { EventRouteError } from './EventRouteError';

type eventRoute = { context: string, method: string, callback: ((message: EventMessage) => EventMessage | any)[] };

export abstract class AppMain {
	public eventRoutes: eventRoute[] = [];
	public abstract readonly mode: 'client' | 'server';

	public onEvent(data: { context: string, method: string }, callback: eventRoute['callback'][number]) {
		const foundRoute = this.eventRoutes.find(rt => rt.context === data.context && rt.method === data.method);
		if (foundRoute != null) {
			foundRoute.callback.push(callback);
		} else {
			this.eventRoutes.push({ context: data.context, method: data.method, callback: [callback] });
		}
	}

	public publish(event: EventMessage | MessageEvent): void {
		if (event instanceof EventMessage) {
			const { id, context, method, requireObserver } = event;
			if (requireObserver === true) {
				console.debug(...ConsolePrefix.RequireObserve, { id: { id }, RequireObserve: `${context} → ${method}` });
			} else {
				console.debug(...ConsolePrefix.MsgOut, { id: { id }, runner: `${context} → ${method}` });
			}

			const foundEventRunners = this.eventRoutes.find(rt => rt.context === event.context && rt.method === event.method);
			if (foundEventRunners) {
				foundEventRunners.callback.forEach(callback => {
					callback(event);
				});
			} else {
				throw new EventRouteError(`Route ${context} → ${method} is not defined or implemented`);
			}
		} else if (event instanceof MessageEvent) {
			const msgEvent = event.data;
			if (typeof msgEvent.context === 'string' && typeof msgEvent.method === 'string' && typeof msgEvent.requireObserver === 'boolean') {
				const newEvent = new EventMessage(msgEvent.context, msgEvent.method, msgEvent.data);
				newEvent.requireObserver = msgEvent.requireObserver;
				newEvent.requireReturn = msgEvent.requireReturn;
				if (msgEvent.id) newEvent.id = msgEvent.id;
				try {
					this.publish(newEvent);
				} catch (error) {
					console.error(...ConsolePrefix.Error, error);
					msgEvent.returnData = error;
					this.postMessage(msgEvent);
				}
			} else {
				throw new Error('Bad event formatted');
			}
		}
	}

	public abstract postMessage(data: EventMessage): void;
}
