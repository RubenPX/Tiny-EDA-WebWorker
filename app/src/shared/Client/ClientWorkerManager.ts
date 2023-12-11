import type { ContextRoute } from '../Routes/ContextRoute';
import { EventBus } from '../Event/EventBus';
import { EventError } from '../Event/EventError';
import { EventMessage } from '../Event/EventMessage';

import { APIBuilder } from './ClientWorkerManager';
import type { ClientRouteDefinition } from './APIBuilder';
import { ConsolePrefix } from '../Console/Formatters';
import type { clientRoutesType } from '../WorkerManager';

export * from './APIBuilder';
export * from './APIRunner';

export class ClientWorkerManager extends EventBus {
	protected routes?: { [key: string]: ContextRoute<any>; } | undefined;

	public Routes!: clientRoutesType;

	constructor(worker: Worker, initializedEvent?: (routes: clientRoutesType) => void) {
		super(worker);
		console.groupCollapsed('Worker initializer');

		this.onMessage<clientRoutesType, undefined>('root', 'initialized', (evMsg) => {
			if (evMsg.returnData) this.Routes = evMsg.returnData;
			console.groupEnd();
			initializedEvent && initializedEvent(evMsg.returnData!);
		});
	}

	public postMessageReturn<rtnOut, eparams>(evMsg: { context: string, method: string, params?: eparams }) {
		const newEvent = new EventMessage(evMsg.context, evMsg.method, evMsg.params);

		const prom = new Promise((resolve, reject) => {
			const onMsgHandler = (evMsg: EventMessage<any, any>, evMsgUn: EventMessage<any, any>) => {
				// Skip if id is not same as new event
				if (evMsg.id !== newEvent.id) return;

				// Unsuscribe
				this.offMessage(evMsgUn);

				// Check if has error
				if (evMsg.error) reject(evMsg);
				else resolve({ ...evMsg });

				// if has error, throw it
				if (evMsg.error) throw new EventError(evMsg);
			};

			const evmsg: EventMessage<any, any> = this.onMessage(newEvent.context, newEvent.method, ev => onMsgHandler(ev, evmsg));
		});

		this.postMessage(newEvent);

		return prom as Promise<EventMessage<rtnOut, eparams>>;
	}

	public instanceBuilder<returnType, paramsType>(route: ClientRouteDefinition<returnType, paramsType>) {
		return new APIBuilder(route, this);
	}

	public observe<rtnOut, eparams>(route: { context: string, method: string, params?: eparams }, clbk: EventBus['handlers'][number]['clbk']) {
		return this.onMessage<rtnOut, eparams>(route.context, route.method, clbk);
	}

	public onMessage<rtnOut, eparams>(context: string, method: string, clbk: (msg: EventMessage<rtnOut, eparams>) => void) {
		const newMessage = new EventMessage(context, method);
		this.handlers.push({ msgEvent: newMessage, clbk });
		console.debug(...ConsolePrefix.ObserverRegister, { context, method });
		return newMessage as EventMessage<rtnOut, eparams>;
	}
}
