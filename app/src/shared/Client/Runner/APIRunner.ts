import { EventMessage } from '../../EventMessage';
import { ApiBuilder } from '../Builder/APIBuilder';

export class APIRunner<returnType, paramsType> {
	constructor(private builder: ApiBuilder<returnType, paramsType>) {}

	observe(callback: (data: EventMessage<returnType, paramsType>) => void) {
		this.builder.client.observeEvent(this.builder.route.context, this.builder.route.method, callback);
	}

	async run(params?: paramsType): Promise<returnType | undefined> {
		const eventR = await this.builder.client.postEventReturn(this.builder.route.context, this.builder.route.method, params);
		return eventR.returnData as returnType | undefined;
	}
}
