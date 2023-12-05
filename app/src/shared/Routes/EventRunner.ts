import { EventMessage } from '../Event/EventMessage';

export class EventRunner<rOut = any, eParams = any, repx = any> {
	constructor(
		public repo: repx | undefined,
		public run: (repos?: repx, params?: eParams) => Promise<rOut>
	) {}

	public async runMethod(ev: EventMessage<rOut, eParams>): Promise<rOut> {
		if (this.repo == null) throw new Error('can not run this method because repo is not initialized');
		return await this.run(this.repo, ev.params);
	}

	public static prepareEvent<rOut, Rparams, repo>(executor: ((repo?: repo, params?: Rparams) => Promise<rOut>)) {
		return (repoData?: repo) => new EventRunner<rOut, Rparams, repo>(repoData ?? undefined, executor);
	}
}
