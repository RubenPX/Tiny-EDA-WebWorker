import { ConsolePrefix } from './Formatters';
import { isWorker } from '../utils/isWorker';

export class Logger {
	private static voidMethod = () => {};

	// @todo: make this variable dependient if is production or not
	public static readonly production = false;
	public static readonly verbose = {
		worker: {
			showIn  : true,
			showOut : false
		},
		browser: {
			showIn  : false,
			showOut : true
		}
	};

	static get MSGOut() {
		if (!(isWorker || this.verbose.worker.showOut)) return Logger.voidMethod;
		if (!(!isWorker || this.verbose.browser.showOut)) return Logger.voidMethod;

		// Returning this as function it will hide first trace
		return (...data: any) => [...ConsolePrefix.sendMsg, [{ trace: new Error().stack }], ...data];
	}

	static get MSGIn() {
		if (!(isWorker || this.verbose.worker.showIn)) return Logger.voidMethod;
		if (!(!isWorker || this.verbose.browser.showIn)) return Logger.voidMethod;

		// Returning this as function it will hide first trace
		return (...data: any) => [...ConsolePrefix.reciveMsg, ...data];
	}
}
