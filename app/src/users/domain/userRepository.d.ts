import { LazyLoading } from '../../Shared/cache/LazyLoading';
import { User } from './User';

export interface userRepository {
	getUsers(criteria?: Partial<User>): Promise<User[]>;

	setUser(data: User): Promise<User>;
}
