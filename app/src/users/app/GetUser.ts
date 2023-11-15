import { Event } from '../../Shared/Events/Event';
import { EventRunner } from '../../Shared/Events/EventRunner';
import { LazyLoading } from '../../Shared/cache/LazyLoading';
import { User } from '../domain/User';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import type { userRepository } from '../domain/userRepository';

export class GetUsers extends EventRunner<User[]> {
	private readonly cachedUsersInstance: LazyLoading<User[]>;

	constructor(private readonly userRepository: userRepository) {
		super();
		this.cachedUsersInstance = this.userRepository.getUsersCache();
		this.cachedUsersInstance.onUpdate((data) => this.update(data));
	}

	async run(userID: string): Promise<User> {
		const user: User | undefined = (await this.cachedUsersInstance.getdata()).find((user) => user.id === userID);

		if (user === undefined) {
			throw new UserNotFoundException();
		}

		return user;
	}

	public EventName: string = 'GetUser';
	public async update(event: Event<User[]>): Promise<void> {
		this.notify(event);
	}

	public async runEvent(event: Event<User[]>): Promise<void> {
		this.update(event);
	}
}
