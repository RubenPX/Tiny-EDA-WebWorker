import { CounterFeature } from '../Counter/CounterFeature';
import { CounterMemory } from '../Counter/infrastructure/CounterMemory';
import { EventBus } from './Event/EventBus';
import { ContextRoute } from './Routes/ContextRoute';

export class WorkerManager extends EventBus {
	public readonly repos = {
		counter: new CounterMemory()
	};

	public routes: { [key: string]: ContextRoute<any>; } = {
		Counter: new CounterFeature(this.repos.counter)
	} as const;

	constructor(worker: Worker) {
		super(worker);
		this.onMessage('root', 'initialize', () => this.initialize());
	}

	private async initialize() {
		Object.entries(this.routes).forEach(([ctxName, ctx]) => {
			Object.entries(ctx.EventRoutes).forEach(([methodName, runner]) => {
				this.onMessage(ctxName, methodName, (msg) => runner.runMethod(msg));
			});
		});
		return 'OK';
	}
}

// eslint-disable-next-line no-undef
if (self instanceof WorkerGlobalScope) {
	const _ = new WorkerManager(self as unknown as Worker);
	console.debug('Worker instanced');
}
