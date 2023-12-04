import { EventBus } from '../Event/EventBus';
import { EventMessage } from '../Event/EventMessage';

export class EventRunner<out = any, Rparams = any> {
	constructor(
		private bus: EventBus,
		public context: string,
		public method: string,
		public run: ((params: Rparams) => out)
	) {}

	public clientRoute(params: Rparams | undefined = undefined) {
		const msg = new EventMessage(this.context, this.method, params);
		this.bus.postMessage(msg);
	}

	public static prepareEvent(method: string, executor: EventRunner['run']) {
		return (bus: EventBus, context: string) => new EventRunner(bus, context, method, executor);
	}
}
