import { EventMessage } from '../Event/EventMessage';
import { EventRunner } from './EventRunner';

// eslint-disable-next-line no-use-before-define
type reduceType<repo, ctx extends ContextRoute<repo>> = {
	[key in keyof ctx['EventRoutes']]: <out, eParams>(params: eParams) => EventMessage<out, eParams>
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

	public getRoutes(): reduceType<repos, this> {
		return Object.keys(this.EventRoutes).reduce((arr: reduceType<repos>, v: string) => {
			arr[v] = <eParams>(params: eParams) => new EventMessage(this.contextName, v, params);
			return arr;
		}, {});
	}
}
