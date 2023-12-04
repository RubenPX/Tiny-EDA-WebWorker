import { EventBus } from './Event/EventBus';
import { EventMessage } from './Event/EventMessage';

export class ClientWorkerManager extends EventBus {
	constructor(worker: Worker) {
		super(worker);
		this.postMessageReturn({ context: 'root', method: 'initialize' }).then(() => {
			console.log('initialized!');
		});
	}

	public postMessageReturn<rtnOut, eparams>(route: { context: string, method: string, params?: eparams }): Promise<EventMessage<rtnOut, eparams>> {
		const newEvent = new EventMessage(route.context, route.method, route.params);

		const prom = new Promise((resolve, reject) => {
			this.onMessage(newEvent.context, newEvent.method, (evMsg) => {
				if (evMsg.error) reject(evMsg);
				else resolve(evMsg);

				this.offMessage(newEvent);
			});
		});

		this.postMessage(newEvent);

		return prom as Promise<EventMessage<rtnOut, eparams>>;
	}

	public observe<rtnOut, eparams>(route: { context: string, method: string, params?: eparams }, clbk: EventBus['handlers'][number]['clbk']) {
		const newEvent = new EventMessage(route.context, route.method, route.params);

		this.onMessage(newEvent.context, newEvent.method, clbk);
		this.postMessage(newEvent);

		return newEvent as EventMessage<rtnOut, eparams>;
	}
}
