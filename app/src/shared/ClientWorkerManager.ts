import { EventBus } from './Event/EventBus';
import { EventError } from './Event/EventError';
import { EventMessage } from './Event/EventMessage';

export class ClientWorkerManager extends EventBus {
	constructor(worker: Worker) {
		super(worker);
		this.postMessageReturn({ context: 'root', method: 'initialize' }).then((ev) => {
			console.log('initialized!', ev.returnData);
		});
	}

	public postMessageReturn<rtnOut, eparams>(evMsg: { context: string, method: string, params?: eparams }) {
		const newEvent = new EventMessage(evMsg.context, evMsg.method, evMsg.params);

		const prom = new Promise((resolve, reject) => {
			this.onMessage(newEvent.context, newEvent.method, (evMsg) => {
				// Skip if id is not same as new event
				if (evMsg.id !== newEvent.id) return;

				// Unsuscribe
				this.offMessage(evMsg);

				// Check if has error
				if (evMsg.error) throw new EventError(evMsg);

				// Resolve with data
				resolve(evMsg);
			});
		});

		this.postMessage(newEvent);

		return prom as Promise<EventMessage<rtnOut, eparams>>;
	}

	public observe<rtnOut, eparams>(route: { context: string, method: string, params?: eparams }, clbk: EventBus['handlers'][number]['clbk']) {
		const newEvent = new EventMessage(route.context, route.method, route.params);

		this.onMessage(newEvent.context, newEvent.method, clbk);

		return newEvent as EventMessage<rtnOut, eparams>;
	}
}
