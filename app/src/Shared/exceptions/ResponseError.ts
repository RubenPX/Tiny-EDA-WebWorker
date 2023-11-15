export class ResponseError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
	) {
		super(message);
	}
}
