import { LazyLoading } from '../../Shared/cache/LazyLoading';
import { User } from './User';

export interface userRepository {
	getUsers(): LazyLoading<User[]>;
}
