import { EventMessage } from './EventMessage';

export class EventError<eParams = any> extends Error {
	public eventMessage: EventMessage<string, eParams>;

	constructor(msgEvent: EventMessage<any, eParams>) {
		super(typeof msgEvent.returnData === 'string' ? msgEvent.returnData : 'custom error');
		this.eventMessage = msgEvent;
	}
}
