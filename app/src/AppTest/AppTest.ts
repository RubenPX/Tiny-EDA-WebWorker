import { AppMain } from '../shared/AppMain';
import { TestError } from './app/TestError';

export class TestApp {
	public readonly context: string = 'TestApp';
	private constructor(public readonly main: AppMain) {}

	private initialize() {
		const getCount = new TestError(this.main, this.context);
	}

	public static instance(main: AppMain) {
		const counterApp = new TestApp(main);
		counterApp.initialize();
		return counterApp;
	}
}
