import { EventMessage } from './EventMessage';

export abstract class EventBus {
	public abstract onMessage: <out, params>(msg: EventMessage<out, params>) => void;
	public abstract onError: <out, params>(msg: EventMessage<out, params>) => void;

	constructor(public manager: Worker | Window) {
		if (manager instanceof Worker) {
			manager.onmessage = this.onWorkerMessage;
		}
	}

	private onWorkerMessage(ev: MessageEvent<any>) {
		const msg = EventMessage.parseMessageEvent(ev);
		if (msg.error) {
			this.onError(msg);
		} else {
			this.onMessage(msg);
		}
	}
}
