import { TestApp } from '../../AppTest/AppTest';
import { ConsolePrefix } from '../../ConsoleColors';
import { CounterApp } from '../../Counter/Counter';
import { EventMessage } from '../EventMessage';
import { ApiBuilder } from './Builder/APIBuilder';
import { ClientRouteDefinition } from './ClientRouteDefinition';

export { APIRunner } from './Runner/APIRunner';

export const AppRoutes = {
	...TestApp.routeDefinitions,
	...CounterApp.routeDefinitions
};

export class ClientWorker {
	constructor(private worker: Worker) {
		this.worker.onmessage = ClientWorker.messageRecived;
		this.worker.onerror = ClientWorker.onError;
		this.postEvent('Root', 'initialize');
	}

	public postEvent(context: string, method: string, data?: any) {
		const eventMsg = new EventMessage(context, method, data);
		this.worker.postMessage(eventMsg);
	}

	public postEventReturn<input>(context: string, method: string, data?: any): Promise<EventMessage<input>> {
		const eventMsg = new EventMessage(context, method, data);
		eventMsg.requireReturn = true;

		const eventPromise = new Promise((resolve, reject) => {
			// Timeout exception in processing
			const timeout = setTimeout(() => reject(new ErrorEvent('Timeout exception')), 10000);

			// Resolver
			const eventListenMethod = (event: MessageEvent<EventMessage>) => {
				if (event.data.id === eventMsg.id) {
					if (event.data.returnData instanceof Error) reject(event.data.returnData);
					else resolve(event.data as EventMessage<input>);

					clearTimeout(timeout);
					this.worker.removeEventListener('message', eventListenMethod);
				}
			};

			// Listener
			this.worker.addEventListener('message', eventListenMethod);
		}) as Promise<EventMessage<input>>;

		this.worker.postMessage(eventMsg);

		return eventPromise;
	}

	public observeEvent(context: string, method: string, clbk: (data: EventMessage) => void) {
		const eventMsg = new EventMessage(context, method);
		eventMsg.requireObserver = true;

		this.worker.addEventListener('message', (event: MessageEvent<EventMessage>) => {
			if (event.data.id === eventMsg.id) clbk(event.data);
		});

		this.worker.postMessage(eventMsg);
	}

	public createBuilder<r, p>(route: ClientRouteDefinition<r, p>) {
		return new ApiBuilder(route, this);
	}

	private static messageRecived(message: MessageEvent<EventMessage>) {
		const msgData = message.data;
		const { context, method, returnData, id, requireObserver } = msgData;
		if (typeof context === 'string' && typeof method === 'string') {
			if (returnData instanceof Error) return;
			if (requireObserver) {
				console.debug(...ConsolePrefix.ObserverTriggered, { id: { id }, runner: `${context} → ${method}`, returnData });
			} else {
				console.debug(...ConsolePrefix.MsgIn, { id: { id }, runner: `${context} → ${method}`, returnData });
			}
		}
	}

	private static onError(data: MessageEvent | any) {
		console.error(...ConsolePrefix.Error, 'WORKER UNCONTROLLED ERROR', data);
	}
}
