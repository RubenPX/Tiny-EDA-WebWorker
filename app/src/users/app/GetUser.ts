import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventError } from '../../Shared/Events/Events/EventError';
import { User } from '../domain/User';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import type { userRepository } from '../domain/userRepository';

export class GetUser extends EventRunner<User, string> {
	public runnerMethod: string = 'GetUsers';

	constructor(
		eventBroker: EventBroker,
		private userRepository: userRepository
	) {
		super(eventBroker);
	}

	protected async runEvent(event: Event<string, unknown>): Promise<User> {
		const param = event.params;
		if (param === undefined) throw new EventError('User id is not defined', undefined, event);

		const foundUser = await this.userRepository.getUser(param);
		if (foundUser === null) throw new UserNotFoundException();

		return foundUser;
	}
}
