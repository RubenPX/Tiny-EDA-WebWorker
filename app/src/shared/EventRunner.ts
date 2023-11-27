import { AppMain } from './AppMain';
import { EventMessage } from './EventMessage';

export abstract class EventRunner<returnType = any> {
	// Constructor is private to allow initialize using static method
	protected constructor(public readonly worker: AppMain, public runnerMethod: { context: string, method: string }) {
		this.initialize();
	}

	private initialize() {
		this.worker.onEvent(this.runnerMethod, (msg: EventMessage<returnType>) => {
			if (this.worker.mode === 'client') this.clientRun();
			else {
				msg.returnData = this.serverRun(msg);
				this.worker.postMessage(msg);
			}
		});
	}

	public clientRun(): EventMessage {
		const msgEvent = new EventMessage(this.runnerMethod.method, this.runnerMethod.context);
		this.worker.postMessage(msgEvent);
		return msgEvent;
	}

	protected abstract serverRun(messageEvent: EventMessage<returnType>): returnType;
}
