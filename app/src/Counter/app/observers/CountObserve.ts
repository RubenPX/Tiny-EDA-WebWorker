import { ConsoleColors } from '../../../ConsoleColors';
import { AppMain } from '../../../shared/AppMain';
import { EventMessage } from '../../../shared/EventMessage';
import { EventRunner } from '../../../shared/EventRunner';
import { CounterRepository } from '../CounterRepository';

export class CountObserve extends EventRunner<number> {
	constructor(main: AppMain, context: string, public counterRepo: CounterRepository) {
		super(main, { context, method: 'CountObserve' });
		main.onEvent({ context, method: 'SetCount' }, (message) => {
			console.log('%cCountObserve', ConsoleColors.green, 'reactive event triggered!!! --> ' + this.run());
		});
	}

	protected run(): number {
		return this.counterRepo.getCount();
	}
}
