import { EventMessage } from '../Event/EventMessage';
import { EventRunner } from './EventRunner';

// eslint-disable-next-line no-use-before-define
type reduceType<repo, ctx extends ContextRoute<repo>> = {
	[key in keyof ctx['EventRoutes']]: <rOut = any, eParams = any>(params?: eParams) => EventMessage<rOut, eParams>
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
		return Object.keys(this.EventRoutes).reduce((arr: reduceType<repos, this>, v: string) => {
			// @ts-expect-error
			arr[v] = <rOut, eParams>(params?: eParams) => new EventMessage(this.contextName, v, params) as rOut;
			return arr;
		}, {} as reduceType<repos, this>);
	}
}
