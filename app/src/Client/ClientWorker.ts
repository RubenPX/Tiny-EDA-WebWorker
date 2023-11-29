import { ConsoleColors } from '../ConsoleColors';
import { EventMessage } from '../shared/EventMessage';

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
			const timeout = setTimeout(() => reject(new ErrorEvent('Timeout exception')), 5000);

			// Resolver
			const eventListenMethod = (event: MessageEvent<EventMessage>) => {
				if (event.data.id === eventMsg.id) {
					resolve(event.data as EventMessage<input>);
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

	private static messageRecived(message: MessageEvent) {
		const data = message.data;
		if (message.data instanceof EventMessage) {
			console.log('!!!');
		}
		const { context, method, returnData, id, requireObserver, requireReturn } = data;
		if (typeof context === 'string' && typeof method === 'string') {
			if (returnData instanceof Error) return ClientWorker.onError(data);
			if (requireObserver) {
				console.debug('%c⊚', ConsoleColors.green, { id: { id }, runner: `${context} → ${method}`, returnData });
			} else {
				console.debug('%c⮜', ConsoleColors.green, { id: { id }, runner: `${context} → ${method}`, returnData });
			}
		}
	}

	private static onError(data: ErrorEvent | Error | any) {
		const { context, method, returnData, id } = data;
		if (context && typeof context === 'string' && method && typeof method === 'string') {
			console.error('%c⭙', ConsoleColors.red, { id: { id }, context, method }, '\n', returnData);
		} else {
			console.error(data);
		}
	}
}
