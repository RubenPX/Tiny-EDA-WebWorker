import { CounterFeature } from '../../Counter/CounterFeature';
import { EventBus } from '../Event/EventBus';
import { EventError } from '../Event/EventError';
import { EventMessage } from '../Event/EventMessage';
import { ContextRoute } from '../Routes/ContextRoute';

export * from './APIBuilder';
export * from './APIRunner';

export const clientRoutes = {
	// @ts-expect-error This never will be initialized
	Counter: new CounterFeature(undefined).getRoutes()
} as const;

export class ClientWorkerManager extends EventBus {
	protected routes?: { [key: string]: ContextRoute<any>; } | undefined;

	constructor(worker: Worker) {
		super(worker);
		this.postMessageReturn({ context: 'root', method: 'initialize' }).then((ev) => {
			console.log('initialized!', ev.returnData);
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
				if (evMsg.error) {
					reject(new EventError(evMsg));
					throw new EventError(evMsg);
				}

				// Resolve with data
				resolve({ ...evMsg });
			};

			const evmsg: EventMessage<any, any> = this.onMessage(newEvent.context, newEvent.method, ev => onMsgHandler(ev, evmsg));
		});

		this.postMessage(newEvent);

		return prom as Promise<EventMessage<rtnOut, eparams>>;
	}

	public observe<rtnOut, eparams>(route: { context: string, method: string, params?: eparams }, clbk: EventBus['handlers'][number]['clbk']) {
		return this.onMessage<rtnOut, eparams>(route.context, route.method, clbk);
	}
}
