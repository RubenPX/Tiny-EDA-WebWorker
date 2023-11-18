import { LazyLoading } from '../../Shared/cache/LazyLoading';
import { User } from './User';

export interface userRepository {
	getUsers(): Promise<User[]>;
	getUser(id: string): Promise<User | null>;

	onUsersUpdate(hander: (data: User[]) => {});
}
