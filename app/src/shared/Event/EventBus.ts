import { ConsolePrefix } from '../Console/Formatters';
import type { ContextRoute } from '../Routes/ContextRoute';
import { EventError } from './EventError';
import { EventMessage } from './EventMessage';
import { Logger } from '../Console/Logger';
import { isWorker } from '../utils/isWorker';

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

	if ((isWorker && Logger.verbose.worker.showIn) || (!isWorker && Logger.verbose.browser.showIn)) {
		console.debug(...ConsolePrefix.reciveMsg, { id: { id: msg.id }, context: msg.context, method: msg.method, returnData: msg.returnData });
	}

	this.publish(msg);
}

private onWorkerError(ev: ErrorEvent) {
	const msg = EventMessage.parseErrorEvent(ev);

	this.publish(msg);
}

public postMessage<rtnOut, eparams>(msg: EventMessage<rtnOut, eparams>, markAsResolved: boolean = false) {
	if (msg.resolved) return;
	if (markAsResolved) msg.resolved = true;

	if ((isWorker && Logger.verbose.worker.showOut) || (!isWorker && Logger.verbose.browser.showOut)) {
		console.debug(...ConsolePrefix.sendMsg, { id: { id: msg.id }, context: msg.context, method: msg.method, returnData: msg.returnData });
	}

	this.manager.postMessage(msg);
}

protected handlers: EventMsgHandler<any, any>[] = [];

public publish<rtnOut, eparams>(evMsg: EventMessage<rtnOut, eparams>) {
	const findMethods = this.handlers.filter(h => h.msgEvent.context === evMsg.context && h.msgEvent.method === evMsg.method);
	if (findMethods.length !== 0) {
		findMethods.forEach(async handler => {
			try {
				evMsg.returnData = await handler.clbk(evMsg) as rtnOut;
				this.postMessage(evMsg, true);
			} catch (error) {
				evMsg.error = true;
				evMsg.returnData = error as rtnOut;
				this.postMessage(evMsg, true);
			}
		});
	} else {
		if (evMsg.resolved) return; // Stop if route is not found
		evMsg.error = true;
		evMsg.returnData = new Error('Route not found') as rtnOut;
		this.postMessage(evMsg, true);
	}
}

public offMessage(eventMsg: EventMessage<any, any>): void {
	this.handlers = this.handlers.filter(h => h.msgEvent.id !== eventMsg.id);
	console.debug(...ConsolePrefix.ObserverUnRegister, eventMsg.id);
}

protected onMessage<rtnOut, eparams>(context: string, method: string, clbk: (msg: EventMessage<rtnOut, eparams>) => void) {
	const newMessage = new EventMessage(context, method);
	this.handlers.push({ msgEvent: newMessage, clbk });
	console.debug(...ConsolePrefix.ObserverRegister, newMessage.id, { context, method });
	return newMessage as EventMessage<rtnOut, eparams>;
}

public postClientReturn<returnType, paramsType>(context: string, method: string, params?: paramsType): Promise<EventMessage<returnType, paramsType>> {
	const msg = new EventMessage<returnType, paramsType>(context, method, params);

	const prom = new Promise<EventMessage<returnType, paramsType>>((resolve, reject) => {
		this.onMessage<returnType, paramsType>(msg.context, msg.method, (evMsg) => {
			if (msg.id !== evMsg.id) return;

			if (msg.error) reject(new EventError(evMsg));
			else resolve(evMsg);

			this.offMessage(msg);

			if (evMsg.error) throw new EventError(evMsg);
		});
	});

	this.postMessage(msg);

	return prom;
}
}
