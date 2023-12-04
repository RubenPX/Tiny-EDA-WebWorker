import { EventMessage } from './EventMessage';

type EventMsgHandler<out, params> = {
	msgEvent: EventMessage<out, params>,
	clbk: (eventMsg: EventMessage<out, params>) => void
}

export abstract class EventBus {
	constructor(public manager: Worker) {
		manager.addEventListener('message', (ev) => this.onWorkerMessage(ev));
		manager.addEventListener('error', (ev) => this.onWorkerError(ev));
		manager.addEventListener('messageerror', (ev) => this.onWorkerMessage(ev));
	}

	private onWorkerMessage(ev: MessageEvent<any>) {
		console.log(self.constructor.name, 'in');
		const msg = EventMessage.parseMessageEvent(ev);
		this.publish(msg);
	}

	private onWorkerError(ev: ErrorEvent) {
		console.log(self.constructor.name, 'err');
		const msg = EventMessage.parseErrorEvent(ev);
		this.publish(msg);
	}

	public postMessage<rtnOut, eparams>(eventMsg: EventMessage<rtnOut, eparams>) {
		this.manager.postMessage(eventMsg);
	}

	private handlers: EventMsgHandler<any, any>[] = [];

	public publish<rtnOut, eparams>(eventMsg: EventMessage<rtnOut, eparams>) {
		const findMethods = this.handlers.filter(h => h.msgEvent.context === eventMsg.context && h.msgEvent.method === eventMsg.method);
		if (findMethods.length !== 0) {
			findMethods.forEach(async ev => {
				ev.msgEvent.returnData = await ev.clbk(eventMsg) as rtnOut;
			});
		} else {
			eventMsg.error = true;
			eventMsg.returnData = new Error('Route not found') as rtnOut;
		}
	}

	protected onMessage<rtnOut, rparams>(context: string, method: string, clbk: EventBus['handlers'][number]['clbk']): EventMessage<rtnOut, rparams> {
		const eventMsg = new EventMessage<rtnOut, rparams>(context, method);
		this.handlers.push({ msgEvent: eventMsg, clbk });
		return eventMsg;
	}

	public offMessage(eventMsg: EventMessage<any, any>): void {
		this.handlers = this.handlers.filter(h => h.msgEvent.id !== eventMsg.id);
	}
}
