import { ConsolePrefix } from '../ConsoleColors';
import { ContextRoute } from '../Routes/ContextRoute';
import { EventMessage } from './EventMessage';

type EventMsgHandler<out, params> = {
	msgEvent: EventMessage<out, params>,
	clbk: (eventMsg: EventMessage<out, params>) => void
}

export abstract class EventBus {
	protected abstract routes?: { [key: string]: ContextRoute<any> }
	// eslint-disable-next-line no-undef
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

		console.debug(...ConsolePrefix.Msg, { id: { id: msg.id }, context: msg.context, method: msg.method, returnData: msg.returnData });
		this.manager.postMessage(msg);
	}

	private handlers: EventMsgHandler<any, any>[] = [];

	public publish<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>) {
		const findMethods = this.handlers.filter(h => h.msgEvent.context === evMsg.context && h.msgEvent.method === evMsg.method);
		if (findMethods.length !== 0) {
			findMethods.forEach(async handler => {
				try {
					evMsg.returnData = await handler.clbk(evMsg) as rtnOut;
					this.postMessage(evMsg);
				} catch (error) {
					evMsg.error = true;
					evMsg.returnData = error as rtnOut;
					this.postMessage(evMsg);
				}
			});
		} else {
			evMsg.error = true;
			evMsg.returnData = new Error('Route not found') as rtnOut;
			this.postMessage(evMsg);
		}
	}

	public offMessage(eventMsg: EventMessage<any, any>): void {
		this.handlers = this.handlers.filter(h => h.msgEvent.id !== eventMsg.id);
	}

	protected onMessage<rtnOut, eparams>(context: string, method: string, clbk: (msg: EventMessage<rtnOut, eparams>) => void) {
		const newMessage = new EventMessage(context, method);
		this.handlers.push({ msgEvent: newMessage, clbk });
		return newMessage as EventMessage<rtnOut, eparams>;
	}
}
