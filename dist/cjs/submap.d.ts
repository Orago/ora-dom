type EmitterEvents = Record<string, any>;
type Evt<K, Strict extends boolean> = Strict extends true ? keyof K : keyof K | (string & {});
type CallbackEmit<T extends EmitterEvents, K> = K extends keyof T ? T[K] : any[];
export declare class SubMap<T extends EmitterEvents & {} = {}, Strict extends boolean = false> {
    readonly all: Map<Evt<T, Strict>, any[]>;
    get<K extends Evt<T, Strict>>(event: K): any[];
    add<K extends Evt<T, Strict>>(event: K, ...items: CallbackEmit<T, K>): this;
    remove<K extends Evt<T, Strict>>(event: K, ...items: [CallbackEmit<T, K>[0], ...CallbackEmit<T, K>[]]): this;
    removeAll<K extends Evt<T, Strict>>(event: K): this;
}
export {};
