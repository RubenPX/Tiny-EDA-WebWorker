import { APIBuilder, type ClientRouteDefinition } from './APIBuilder';
import type { ClientWorkerManager } from './ClientWorkerManager';
import type { EventMessage } from '../Event/EventMessage';

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

	public static instanceBasic<returnType, paramsType>(
		client: ClientWorkerManager,
		route: ClientRouteDefinition<returnType, paramsType>
	): APIRunner<returnType, paramsType> {
		const builder = new APIBuilder(route, client);
		return new APIRunner(builder);
	}
}
