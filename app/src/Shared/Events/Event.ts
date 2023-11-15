import { v4 } from 'uuid';

export class Event<T> {
	public readonly id: string = v4();

	public readonly params?: T;
	public readonly data?: any;

	constructor(
		public readonly EventName: string,
		eventData?: {params?: T | undefined, data?: any}
	) {
		this.params = eventData?.params;
		this.data = eventData?.data;
	}
}
