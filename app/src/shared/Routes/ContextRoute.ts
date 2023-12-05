import type { ClientRouteDefinition } from '../Client/APIBuilder';
import { EventMessage } from '../Event/EventMessage';
import { EventRunner } from './EventRunner';

// eslint-disable-next-line no-use-before-define
type clientDefs<ctx extends ContextRoute<any>> = {
	[key in keyof ctx['EventRoutes']]:
		ctx['EventRoutes'][key] extends EventRunner<infer returnType, infer paramsType>
			? ClientRouteDefinition<returnType, paramsType>
			: never
}

export abstract class ContextRoute<repos> {
	public abstract readonly EventRoutes: { [key: string]: EventRunner }
	protected abstract readonly repos: repos;
	protected abstract contextName: string;

	public async runEvent<rOut, eParams>(evMsg: EventMessage<rOut, eParams>): Promise<EventMessage<rOut, eParams>> {
		const foundMethod = Object.entries(this.EventRoutes).find(([method]) => method === evMsg.method);
		if (!foundMethod) throw new Error('Method not found');

		const runner = foundMethod[1];
		evMsg.returnData = await runner.run(this.repos, evMsg.params);

		return evMsg;
	}

	public getRoutes(): clientDefs<this> {
		return Object.entries(this.EventRoutes).reduce((arr: clientDefs<this>, [method, ctx]) => {
			// @ts-ignore
			arr[method] = { context: this.contextName, method };
			return arr;
		}, {} as clientDefs<this>);
	}
}
