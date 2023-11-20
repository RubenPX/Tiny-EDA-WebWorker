import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventError } from '../../Shared/Events/Events/EventError';
import { User } from '../domain/User';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import type { userRepository } from '../domain/userRepository';

type params = Partial<User> & Required<Pick<User, 'id'>>;

export class SetUser extends EventRunner<User, params> {
    public runnerMethod: string = 'SetUser';

    constructor(
        eventBroker: EventBroker,
        private userRepository: userRepository
    ) {
        super(eventBroker);
    }

    protected async runEvent(event: Event<params, unknown>): Promise<User> {
        if (event.params == null) throw new EventError(event, 'Params required...');

        // Find User
        let foundUsers = await this.userRepository.getUsers({ name: event.params.name });
        if (foundUsers.length == 0) throw new UserNotFoundException(event);

        // Get user
        let [foundUser] = foundUsers;

        // Modify user
        let moddedUser = new User({ ...foundUser, ...event.params });

        // Return user
        let modified = await this.userRepository.setUser(moddedUser);

        return modified;
    }
}
