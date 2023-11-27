import { AppMain } from '../../shared/AppMain';
import { EventMessage } from '../../shared/EventMessage';
import { EventRunner } from '../../shared/EventRunner';

export class TestError extends EventRunner {
	constructor(main: AppMain, context: string) {
		super(main, { context, method: 'runTest' });
	}

	protected serverRun(messageEvent: EventMessage<any>) {
		throw new Error('This is a test error');
	}
}
