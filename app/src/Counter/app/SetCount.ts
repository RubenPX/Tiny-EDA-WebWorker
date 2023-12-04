import { EventRunner } from '../../shared/Routes/EventRunner';
import { ConterRepository } from '../domain/ConterRepository';

export const SetCount = EventRunner.prepareEvent<number, {value: number}, ConterRepository>(async(repo, params) => {
	if (typeof params?.value !== 'number') throw new Error('Required param number');
	return repo.set(params.value);
});
