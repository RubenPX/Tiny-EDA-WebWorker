import { EventRunner } from '../../shared/Routes/EventRunner';
import { ConterRepository } from '../domain/ConterRepository';

export const GetCount = EventRunner.prepareEvent<number, undefined, ConterRepository>(async(repo) => {
	return repo.get();
});
