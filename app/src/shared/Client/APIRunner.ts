import { EventMessage } from '../Event/EventMessage';
import { APIBuilder } from './APIBuilder';

export class APIRunner<returnType, paramsType> {
	constructor(private builder: APIBuilder<returnType, paramsType>) {}

	observe(callback: (data: EventMessage<returnType, paramsType>) => void) {
		this.builder.client.observe({
			context : this.builder.route.context,
			method  : this.builder.route.method,
			params  : this.builder.route.params
		}, callback);
	}

	async run(params?: paramsType): Promise<returnType | undefined> {
		const event = await this.builder.client.postMessageReturn({
			context : this.builder.route.context,
			method  : this.builder.route.method,
			params
		});
		return event.returnData as returnType | undefined;
	}
}
