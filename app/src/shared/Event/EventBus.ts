import { ConsolePrefix } from '../ConsoleColors';
import { EventMessage } from './EventMessage';

type EventMsgHandler<out, params> = {
	msgEvent: EventMessage<out, params>,
	clbk: (eventMsg: EventMessage<out, params>) => void
}

export abstract class EventBus {
	public isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

	constructor(public manager: Worker) {
		manager.addEventListener('message', (ev) => this.onWorkerMessage(ev));
		manager.addEventListener('error', (ev) => this.onWorkerError(ev));
		manager.addEventListener('messageerror', (ev) => this.onWorkerMessage(ev));
	}

	private onWorkerMessage(ev: MessageEvent<any>) {
		const msg = EventMessage.parseMessageEvent(ev);
		if (msg.resolved && this.isWorker) return;
		this.publish(msg);
	}

	private onWorkerError(ev: ErrorEvent) {
		const msg = EventMessage.parseErrorEvent(ev);
		if (msg.resolved && this.isWorker) return;
		this.publish(msg);
	}

	public postMessage<rtnOut, eparams>(msg: EventMessage<rtnOut, eparams>) {
		if (msg.resolved) return;

		// If request is resolved as webworker, event is marked as resolved
		if (this.isWorker) msg.resolved = true;

		console.log(...ConsolePrefix.Msg, { id: { id: msg.id }, context: msg.context, method: msg.method, returnData: msg.returnData });
		this.manager.postMessage(msg);
	}

	private handlers: EventMsgHandler<any, any>[] = [];

	public publish<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>) {
		const findMethods = this.handlers.filter(h => h.msgEvent.context === evMsg.context && h.msgEvent.method === evMsg.method);
		if (findMethods.length !== 0) {
			try {
				findMethods.forEach(async handler => {
					const data = await handler.clbk(evMsg);
					handler.msgEvent.returnData = data as rtnOut;
					this.postMessage(handler.msgEvent);
				});
			} catch (error) {
				evMsg.error = true;
				evMsg.returnData = error as rtnOut;
				this.postMessage(evMsg);
			}
		} else {
			evMsg.error = true;
			evMsg.returnData = new Error('Route not found') as rtnOut;
			this.postMessage(evMsg);
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