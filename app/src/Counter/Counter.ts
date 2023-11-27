import { AppMain } from '../shared/AppMain';
import { GetCount } from './app/GetCount';
import { CounterRepository } from './domain/CounterRepository';

export class CounterApp {
	private constructor(public readonly main: AppMain, public readonly counterRepo: CounterRepository) {}

	private initialize() {
		const getCount = new GetCount(this.main, this.counterRepo);
	}

	public static instance(main: AppMain, counterRepo: CounterRepository) {
		const counterApp = new CounterApp(main, counterRepo);
		counterApp.initialize();
		return counterApp;
	}
}
