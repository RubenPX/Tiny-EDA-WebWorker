import { EventBus } from './Event/EventBus';
import { EventMessage } from './Event/EventMessage';

export class WorkerManager extends EventBus {
	constructor(worker: Worker) {
		super(worker);
		this.onMessage('root', 'initialize', () => this.initialize());
	}

	private async initialize() {
		const msg = new EventMessage('root', 'initialize');
		msg.returnData = 'ok';
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(undefined);
			}, 1000);
		});
		this.postMessage(msg);
	}
}

// eslint-disable-next-line no-undef
if (self instanceof WorkerGlobalScope) {
	const _ = new WorkerManager(self as unknown as Worker);
	console.debug('Worker instanced');
}
