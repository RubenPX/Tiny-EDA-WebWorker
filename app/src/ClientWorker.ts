import { ConsoleColors } from './ConsoleColors';

export class ClientWorker {
	constructor(private worker: Worker) {
		this.worker.postMessage('init');
		this.worker.onmessage = ClientWorker.onMessage;
		this.worker.onerror = ClientWorker.onError;
	}

	private static onMessage(message: MessageEvent) {
		if (message.data instanceof Error) return ClientWorker.onError(message.data);
		console.debug('%c⮞', ConsoleColors.green, { message: message.data });
	}

	private static onError(message: ErrorEvent | Error) {
		console.debug('%c⭙', ConsoleColors.red, message);
	}
}
