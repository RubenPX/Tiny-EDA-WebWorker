import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventReturn } from '../../Shared/Events/Events/EventReturn';
import { EventUpdate } from '../../Shared/Events/Events/EventUpdate';
import type { userRepository } from '../domain/userRepository';

export class GetUsers extends EventRunner {
	public eventName: string = 'GetUsers';

	constructor(broker: EventBroker, private readonly userRepository: userRepository) {
		super(broker);
		userRepository.onUsersUpdate(() => this.run());
	}

	run(event?: Event | EventUpdate): Promise<EventReturn | undefined> {
		throw new Error('Method not implemented.');
	}
}
