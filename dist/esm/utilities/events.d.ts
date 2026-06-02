import { Emitter, Signal, State } from "@orago/lib";
import { SubMap } from "../submap.js";
import { VNodeUtilityClass } from "../vnode_utilities.js";
import type { VNode } from "../vnode.js";
import { ReservedEvents } from "./base_components.js";
export type VNodeEventsT = typeof ReservedEvents;
export type VNodeEventKeys = (keyof HTMLElementEventMap | keyof VNodeEventsT) | (string & {});
type StateValues<T extends readonly State<any>[]> = {
    [K in keyof T]: ReturnType<T[K]["get"]>;
};
export declare class VNodeEventGroup {
    private node;
    map: Map<keyof HTMLElementEventMap, Function>;
    constructor(node: VNode);
    on(event: keyof HTMLElementEventMap, callback: Function): this;
    off(event: keyof HTMLElementEventMap, callback?: Function): this;
    clear(): this;
}
declare class VNodeEventCollection {
    private static reserved_events;
    private static isReserved;
    static on(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, callback: Function): void;
    static off(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, callback?: Function): void;
    static once(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, callback: Function): void;
    static emit(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, ...args: any[]): void;
    static clear(COLLECTION: VNodeEventCollection): void;
    listeners: SubMap<Record<string, any>, true>;
    events: Emitter<VNodeEventsT>;
    readonly element: HTMLElement;
    constructor(ref: HTMLElement);
}
export declare class VNodeEvents<T extends VNode> extends VNodeUtilityClass<T> {
    private static c_events;
    static getAlways(element: HTMLElement): VNodeEventCollection;
    static on(element: HTMLElement, event: VNodeEventKeys, callback: Function): void;
    static off(element: HTMLElement, event: VNodeEventKeys, callback?: Function): void;
    static once(element: HTMLElement, event: VNodeEventKeys, callback: Function): void;
    static emit(element: HTMLElement, event: VNodeEventKeys, ...args: any[]): void;
    static clear(element: HTMLElement): void;
    element: HTMLElement;
    constructor(node: T);
    call(...args: Parameters<VNodeEvents<this["node"]>["nest"]>): this["node"];
    on(event: VNodeEventKeys, callback: Function): this;
    off(event: VNodeEventKeys, callback?: Function): this;
    once(event: VNodeEventKeys, callback: Function): this;
    clear(): void;
    useSignal<const T extends readonly ([Emitter, string[]] | Signal<any> | Emitter)[]>(events: T, callback: (node: this) => void): this;
    useStates<const T extends readonly State<any>[]>(states: T, callback: (values: StateValues<T>, node: this) => void, immediate?: boolean): this;
}
export declare function normalizeEvent(e: Signal<any> | Emitter | [Emitter, string[]]): {
    on(handler: () => void): void;
    off(handler: () => void): void;
}[];
export {};
