import { CounterMemory } from '../Counter/infrastructure/CounterMemory';
import { EventBus } from './Event/EventBus';

export class WorkerManager extends EventBus {
	public readonly repos = {
		counter: new CounterMemory()
	};

	constructor(worker: Worker) {
		super(worker);
		this.onMessage('root', 'initialize', this.initialize);
	}

	private async initialize() {
		return await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('ok');
			}, 2000);
		});
	}
}

// eslint-disable-next-line no-undef
if (self instanceof WorkerGlobalScope) {
	const _ = new WorkerManager(self as unknown as Worker);
	console.debug('Worker instanced');
}
