import { EventRunner } from '../../shared/Routes/EventRunner';
import { ConterRepository } from '../domain/ConterRepository';

export const SetCount = EventRunner.prepareEvent<number, number, ConterRepository>(async(repo, params) => {
	if (typeof params !== 'number') throw new Error('Required param number');
	const newNumber = await repo.set(params);
	return newNumber;
});
