import { AppMain } from '../../shared/AppMain';
import { EventMessage } from '../../shared/EventMessage';
import { EventRunner } from '../../shared/EventRunner';
import { CounterRepository } from '../domain/CounterRepository';

export class GetCount extends EventRunner<number> {
	constructor(main: AppMain, context: string, public counterRepo: CounterRepository) {
		super(main, { context, method: 'GetCount' });
	}

	protected serverRun(messageEvent: EventMessage<number>): number {
		return this.counterRepo.getCount();
	}
}
