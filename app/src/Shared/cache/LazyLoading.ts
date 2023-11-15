/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable array-callback-return */

export abstract class LazyLoading<T> {
	generatePromise: () => Promise<T>;

	public awaitedData: T | undefined = undefined;
	public actualPromise: Promise<T> | undefined;

	private readonly handlers: ((data: T, instance: this) => void)[] = [];

	constructor(promise: () => Promise<T>, private readonly id: string, private readonly dataDTO: string) {
		this.generatePromise = promise;
		console.log(['LazyFetch', 'INSTANCED', dataDTO, id]);
		this.handlers = [];
		this.handlers.push(() => console.log(['LazyFetch', 'UPDATE', this.dataDTO]));
	}

	public onUpdate(handler: (data: T, instance: this) => void): this {
		this.handlers.push(handler);
		return this;
	}

	private doUpdate(data: T) {
		this.awaitedData = data;
		this.handlers.forEach((cb) => cb(data, this));
	}

	public async getdata(forceUpdate: boolean = false): Promise<T> {
		if (this.actualPromise === undefined || forceUpdate) this.actualPromise = this.fetchData();
		return this.awaitedData ?? this.actualPromise;
	}

	private async fetchData(): Promise<T> {
		console.log(['LazyFetch', 'FETCH', this.dataDTO], { fromNull: this.actualPromise === undefined });

		const promData = await this.generatePromise();
		this.doUpdate(promData);

		return promData;
	}

	public runUpdate = async() => this.setData(await this.getdata());
	public setData: (data: T) => void = (data: T) => this.doUpdate(data);
	public forceRun: () => void = () => this.fetchData();
}
