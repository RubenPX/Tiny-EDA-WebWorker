import { ConsoleColors } from './ConsoleColors';
import { MemoryCounterRepository } from './Counter/Infrastructure/MemoryCounterRepository';
import { CounterApp } from './Counter/app';
import { CounterRepository } from './Counter/domain/CounterRepository';

export class App {
	public repositories?: {
        counterRepo: CounterRepository
    };

	public features?: {
        couterApp: CounterApp
    };

	public publish(event: MessageEvent) {
		console.debug('%c⮜', ConsoleColors.blue, { message: event.data });
		if (event.data === 'init') {
			this.initialize();
		}
	}

	public postMessage: Worker['postMessage'] = (message: any) => {
		postMessage(message);
	};

	private async initialize() {
		console.debug('WebWorker', 'Initializing App...');
		await this.initializeDB();
		await this.initializeApps();
		console.debug('WebWorker', 'App Initialized');
		this.postMessage('initialized');
	}

	private async initializeDB() {
		this.repositories = {
			counterRepo: new MemoryCounterRepository()
		};
	}

	private async initializeApps() {
		const repos = this.repositories!;
		this.features = {
			couterApp: await CounterApp.initialize(repos.counterRepo)
		};
	}
}

const server = new App();
onmessage = (ev) => server.publish(ev);
