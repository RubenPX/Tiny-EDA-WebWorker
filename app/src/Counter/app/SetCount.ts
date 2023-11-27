import { ConsoleColors } from '../../ConsoleColors';
import { AppMain } from '../../shared/AppMain';
import { EventMessage } from '../../shared/EventMessage';
import { EventRunner } from '../../shared/EventRunner';
import { CounterRepository } from './CounterRepository';

export class SetCount extends EventRunner<number> {
	constructor(main: AppMain, context: string, public counterRepo: CounterRepository) {
		super(main, { context, method: 'SetCount' });
	}

	protected run(messageEvent: EventMessage<number, number>): number {
		if (messageEvent.data == null) throw new Error('Param required to set a number');
		console.log('%cSetCount', ConsoleColors.green, 'OK');
		this.counterRepo.setCount(messageEvent.data);
		return this.counterRepo.getCount();
	}
}
