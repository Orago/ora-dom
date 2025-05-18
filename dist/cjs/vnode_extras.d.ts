import type { StyleDeclaration, VNodeAnimationOptions, VNodeStyleDeclarationWithProps } from "./interfaces.js";
import type { VNode } from "./vnode.js";
export declare function valueTrap<OBJ extends any, P extends keyof OBJ>(obj: OBJ, property: P, callback: () => OBJ[P]): void;
declare class VNodeAnimation<T extends VNode> {
    private node;
    animation: Animation;
    constructor(node: T, styles: StyleDeclaration[], options: VNodeAnimationOptions);
}
declare class VNodeUtilityClass {
    node: VNode;
    constructor(node: VNode);
    nest(run: (arg0: this) => void): this["node"];
}
export declare class VNodeStyle extends VNodeUtilityClass {
    update(styles?: VNodeStyleDeclarationWithProps): this;
    remove(...styles: string[]): this;
    animate(styles: VNodeStyleDeclarationWithProps[], options: VNodeAnimationOptions): VNodeAnimation<VNode>;
}
export declare class VNodeClasses extends VNodeUtilityClass {
    static addClasses(element: HTMLElement, args: string[]): void;
    static removeClasses(element: HTMLElement, args: string[]): void;
    has(class_name: string): boolean;
    add(...classes: string[]): this;
    remove(...classes: string[]): this;
    set(...classes: string[]): this;
    toggleClass(class_name: string, status?: boolean): this;
}
export declare class VNodeEvents extends VNodeUtilityClass {
    private static reserved_events;
    private static stored_listeners;
    private static weak_events;
    private static getEvents;
    private static getCallbacksGroup;
    static on(element: HTMLElement, event: string, callback: Function): void;
    static off(element: HTMLElement, event: string, callback?: Function): void;
    static once(element: HTMLElement, event: string, callback: Function): void;
    element: HTMLElement;
    constructor(node: VNode);
    on(event: string, callback: Function): this;
    off(event: string, callback?: Function): this;
    once(event: string, callback: Function): this;
}
export {};
