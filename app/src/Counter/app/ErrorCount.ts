import { EventRunner } from '../../shared/Routes/EventRunner';
import { ConterRepository } from '../domain/ConterRepository';

export const ErrorCount = EventRunner.prepareEvent<number, undefined, ConterRepository>(async(repo) => {
	throw new Error('this is an intetional error');
});
