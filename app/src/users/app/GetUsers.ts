import { EventBroker } from '../../Shared/Events/EventBroker';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { Event } from '../../Shared/Events/Events/Event';
import { EventUpdate } from '../../Shared/Events/Events/EventUpdate';
import { User } from '../domain/User';
import type { userRepository } from '../domain/userRepository';

class GetUsers extends EventRunner<User[]> {
	public eventName: string = 'GetUsers';

	constructor(broker: EventBroker, private readonly userRepository: userRepository) {
		super(broker);
	}

	run(event: Event | EventUpdate): Promise<User[]> {
		throw new Error('Method not implemented.');
	}
}
