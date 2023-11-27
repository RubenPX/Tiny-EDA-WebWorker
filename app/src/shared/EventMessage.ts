import { v4 } from 'uuid';

export class EventMessage<outData = any, inData = any> {
	public id: string = v4();

	public returnData?: outData;

	constructor(
		public readonly method: string,
		public readonly context: string,
		public readonly data?: inData
	) {}
}
