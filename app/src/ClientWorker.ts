import { ConsoleColors } from './ConsoleColors';
import { EventMessage } from './shared/EventMessage';

export class ClientWorker {
	constructor(private worker: Worker) {
		this.worker.onmessage = ClientWorker.onMessage;
		this.worker.onerror = ClientWorker.onError;
		this.postEvent('initialize', 'root');
	}

	public postEvent(context: string, method: string) {
		const eventMsg = new EventMessage(context, method);
		this.worker.postMessage(eventMsg);
	}

	private static onMessage(message: MessageEvent) {
		const data = message.data;
		const { context, method, returnData, id } = data;

		if (context && typeof context === 'string' && method && typeof method === 'string') {
			if (data instanceof Error) return ClientWorker.onError(data);
			console.debug('%c⮜', ConsoleColors.green, { id, context, method, returnData });
		}
	}

	private static onError(message: ErrorEvent | Error) {
		console.debug('%c⭙', ConsoleColors.red, message);
	}
}
