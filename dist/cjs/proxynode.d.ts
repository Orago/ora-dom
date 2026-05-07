import Emitter from "@orago/lib/emitter";
import type { DomAnimationOptionsOld, StyleDeclaration, StyleDeclarationWithProps, VNodeListeners } from "./interfaces.js";
import { VNodeExtractEl } from "./utilities.js";
import { VNode } from "./vnode.js";
type PN_Extractable = ProxyNode | VNode | HTMLElement;
type ProxyNodeEvents = {
    append: () => void;
    remove: () => void;
};
/**
 * Record<element_tag: string, proxy_node: ProxyNode>;
 */
type NewNode = Record<string, ProxyNode>;
export declare class ProxynodeTracking {
    static inDom(element: HTMLElement): boolean;
    static handle(element: HTMLElement): void;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    constructor();
}
export declare class ProxyNode {
    private static stored_listeners;
    private static weak_events;
    static tracking: ProxynodeTracking;
    static getEvents(element: HTMLElement): Emitter<ProxyNodeEvents>;
    static extractEl: typeof VNodeExtractEl;
    static isNode(el: ProxyNode | any): boolean;
    private static getCallbacksGroup;
    private static getListeners;
    element: HTMLElement;
    listeners: VNodeListeners;
    constructor(el: Element | string | ProxyNode);
    get focused(): boolean;
    get childFocused(): boolean;
    get bounds(): DOMRect;
    get parent(): ProxyNode | undefined;
    get value(): string;
    set value(value: string);
    /** @deprecated - removed in the next version */
    get wrapper(): this["ref"];
    ref(run: (arg0: this) => void): this;
    text(content: string): this;
    id(value: string): this;
    attr(attributes?: {
        [attribute: string]: string | number;
    }): this;
    swap(node: this | HTMLElement): this;
    /**
     * Creates a cloned node
     */
    clone(): ProxyNode;
    /**
     * Clears inner content
     */
    clear(): this;
    /**
     * Checks if dom contains element
     */
    exists(): boolean;
    /**
     * Returns a list of child proxy nodes
     */
    getChildren(): ProxyNode[];
    /**
     *
     * @param to_reset
     * @returns
     * @deprecated - Possibly removed in the next version
     */
    reset(...to_reset: ("content" | "style" | "class")[]): this;
    class(...args: string[]): this;
    hasClass(className: string): boolean;
    addClass(...args: string[]): this;
    removeClass(...args: string[]): this;
    toggleClass(className: string, status?: boolean): this;
    styles(styles?: StyleDeclarationWithProps): this;
    removeStyles(...styles: string[]): this;
    getEvents(): Emitter<ProxyNodeEvents, false>;
    on(event: string, callback: Function): this;
    off(event: string, callback?: Function): this;
    once(event: string, callback: Function): this;
    addListener(events: {
        [key: string]: {
            [listener: string]: Function;
        };
    }): this;
    removeListener(key: any): this;
    /**
     *
     * @deprecated - stop using this dumbass
     */
    interval(callback: Function, time?: number, immediate?: boolean): this;
    remove(): this;
    /**
     * clears the content and appends
     */
    setContent(...content: any[]): this;
    append(...objs: (PN_Extractable | false | string | (PN_Extractable | false | string)[])[]): this;
    appendTo(obj: PN_Extractable | false): this;
    prependTo(obj: PN_Extractable): this;
    prepend(...objs: PN_Extractable[]): this;
    focus(): this;
    scroll(x?: number, y?: number): this;
    setTabIndex(index: number): this;
    /**
     * @deprecated - Possibly removed in the next version
     */
    horizontalScrolling(): this;
    animate(styles: Array<StyleDeclaration>, options: number | (KeyframeAnimationOptions & DomAnimationOptionsOld)): this;
}
export declare function generateProxyNode(el: HTMLElement | Element): ProxyNode;
export declare const newNode: NewNode;
export declare function qs(selector: string, element?: HTMLElement | Document): ProxyNode | null;
export declare function qsAll(selector: string, element?: HTMLElement | Document): ProxyNode[];
declare const _default: {
    newNode: NewNode;
    qs: typeof qs;
    generateProxyNode: typeof generateProxyNode;
    fetch: typeof fetch;
};
export default _default;
