import { LazyLoading } from '../../Shared/cache/LazyLoading';
import { User } from './User';

export interface userRepository {
	getUsers(): User[];
	getUser(): User;

	onUsersUpdate(hander: (data: User[]) => {});
}
