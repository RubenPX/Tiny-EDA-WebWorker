import { ConsoleColors } from './ConsoleColors';

export class ClientWorker {
	constructor(private worker: Worker) {
		this.worker.postMessage('init');
		this.worker.onmessage = this.onMessage;
		this.worker.onerror = this.onError;
	}

	private onMessage(message: MessageEvent) {
		console.debug(message);
		console.debug('%c⮞', ConsoleColors.green, { message: message.data });
	}

	private onError(message: ErrorEvent) {
		console.log(message);
	}
}
