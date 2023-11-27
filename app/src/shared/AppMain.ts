import { ConsoleColors } from '../ConsoleColors';
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
			console.debug('%c⮞', ConsoleColors.blue, { id, context, method });

			const foundCallbacks = this.eventRoutes.find(rt => rt.context === event.context && rt.method === event.method);
			if (foundCallbacks) {
				foundCallbacks.callback.forEach(callback => {
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
			if (data.context && typeof data.context === 'string' && data.method && typeof data.method === 'string') {
				const newEvent = new EventMessage(data.method, data.context, data.data);
				this.publish(newEvent);
			} else {
				throw new Error('Bad event formatted');
			}
		}
	}

	public abstract postMessage(data: EventMessage): void;
}
