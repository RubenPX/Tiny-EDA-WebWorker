import { cachedPromise } from "../../Shared/cache/LazyLoading";
import { Observable } from "../../Shared/Events/Observable";
import type { userRepository } from "../domain/userRepository";

class GetUsers extends Observable<User[]> {
	private readonly cachedUsersInstance: cachedPromise<User[]>;

	constructor(private readonly userRepository: userRepository) {
		super();
		this.cachedUsersInstance = this.userRepository.getUsersCache();
		this.cachedUsersInstance.onUpdate((data) => this.notify(data));
	}

	async run() {
		const users: User[] = await this.cachedUsersInstance.getdata();

		// Return first initialized
		return users;
	}
}
