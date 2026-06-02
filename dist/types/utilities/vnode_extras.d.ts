import { Emitter } from "@orago/lib";
import type { StyleDeclaration, VNodeAnimationOptions, VNodeStyleDeclarationWithProps } from "../interfaces.js";
import { SubMap } from "../submap.js";
import { VNodeUtilityClass } from "../vnode_utilities.js";
import type { VNode } from "../vnode.js";
import { VNodeEventKeys, VNodeEventsT } from "./events.js";
declare class VNodeAnimation<T extends VNode> {
    private node;
    animation: Animation;
    constructor(node: T, styles: StyleDeclaration[], options: VNodeAnimationOptions);
}
export declare class VNodeStyle<T extends VNode> extends VNodeUtilityClass<T> {
    call(styles: VNodeStyleDeclarationWithProps): T;
    call(value: (arg0: this) => void): T;
    update(styles?: VNodeStyleDeclarationWithProps): this;
    remove(...styles: string[]): this;
    animate(styles: VNodeStyleDeclarationWithProps[], options: VNodeAnimationOptions): VNodeAnimation<T>;
}
export declare class VNodeClasses<T extends VNode> extends VNodeUtilityClass<T> {
    static addClasses(element: HTMLElement, args: string[]): void;
    static removeClasses(element: HTMLElement, args: string[]): void;
    call(...classes: string[]): T;
    call(nest: (arg0: this) => void): T;
    has(class_name: string): boolean;
    add(...classes: string[]): this;
    remove(...classes: string[]): this;
    set(...classes: string[]): this;
    toggle(class_name: string, status?: boolean): this;
    /**
     * @deprecated
     */
    toggleClass(class_name: string, status?: boolean): this;
}
declare class VNodeEventCollection {
    readonly element: HTMLElement;
    private static reserved_events;
    private static isReserved;
    static on(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, callback: Function): void;
    static off(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, callback?: Function): void;
    static once(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, callback: Function): void;
    static emit(COLLECTION: VNodeEventCollection, event: VNodeEventKeys, ...args: any[]): void;
    static clear(COLLECTION: VNodeEventCollection): void;
    readonly listeners: SubMap<Record<string, any>, true>;
    events: Emitter<VNodeEventsT>;
    constructor(element: HTMLElement);
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
    nest(run: ((arg0: this) => void) | [event: VNodeEventKeys, callback: Function][]): this["node"];
    call(...args: Parameters<VNodeEvents<this["node"]>["nest"]>): this["node"];
    on(event: VNodeEventKeys, callback: Function): this;
    off(event: VNodeEventKeys, callback?: Function): this;
    once(event: VNodeEventKeys, callback: Function): this;
    clear(): void;
}
export {};
