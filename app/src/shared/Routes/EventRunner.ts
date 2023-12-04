import { EventBus } from '../Event/EventBus';
import { EventMessage } from '../Event/EventMessage';

export class EventRunner<out = any, eParams = any, repx = any> {
	constructor(
		public repo: repx,
		public run: (repos: repx, params?: eParams) => Promise<out>
	) {}

	public async runMethod(ev: EventMessage<out, eParams>): Promise<out> {
		return await this.run(this.repo, ev.params);
	}

	public static prepareEvent<out, Rparams, repo>(executor: ((repo: repo, params?: Rparams) => Promise<out>)) {
		return (repoData: repo) => new EventRunner<out, Rparams, repo>(repoData, executor);
	}
}
