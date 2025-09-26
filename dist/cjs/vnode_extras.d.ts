import type { StyleDeclaration, VNodeAnimationOptions, VNodeStyleDeclarationWithProps } from "./interfaces.js";
import type { VNode } from "./vnode.js";
declare class VNodeAnimation<T extends VNode> {
    private node;
    animation: Animation;
    constructor(node: T, styles: StyleDeclaration[], options: VNodeAnimationOptions);
}
declare class VNodeUtilityClass<T extends VNode = VNode> {
    node: T;
    constructor(node: T);
    nest(run: (arg0: this) => void): this["node"];
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
    toggleClass(class_name: string, status?: boolean): this;
}
export declare class VNodeEvents<T extends VNode> extends VNodeUtilityClass<T> {
    private static reserved_events;
    private static stored_listeners;
    private static weak_events;
    private static getEvents;
    private static getCallbacksGroup;
    static on(element: HTMLElement, event: string, callback: Function): void;
    static off(element: HTMLElement, event: string, callback?: Function): void;
    static once(element: HTMLElement, event: string, callback: Function): void;
    element: HTMLElement;
    constructor(node: T);
    call(...args: Parameters<VNodeEvents<this["node"]>["nest"]>): this["node"];
    on(event: string, callback: Function): this;
    off(event: string, callback?: Function): this;
    once(event: string, callback: Function): this;
}
export {};
