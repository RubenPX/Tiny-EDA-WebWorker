import { v4 } from 'uuid';

export class EventMessage<outData = any, inData = any> {
	public id: string = v4();

	public returnData?: outData;
	public requireObserver: boolean = false;
	public requireReturn: boolean = false;

	constructor(
		public readonly context: string,
		public readonly method: string,
		public readonly data?: inData
	) {}
}
