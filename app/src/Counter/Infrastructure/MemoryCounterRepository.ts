import { CounterRepository } from '../domain/CounterRepository';

export class MemoryCounterRepository implements CounterRepository {
	private counter: number = 0;
	private callbacks: ((count: number) => void)[] = [];

	onChange(callback: (count: number) => void): void {
		this.callbacks.push(callback);
	}

	setCount(count: number): void {
		this.counter = count;
		this.notify();
	}

	getCount(): number {
		return this.counter;
	}

	public notify() {
		this.callbacks.forEach((callback) => callback(this.counter));
	}
}
