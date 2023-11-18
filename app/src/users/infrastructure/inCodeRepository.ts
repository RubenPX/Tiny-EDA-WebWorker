import { User } from '../domain/User';
import { userRepository } from '../domain/userRepository';

const users = [
	new User('1', 'Ruben', 0),
	new User('2', 'Dario', 0),
	new User('3', 'Begoña', 0),
	new User('4', 'Javier', 0),
	new User('5', 'Julen', 0)
];

export class InCodeUserRepository implements userRepository {
	async getUsers(): Promise<User[]> {
		return users;
	}

	async getUser(id: string): Promise<User | null> {
		const foundUser = users.find(user => user.id === id);
		return foundUser ?? null;
	}

	onUsersUpdate(handler: (data: User[]) => {}) {
		// Don't do nothing because this is not reactive for now
	}
}
