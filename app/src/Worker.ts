import { CounterApp } from './Counter/Counter';
import { MemoryCounterRepository } from './Counter/Infrastructure/MemoryCounterRepository';
import { CounterRepository } from './Counter/domain/CounterRepository';
import { AppMain } from './shared/AppMain';
import { EventMessage } from './shared/EventMessage';

export class App extends AppMain {
	public repositories?: {
        counterRepo: CounterRepository
    };

	public features?: {
        couterApp: CounterApp
    };

	constructor(public readonly mode: 'client' | 'server') {
		super();
		onmessage = this.publish;
		this.onEvent({ context: 'root', method: 'initialize' }, (eventMsg) => { this.initialize(eventMsg); });
	}

	public postMessage(message: any) {
		postMessage(message);
	}

	private async initialize(eventMsg: EventMessage) {
		console.debug('WebWorker', 'Initializing App...');
		await this.initializeDB();
		await this.initializeApps();
		console.debug('WebWorker', 'App Initialized');
		eventMsg.returnData = 'OK';
		this.postMessage(eventMsg);
	}

	private async initializeDB() {
		this.repositories = {
			counterRepo: new MemoryCounterRepository()
		};
	}

	private async initializeApps() {
		const repos = this.repositories!;
		this.features = {
			couterApp: await CounterApp.instance(this, repos.counterRepo)
		};
	}
}

// @ts-ignore WorkerGlobalScope is defined
// eslint-disable-next-line no-undef
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
	const server = new App('server');
	onmessage = (ev) => server.publish(ev);
}
