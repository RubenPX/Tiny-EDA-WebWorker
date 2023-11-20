import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventError } from '../../Shared/Events/Events/EventError';
import { User } from '../domain/User';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import type { userRepository } from '../domain/userRepository';

type params = Partial<Omit<User, 'id'>> & Required<Pick<User, 'id'>>;

export class SetUser extends EventRunner<User, params> {

	public runnerMethod: string = 'SetUser';

	constructor(
		eventBroker: EventBroker,
		private userRepository: userRepository
	) {
		super(eventBroker);
	}

	protected async runEvent(event: Event<params, unknown>): Promise<User> {
		if (event.params == null) throw new EventError(event, 'Params required...', null);

		const { id, ...userInfo } = event.params;

		let foundUsers = await this.userRepository.getUsers({ id });
		if (foundUsers.length == 0) throw new UserNotFoundException(event);

		let [foundUser] = foundUsers;

		let newUser = await this.userRepository.setUser(new User({ ...foundUser, ...userInfo }));
		if (newUser == null) throw new UserNotFoundException(event);

		return newUser;
	}
}
