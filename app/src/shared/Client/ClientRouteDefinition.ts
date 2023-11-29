export class ClientRouteDefinition<returnType, paramsType> {
	constructor(
		public readonly context: string,
		public readonly method: string
	) {}
}
