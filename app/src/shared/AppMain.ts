import { ConsoleColors, ConsolePrefix } from '../ConsoleColors';
import { EventMessage } from './EventMessage';

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
			const { id, context, method } = event;
			console.debug(...ConsolePrefix.MsgOut, { id: { id }, runner: `${context} → ${method}` });

			const foundEventRunners = this.eventRoutes.find(rt => rt.context === event.context && rt.method === event.method);
			if (foundEventRunners) {
				foundEventRunners.callback.forEach(callback => {
					try {
						callback(event);
					} catch (error) {
						event.returnData = error;
						this.postMessage(event);
					}
				});
			}
		} else if (event instanceof MessageEvent) {
			const data = event.data;
			if (typeof data.context === 'string' && typeof data.method === 'string' && typeof data.requireObserver === 'boolean') {
				const newEvent = new EventMessage(data.context, data.method, data.data);
				newEvent.requireObserver = data.requireObserver;
				newEvent.requireReturn = data.requireReturn;
				if (data.id) newEvent.id = data.id;
				this.publish(newEvent);
			} else {
				throw new Error('Bad event formatted');
			}
		}
	}

	public abstract postMessage(data: EventMessage): void;
}
