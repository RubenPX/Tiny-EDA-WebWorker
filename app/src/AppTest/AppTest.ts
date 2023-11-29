import { AppMain } from '../shared/AppMain';
import { ClientRouteDefinition } from '../shared/Client/ClientRouteDefinition';
import { TestError } from './app/TestError';

const Definitions = {
	runTestError: new ClientRouteDefinition<never, never>('TestApp', 'RunTestError')
};

export class TestApp {
	public readonly context: string = 'TestApp';
	private constructor(public readonly main: AppMain) {}
	public static readonly definitions = Definitions;

	private initialize() {
		const _ = [
			new TestError(this.main, this.context)
		];
	}

	public static instance(main: AppMain) {
		const counterApp = new TestApp(main);
		counterApp.initialize();
		return counterApp;
	}
}
