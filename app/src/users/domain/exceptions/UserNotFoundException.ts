import { Event } from '../../../Shared/Events/Events/Event';
import { EventError } from '../../../Shared/Events/Events/EventError';

export class UserNotFoundException extends EventError {
    constructor(event: Event, message: string = 'User not found', data: any = undefined) {
        super(event, message, data)
    }
}
