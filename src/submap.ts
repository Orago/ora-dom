type EmitterEvents = Record<string, any>;
type Evt<K, Strict extends boolean> = Strict extends true
	? keyof K
	: keyof K | (string & {});
type CallbackEmit<T extends EmitterEvents, K> = K extends keyof T
	? T[K]
	: any[];

export class SubMap<
	T extends EmitterEvents & {} = {},
	Strict extends boolean = false
> {
	public readonly all: Map<Evt<T, Strict>, any[]> = new Map();

	public get<K extends Evt<T, Strict>>(event: K) {
		return this.all.get(event) ?? [];
	}

	public add<K extends Evt<T, Strict>>(
		event: K,
		...items: CallbackEmit<T, K>
	): this {
		let list = this.all.get(event);

		if (list) {
			list.push(
				...(items.filter((e: any) => list?.includes(e) != true) as any)
			);
		} else {
			this.all.set(event, [...items]);
		}

		return this;
	}

	public remove<K extends Evt<T, Strict>>(
		event: K,
		...items: [CallbackEmit<T, K>[0], ...CallbackEmit<T, K>[]]
	): this {
		const list = this.all.get(event);

		if (list) {
			for (const item of items) {
				const index = list.indexOf(item);

				if (index !== -1) {
					list.splice(index, 1);
				}
			}
		}

		return this;
	}

	public removeAll<K extends Evt<T, Strict>>(event: K): this {
		this.all.delete(event);

		return this;
	}
}
