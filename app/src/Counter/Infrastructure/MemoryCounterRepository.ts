import { CounterRepository } from '../app/CounterRepository';

export class MemoryCounterRepository implements CounterRepository {
	private counter: number = 0;

	setCount(count: number): void {
		this.counter = count;
	}

	getCount(): number {
		return this.counter;
	}
}
