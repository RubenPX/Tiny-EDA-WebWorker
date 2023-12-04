export class EventMessage<out, eparams> {
	public returnData: out | undefined = undefined;
	public error: boolean = false;

	constructor(
		public context: string,
		public method: string,
		public params?: eparams
	) {}

	public static parseMessageEvent<out, prms>(ev: MessageEvent<any>): EventMessage<out, prms> {
		const { context, method, params, ...rest } = ev.data;
		const msgEvent = new EventMessage(context, method, params);

		if (rest.error) msgEvent.error = rest.error;

		return msgEvent as EventMessage<out, prms>;
	}
}
