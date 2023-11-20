import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventError } from '../../Shared/Events/Events/EventError';
import { User } from '../domain/User';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import type { userRepository } from '../domain/userRepository';

export class GetUser extends EventRunner<User, Partial<User>> {
	public runnerMethod: string = 'GetUser';

	constructor(
		eventBroker: EventBroker,
		private userRepository: userRepository
	) {
		super(eventBroker);
	}

	protected async runEvent(event: Event<Partial<User>, unknown>): Promise<User> {
		const param = event.params;
		if (param === undefined) throw new EventError(event, 'User id is not defined', undefined);

		const foundUser = await this.userRepository.getUsers(event);
		if (foundUser.length == 0) throw new UserNotFoundException(event);
		if (foundUser.length > 1) throw new EventError(event, 'Found multiple users')

		return foundUser[0];
	}
}
