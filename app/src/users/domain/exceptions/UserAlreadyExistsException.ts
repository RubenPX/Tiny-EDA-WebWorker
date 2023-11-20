import { Event } from "../../../Shared/Events/Events/Event";
import { EventError } from "../../../Shared/Events/Events/EventError";

export class UserAlreadyExistsException extends EventError {
    constructor(event: Event, message: string = 'User already exists', data: any = undefined) {
        super(event, message, data)
    }
}