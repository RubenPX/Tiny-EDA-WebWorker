import { ContextRoute } from '../shared/Routes/ContextRoute';
import { ErrorCount } from './app/ErrorCount';

import { GetCount } from './app/GetCount';
import { SetCount } from './app/SetCount';

import type { ConterRepository } from './domain/ConterRepository';

export class CounterFeature extends ContextRoute<ConterRepository> {
	protected contextName: string = 'Counter';

	public EventRoutes = {
		GetCount   : GetCount(this.repos),
		SetCount   : SetCount(this.repos),
		ErrorCount : ErrorCount(this.repos)
	} as const;

	constructor(protected repos?: ConterRepository) {
		super();
	}
}
