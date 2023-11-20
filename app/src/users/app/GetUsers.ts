import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventError } from '../../Shared/Events/Events/EventError';
import { User } from '../domain/User';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import type { userRepository } from '../domain/userRepository';

export class GetUser extends EventRunner<User[], undefined> {
    public runnerMethod: string = 'GetUser';

    constructor(
        eventBroker: EventBroker,
        private userRepository: userRepository
    ) {
        super(eventBroker);
    }

    protected async runEvent(event: Event<undefined, unknown>): Promise<User[]> {
        return this.userRepository.getUsers();
    }
}
