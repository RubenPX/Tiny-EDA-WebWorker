import { ConsoleColors } from '../ConsoleColors';
import { AppMain } from './AppMain';
import { EventMessage } from './EventMessage';

export abstract class EventRunner<returnType = any> {
	public observers: EventMessage<returnType>[] = [];

	// Constructor is private to allow initialize using static method
	protected constructor(public readonly worker: AppMain, public runnerMethod: { context: string, method: string }) {
		this.initialize();
	}

	private initialize() {
		this.worker.onEvent(this.runnerMethod, (msg: EventMessage<returnType>) => {
			if (this.worker.mode === 'client') this.clientRun();
			else {
				if (msg.requireObserver) {
					this.observers.push(msg);
					console.debug('%c⭘', ConsoleColors.blue, `Observer attached to ${this.runnerMethod.context} → ${this.runnerMethod.method}`);
				} else {
					msg.returnData = this.run(msg);
					this.worker.postMessage(msg);
					this.postRun(msg.returnData);
				}
			}
		});
	}

	public clientRun(): EventMessage {
		const msgEvent = new EventMessage(this.runnerMethod.context, this.runnerMethod.method);
		this.worker.postMessage(msgEvent);
		return msgEvent;
	}

	private postRun(data: returnType) {
		this.observers.forEach(ev => {
			ev.returnData = data;
			this.worker.postMessage(ev);
		});
	}

	protected abstract run(messageEvent: EventMessage<returnType>): returnType;
}
