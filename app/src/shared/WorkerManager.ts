import { ContextRoute, type clientDefs } from './Routes/ContextRoute';
import { CounterFeature } from '../Counter/CounterFeature';
import { CounterMemory } from '../Counter/infrastructure/CounterMemory';
import { EventBus } from './Event/EventBus';

// eslint-disable-next-line no-use-before-define
type clientRoutesType = { [key in keyof WorkerManager['routes']]: clientDefs<WorkerManager['routes'][key]> }

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

	public static getClientRoutes(): clientRoutesType {
		return Object.entries(this.publicRoutes).reduce((arr: clientRoutesType, [ctxName, ctx]) => {
		  // @ts-ignore
		  arr[ctxName] = ctx.getRoutes();
		  return arr;
		}, {} as clientRoutesType);
	  }
}

// eslint-disable-next-line no-undef
if (self instanceof WorkerGlobalScope) {
	// eslint-disable-next-line no-new
	new WorkerManager(self as unknown as Worker);
	console.debug('Worker instanced');
}
