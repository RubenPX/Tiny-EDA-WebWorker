import { AppMain } from '../shared/AppMain';
import { GetCount } from './app/GetCount';
import { SetCount } from './app/SetCount';
import { CounterRepository } from './app/CounterRepository';

export class CounterApp {
	public readonly context: string = 'Counter';
	private constructor(public readonly main: AppMain, public readonly counterRepo: CounterRepository) {}

	private initialize() {
		const _ = [
			new GetCount(this.main, this.context, this.counterRepo),
			new SetCount(this.main, this.context, this.counterRepo)
		];
	}

	public static instance(main: AppMain, counterRepo: CounterRepository) {
		const counterApp = new CounterApp(main, counterRepo);
		counterApp.initialize();
		return counterApp;
	}
}
