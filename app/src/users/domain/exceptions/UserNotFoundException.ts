import { ResponseError } from "../../../Shared/exceptions/ResponseError";

export class UserNotFoundException extends ResponseError {
	constructor(message: string = "User not found", statusCode: number = 404) {
		super(message, statusCode);
	}
}
