import { ObserverTracking } from "./dom_observer.js";
import type { VNodeElementName, VNodeExtractable } from "./interfaces.js";
import { JCSS, JCSSOptions, JssClass, JssStyle, JSSStyleNames } from "./jss.js";
import { VNode } from "./vnode.js";
declare class StyledNodeManager {
    readonly id: number;
    class: JssClass;
    constructor(id: number);
    /**
     * Returns the generated classname prefixed by vns_
     * which stands for Virtual Node Style -
     */
    getClassName(): string;
}
export declare abstract class StyledVNode<E extends HTMLElement = HTMLElement> extends VNode<E> {
    static managers: Map<typeof VNode, StyledNodeManager>;
    static class_index: number;
    /** Should not be changed */
    private static sheet;
    /** May be overridden by extending the class */
    static styles: Partial<Record<JSSStyleNames, string>> & {
        _: unknown;
    };
    static getConstructor<T extends VNode>(ref: T): typeof VNode;
    static findOrCreate(c: typeof VNode<any>, styles: JCSSOptions | JssStyle): string;
    /**
     * Connects by finding or creating an instance
     */
    static connect(class_ref: VNode, styles: JCSSOptions | JssStyle): void;
    /**
     * Connects if there is an existing instance
     */
    static connect(class_ref: VNode): void;
    static getManager(c: typeof VNode): StyledNodeManager;
    /** Destroys the class and it's relations for a vnode class */
    static destroy(class_ref: VNode): void;
    static init(): void;
    protected static validStyles<S extends Partial<Record<JSSStyleNames, string>>>(styles: S): S & {
        _: unknown;
    };
    constructor(element: VNodeElementName | VNodeExtractable);
    getConstructor(): typeof StyledVNode;
}
export declare class JCSSTracker {
    private instance;
    observer: ObserverTracking;
    callback: () => void;
    constructor(instance: JCSS, observer?: ObserverTracking);
    enable(): void;
    disable(): void;
}
export {};
