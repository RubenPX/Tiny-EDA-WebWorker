import { EventBroker } from './Shared/Events/EventBroker';
import { GetUser } from './users/app/GetUser';
import { InCodeUserRepository } from './users/infrastructure/inCodeUserRepository';

// Repositories
export const repositories = () => ({
	userRepository: new InCodeUserRepository()
}) as const;

// Event routes
export const events = (eb: EventBroker, repo: ReturnType<typeof repositories>) => ([
	// Clients
	new GetUser(eb, repo.userRepository)
]);
