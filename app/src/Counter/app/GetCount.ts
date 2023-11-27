import { AppMain } from '../../shared/AppMain';
import { EventMessage } from '../../shared/EventMessage';
import { EventRunner } from '../../shared/EventRunner';
import { CounterRepository } from '../domain/CounterRepository';

export class GetCount extends EventRunner<number> {
	constructor(main: AppMain, public counterRepo: CounterRepository, runnerMethod = { context: 'Counter', method: 'GetCount' }) {
		super(main, runnerMethod);
	}

	protected serverRun(messageEvent: EventMessage<number>): number {
		return this.counterRepo.getCount();
	}
}
