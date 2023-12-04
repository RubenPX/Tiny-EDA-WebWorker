import { v4 } from 'uuid';

export class EventMessage<out, eparams> {
	public readonly id = v4();

	public returnData: out | undefined = undefined;
	public error: boolean = false;

	constructor(
		public context: string,
		public method: string,
		public params?: eparams
	) {}

	public static parseMessageEvent<rtnOut, prms>(ev: MessageEvent<any>): EventMessage<rtnOut, prms> {
		const { context, method, params, ...rest } = ev.data;
		if (context && method) {
			const msgEvent = new EventMessage(context, method, params);
			if (rest.error) msgEvent.error = rest.error;
			return msgEvent as EventMessage<rtnOut, prms>;
		} else {
			const msgEvent = new EventMessage('', '');
			msgEvent.error = true;
			msgEvent.returnData = ev.data;
			return msgEvent as EventMessage<rtnOut, prms>;
		}
	}

	public static parseErrorEvent(ev: ErrorEvent) {
		const msgEvent = new EventMessage('', '');
		msgEvent.error = true;
		msgEvent.returnData = ev;
		return msgEvent;
	}
}

export class ErrorEventMessage extends EventMessage<Error, any> {
	public readonly error = true;

	constructor(
		public readonly returnData: Error,
		public context: string,
		public method: string,
		public params?: any
	) {
		super(context, method, params);
	}
}
