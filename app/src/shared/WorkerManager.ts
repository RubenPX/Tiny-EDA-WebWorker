/* eslint-disable no-use-before-define */
import { CounterFeature } from '../Counter/CounterFeature';
import { CounterMemory } from '../Counter/infrastructure/CounterMemory';
import { EventBus } from './Event/EventBus';
import { EventMessage } from './Event/EventMessage';
import type { clientDefs } from './Routes/ContextRoute';

// If you remove this line, inellisense will not work
// eslint-disable-next-line no-use-before-define
export type clientRoutesType = { [key in keyof WorkerManager['routes']]: clientDefs<WorkerManager['routes'][key]> }

export class WorkerManager extends EventBus {
	public readonly routes: {
        counter: CounterFeature
    };

	private constructor(worker: Worker, routes: WorkerManager['routes']) {
		super(worker);
		this.routes = routes;
		this.initialize();
	}

	public static async initialize(worker: Worker) {
		return new WorkerManager(worker, await this.initializeRoutes(worker));
	}

	private static async initializeDBs(worker: Worker) {
		return {
			counterRepository: new CounterMemory()
		};
	}

	private static routesInstance: undefined | WorkerManager['routes'] = undefined;

	private static async initializeRoutes(worker: Worker) {
		const dbs = await this.initializeDBs(worker);
		const counterFeature = new CounterFeature(dbs.counterRepository);

		this.routesInstance = {
			counter: counterFeature
		} satisfies WorkerManager['routes'];

		return this.routesInstance;
	}

	private async initialize() {
		// Register all evento to be routed
		console.groupCollapsed('Worker route registers');
		Object.entries(this.routes).forEach(([ctxName, ctx]) => {
			Object.entries(ctx.EventRoutes).forEach(([methodName, runner]) => {
				// @ts-expect-error
				this.onMessage(ctx.contextName, methodName, (msg) => runner.runMethod(msg));
			});
		});
		console.groupEnd();

		// Register routes on client
		const initializedEvent = new EventMessage('root', 'initialized');
		initializedEvent.returnData = this.getClientRoutes();
		this.postMessage(initializedEvent, true);
	}

	public getClientRoutes(): clientRoutesType {
		return Object.entries(this.routes).reduce((arr: clientRoutesType, [ctxName, ctx]) => {
			// @ts-ignore
			arr[ctxName] = ctx.getRoutes();
			return arr;
		}, {} as clientRoutesType);
	}
}

// eslint-disable-next-line no-undef
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
	await WorkerManager.initialize(self as unknown as Worker);
}
