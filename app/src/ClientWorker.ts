import { ConsoleColors } from './ConsoleColors';
import { EventMessage } from './shared/EventMessage';

export class ClientWorker {
	constructor(private worker: Worker) {
		this.worker.onmessage = ClientWorker.onMessage;
		this.worker.onerror = ClientWorker.onError;
		this.postEvent('Root', 'initialize');
	}

	public postEvent(context: string, method: string, data?: any) {
		const eventMsg = new EventMessage(method, context, data);
		this.worker.postMessage(eventMsg);
	}

	public postEventReturn<input>(context: string, method: string, data?: any): Promise<EventMessage<input>> {
		const eventMsg = new EventMessage(method, context, data);

		const eventPromise = new Promise((resolve, reject) => {
			const eventListenMethod = (event: MessageEvent<EventMessage>) => {
				if (event.data.id === eventMsg.id) {
					resolve(event.data as EventMessage<input>);
					this.worker.removeEventListener('message', eventListenMethod);
				}
			};
			this.worker.addEventListener('message', eventListenMethod);
		}) as Promise<EventMessage<input>>;

		this.worker.postMessage(eventMsg);

		return eventPromise;
	}

	private static onMessage(message: MessageEvent) {
		const data = message.data;
		const { context, method, returnData, id } = data;
		if (context && typeof context === 'string' && method && typeof method === 'string') {
			if (returnData instanceof Error) return ClientWorker.onError(data);
			console.debug('%c⮜', ConsoleColors.green, { id: { id }, context, method, returnData });
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
