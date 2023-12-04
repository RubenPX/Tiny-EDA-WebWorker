import { ConterRepository } from '../domain/ConterRepository';

export class CounterMemory implements ConterRepository {
	private num: number = 0;
	get(): number {
		return this.num;
	}

	set(value: number): number {
		this.num = value;
		return this.num;
	}
}
