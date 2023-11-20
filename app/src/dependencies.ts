// Repositories

import { EventBroker } from './Shared/Events/EventBroker';
import { GetUser } from './users/app/GetUser';
import { InCodeUserRepository } from './users/infrastructure/inCodeUserRepository';

const eventBroker: EventBroker = new EventBroker();

const repositories = {
	userRepository: new InCodeUserRepository()
};

// Event routes
export const eventMethods = [
	// Clients
	new GetUser(eventBroker, repositories.userRepository)
];
