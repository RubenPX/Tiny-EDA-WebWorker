import { ConsoleColors } from './ConsoleColors';
import { EventMessage } from './shared/EventMessage';

export class ClientWorker {
	constructor(private worker: Worker) {
		this.worker.onmessage = ClientWorker.onMessage;
		this.worker.onerror = ClientWorker.onError;
		this.postEvent('root', 'initialize');
	}

	public postEvent(context: string, method: string) {
		const eventMsg = new EventMessage(method, context);
		this.worker.postMessage(eventMsg);
	}

	private static onMessage(message: MessageEvent) {
		const data = message.data;
		const { context, method, returnData, id } = data;
		if (context && typeof context === 'string' && method && typeof method === 'string') {
			if (returnData instanceof Error) return ClientWorker.onError(data);
			console.debug('%c⮜', ConsoleColors.green, { id, context, method, returnData });
		}
	}

	private static onError(data: ErrorEvent | Error | any) {
		const { context, method, returnData, id } = data;
		if (context && typeof context === 'string' && method && typeof method === 'string') {
			console.error('%c⭙', ConsoleColors.red, { id, context, method }, '\n', returnData);
		}
	}
}
