import { Event } from '../../Shared/Events/Event';
import { EventRunner } from '../../Shared/Events/EventRunner';

export class SetUser extends EventRunner<{userid: string}> {
	public EventName: string = 'SetUser';

	constructor() {
		super();
	}

	public update(event: Event<{ userid: string; }>): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public runEvent(event: Event<{ userid: string; }>): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
