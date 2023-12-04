import { EventRunner } from './EventRunner';

export abstract class ContextRoute {
    public abstract EventRoutes: { [key: string]: EventRunner }
}
