import { Emitter } from "@orago/lib";
import { SubMap } from "../submap.js";
import { VNodeUtilityClass } from "../utilities.js";
import type { VNode } from "../vnode.js";
type VNodeEventsT = {
    "dom-append": () => void;
    "dom-remove": () => void;
};
type VNodeEventKeys = (keyof HTMLElementEventMap | keyof VNodeEventsT) & (string | {});
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
}
export {};
