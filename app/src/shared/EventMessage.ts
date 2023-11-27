import { v4 } from 'uuid';

export class EventMessage<outData = any> {
	public id: string = v4();

	public returnData?: outData;

	constructor(public readonly method: string, public readonly context: string) {}
}
