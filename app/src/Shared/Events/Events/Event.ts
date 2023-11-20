import { v4 } from 'uuid';

export class Event<P = unknown, D = unknown> {
	public readonly id: string = v4();

	public readonly method: string;
	public readonly params?: P;
	public readonly data?: D;

	constructor(method: string, eventData?: { params?: P, data?: D }) {
		this.method = method;
		this.params = eventData?.params;
		this.data = eventData?.data;
	}
}
