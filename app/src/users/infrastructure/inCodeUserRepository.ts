import { User } from '../domain/User';
import { userRepository } from '../domain/userRepository';

const users = [
	new User({ id: '1', name: 'Ruben', count: 0 }),
	new User({ id: '2', name: 'Dario', count: 0 }),
	new User({ id: '3', name: 'Begoña', count: 0 }),
	new User({ id: '4', name: 'Javier', count: 0 }),
	new User({ id: '5', name: 'Julen', count: 0 })
];

export class InCodeUserRepository implements userRepository {
	async getUsers(criteria?: Partial<User>): Promise<User[]> {
		if (criteria == null) return users;

		return users.filter(user => {
			if (criteria.id && criteria.id !== user.id) return false;
			if (criteria.name && criteria.name !== user.name) return false;
			if (criteria.count && criteria.count !== user.count) return false;

			return true;
		})
	}

	async setUser(user: Partial<User>): Promise<User> {
		let foundUserIndex = users.findIndex(u => u.id === user.id);
		if (foundUserIndex === -1) {
			// get all params
			let { id, name, count } = user;

			// Specify params
			id = (users.length + 1) + '';
			if (name == undefined) throw new Error('Required Name to ')
			if (count == null) count = 0;

			// Create new user & return new user
			let newUser = new User({ id, name, count });
			users.push(newUser);
			return newUser;
		} else {
			// Modify user
			let modifiedUser = { ...users[foundUserIndex], ...user }
			users[foundUserIndex] = modifiedUser;
			return modifiedUser;
		};
	}
}
