import { Emitter, makeCallableClass } from '@orago/lib';
import Emitter$1 from '@orago/lib/emitter';

type ObservedCallback = () => void;
declare class ObserverTracking {
    private static inDom;
    static handle(element: HTMLElement): void;
    private static getEvents;
    private static weak_events;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    events: Emitter<{
        append: ObservedCallback;
        remove: ObservedCallback;
        any: () => void;
    }, true>;
    constructor();
    private cleanupElement;
    on(element: HTMLElement, event: "append" | "remove", callback: ObservedCallback): this;
    off(element: HTMLElement, event: "append" | "remove", callback?: ObservedCallback): this;
    once(element: HTMLElement, event: "append" | "remove", callback: ObservedCallback): this;
}

declare class VNode<E extends HTMLElement = HTMLElement> {
    static Util: {
        new (): {};
        qs(selector: string, element?: HTMLElement | Document): VNode | null;
        qsAll(selector: string, element?: HTMLElement | Document): VNode[];
        extractEl: typeof VNodeExtractEl;
        getChildren(extractable: VNodeExtractable): VNode[];
    };
    static indexing: Map<any, any>;
    /**
     * Replacement for 'newNode' on ProxyNode Utilities
     */
    static new: Record<VNodeElementName, VNode>;
    static getElement<T extends VNodeElementName | VNodeExtractable>(el: T): ResolveElement<T>;
    static from<T extends VNodeElementName | VNodeExtractable>(el: T): VNode<ResolveElement<T>>;
    /**
     * @deprecated Use VNode.Util.extractEl
     */
    static extractEl: typeof VNodeExtractEl;
    static send_events: boolean;
    static events: Emitter<{
        init: (node: VNode) => void;
        /**
         * Do not rely on this
         * @deprecated
         * @param node
         * @returns
         */
        add: (node: VNode) => void;
        /**
         * Do not rely on this
         * @deprecated
         * @param node
         * @returns
         */
        remove: (node: VNode) => void;
    }, true>;
    element: ResolveElement<E>;
    /**
     * Styling manager
     */
    style: ReturnType<typeof makeCallableClass<typeof VNodeStyle<this>>>;
    /**
     * Class manager
     */
    class: ReturnType<typeof makeCallableClass<typeof VNodeClasses<this>>>;
    /**
     * Event manager
     */
    events: ReturnType<typeof makeCallableClass<typeof VNodeEvents<this>>>;
    constructor(element: VNodeElementName | VNodeExtractable);
    attr(attributes?: Record<string, string | number>): this;
    swap(node: VNodeExtractable): this;
    id(value: string): this;
    id(value: undefined): string;
    append(...objs: VNodeAppendable): this;
    prepend(...objs: VNodeAppendable): this;
    appendTo(obj: VNodeExtractable | false, direction?: "append" | "prepend"): this;
    getBounds(): DOMRect;
    value(): any;
    value(value: string | number): this;
    focus(): this;
    ref(run: (arg0: this) => void): this;
    remove(): this;
    setContent(...content: any[]): this;
    /**
     * Clears inner content
     */
    clear(): this;
    inDom(parent?: HTMLElement): boolean;
    scroll(x?: number, y?: number): this;
}

declare function VNodeExtractEl(node: VNodeExtractable): HTMLElement;

type PN_Extractable = ProxyNode | VNode | HTMLElement;
type ProxyNodeEvents = {
    append: () => void;
    remove: () => void;
};
/**
 * Record<element_tag: string, proxy_node: ProxyNode>;
 */
type NewNode = Record<string, ProxyNode>;
declare class ProxynodeTracking {
    static inDom(element: HTMLElement): boolean;
    static handle(element: HTMLElement): void;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    constructor();
}
declare class ProxyNode {
    private static stored_listeners;
    private static weak_events;
    static tracking: ProxynodeTracking;
    static getEvents(element: HTMLElement): Emitter$1<ProxyNodeEvents>;
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
    getEvents(): Emitter$1<ProxyNodeEvents, false>;
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
declare function generateProxyNode(el: HTMLElement | Element): ProxyNode;
declare const newNode: NewNode;
declare function qs(selector: string, element?: HTMLElement | Document): ProxyNode | null;
declare function qsAll(selector: string, element?: HTMLElement | Document): ProxyNode[];
declare const _default: {
    newNode: NewNode;
    qs: typeof qs;
    generateProxyNode: typeof generateProxyNode;
    fetch: typeof fetch;
};

type StyleDeclaration = Partial<Record<keyof CSSStyleDeclaration, string | number>> & object;
type StyleDeclarationWithProps = StyleDeclaration & {
    props?: Record<string, string | number>;
};
interface DomAnimationOptionsOld {
    save?: boolean;
    onFinish?: (this: Animation, ev?: Event) => any;
    onCancel?: (this: Animation, ev?: Event) => any;
    onRemove?: (this: Animation, ev?: Event) => any;
    animationReference?: (param0: Animation) => void;
}
/**
 * Record<listener: string, ReturnType<Function["bind"]>>
 */
type Kuh = Record<string, ReturnType<Function["bind"]>>;
/**
 * Record<key: string, Kuh>
 */
type VNodeListeners = Record<string, Kuh>;
type VNodeExtractable = HTMLElement | VNode | ProxyNode;
type VNodeAppendable = (VNodeExtractable | false | string | (VNodeExtractable | false | string)[])[];
type VNodeElementName = keyof HTMLElementTagNameMap | (string & {});
type ResolveElement<Input extends VNodeElementName | VNodeExtractable> = Input extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Input] : Input extends HTMLElement ? Input : Input extends VNode ? Input["element"] : HTMLElement;

type JSSStyleNames = keyof CSSStyleDeclaration | `--${string}`;
type StyleOptions = Partial<Record<JSSStyleNames, string>>;
type JCSSOptions = StyleOptions & {
    extend?: Record<`:${string}` | string, StyleOptions>;
};
declare class JssStyle {
    static parseContents(data: Partial<Record<JSSStyleNames, string>>): string[];
    data: JCSSOptions;
    constructor(data: JssClass["data"]);
    protected resolve(name: string, data: StyleOptions): string;
    toString(name: string): string;
}
declare class JssClass extends JssStyle {
    static parseContents(data: Partial<Record<JSSStyleNames, string>>): string[];
    name: string;
    constructor(name: JssClass["name"], data: JssClass["data"]);
    protected resolve(name: string, data: StyleOptions): string;
    toString(): string;
}
type AnimationPosition = `${number}%` | "from" | "to";
declare class JssAnimation {
    name: string;
    data: [
        position: AnimationPosition | AnimationPosition[],
        contents: Partial<Record<JSSStyleNames, string>>
    ][];
    constructor(name: JssAnimation["name"], data: JssAnimation["data"]);
    toString(): string;
}
declare class JCSSStyleManager {
    manager: JCSS;
    private counter;
    private readonly indexes;
    readonly list: Map<JssClass["name"], JssClass>;
    constructor(manager: JCSS);
    call(run: (arg0: this) => void): this["manager"];
    has(name: JssClass["name"]): boolean;
    inject(instance: JssClass): void;
    add(name: JssClass["name"], style: JssClass["data"]): this;
    remove(instance: JssClass): boolean;
    removeByName(name: JssClass["name"]): boolean;
}
declare class JCSSAnimationManager {
    manager: JCSS;
    private counter;
    private readonly indexes;
    readonly list: Map<JssAnimation["name"], JssAnimation>;
    constructor(manager: JCSS);
    call(run: (arg0: this) => void): this["manager"];
    has(name: JssAnimation["name"]): boolean;
    inject(instance: JssAnimation): void;
    add(name: JssAnimation["name"], style: JssAnimation["data"]): this;
    remove(instance: JssAnimation): boolean;
    removeByName(name: JssAnimation["name"]): boolean;
}
declare class JCSS {
    element: HTMLStyleElement;
    style: ((run: (arg0: JCSSStyleManager) => void) => JCSS) & JCSSStyleManager;
    animation: ((run: (arg0: JCSSAnimationManager) => void) => JCSS) & JCSSAnimationManager;
    inserted_state: boolean;
    insert(): this;
    remove(): this;
    /**
     * @deprecated
     */
    rebuild(): this;
    build(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}

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
declare abstract class StyledVNode<E extends HTMLElement = HTMLElement> extends VNode<E> {
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
declare class JCSSTracker {
    private instance;
    observer: ObserverTracking;
    callback: () => void;
    constructor(instance: JCSS, observer?: ObserverTracking);
    enable(): void;
    disable(): void;
}

declare class VNodeObserver {
    private inDom;
    private tracked_in_dom;
    observer: MutationObserver;
    constructor();
}
declare class StateTracking {
    static flag: string;
    static ref_prop: string;
    static initNodeTracking(node: VNode): void;
    static init(options?: {
        all?: boolean;
    }): {
        observer: VNodeObserver;
        destroy(): void;
    };
    static filterQuery(list: any[]): VNode[];
    static query(): VNode[];
}

declare class VNodeEventGroup {
    private node;
    map: Map<keyof HTMLElementEventMap, Function>;
    constructor(node: VNode);
    on(event: keyof HTMLElementEventMap, callback: Function): this;
    off(event: keyof HTMLElementEventMap, callback?: Function): this;
    clear(): this;
}

declare class Fullscreen {
    static exitFullscreen(): void;
    static isFullscreen(element: HTMLElement): boolean;
    static enterFullscreen(element: HTMLElement): HTMLElement;
}
declare class PictureApi {
    static createWindow(options?: {
        width?: number;
        height?: number;
    }): Promise<Window | undefined>;
    static createPictureWindow(options?: {
        width?: number;
        height?: number;
    }): Promise<Window | undefined>;
    static cloneWindowStyles(from: Window, to: Window): void;
}

declare namespace experimental {
  export {
  };
}

export { experimental as Experimental, Fullscreen, JCSS, JCSSTracker, JssAnimation, JssClass, JssStyle, ObserverTracking, PictureApi as Picture, ProxyNode, StateTracking, StyledVNode, VNode, VNodeEventGroup, _default as default, generateProxyNode, newNode, qs, qsAll };
export type { StyleDeclaration, StyleDeclarationWithProps };
