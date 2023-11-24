import { CounterRepository } from '../domain/CounterRepository';

export class CounterApp {
	private constructor(private counterDB: CounterRepository) { }

	public static async initialize(counterDB: CounterRepository) {
		const counterApp = new CounterApp(counterDB);
		return counterApp;
	}

	onChange = (callback: (count: number) => void): void => this.counterDB.onChange(callback);
	getCount = (): number => this.counterDB.getCount();
	setCount = (num: number) => this.counterDB.setCount(num);
}
