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
			const evObserve = this.onMessage(route.context, route.method, (evMsg) => {
				// Skip if id is not same as new event
				if (evMsg.id === newEvent.id) return;

				// Check if has error
				if (!evMsg.error) resolve(evMsg);
				else reject(evMsg);

				// Unsuscribe
				this.offMessage(evObserve);
				this.offMessage(newEvent);
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
