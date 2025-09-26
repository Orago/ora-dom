import { Emitter, makeCallableClass } from '@orago/lib';
import Emitter$1 from '@orago/lib/emitter';

type ObservedCallback = () => void;
declare class ObserverTracking {
    private static inDom;
    static handle(element: HTMLElement): void;
    private static getEvents;
    private static weak_events;
    private static tracked_in_dom;
    private wrap_map;
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

declare class VNode {
    static Util: {
        new (): {};
        qs(selector: string, element?: HTMLElement | Document): VNode | null;
        qsAll(selector: string, element?: HTMLElement | Document): VNode[];
        extractEl: typeof VNodeExtractEl;
        getChildren(extractable: VNodeExtractable): VNode[];
    };
    static indexing: Map<any, any>;
    static new: Record<string, VNode>;
    static from(el: Element | string | VNode | ProxyNode): VNode;
    static extractEl: typeof VNodeExtractEl;
    static send_events: boolean;
    static events: Emitter<{
        create: (node: VNode) => void;
        remove: (node: VNode) => void;
    }, true>;
    element: HTMLElement;
    style: ReturnType<typeof makeCallableClass<typeof VNodeStyle<this>>>;
    class: ReturnType<typeof makeCallableClass<typeof VNodeClasses<this>>>;
    events: ReturnType<typeof makeCallableClass<typeof VNodeEvents<this>>>;
    constructor(element: keyof HTMLElementTagNameMap | (string & {}) | VNodeExtractable);
    attr(attributes?: Record<string, string | number>): this;
    swap(node: VNodeExtractable): this;
    id(value: string): this;
    id(value: undefined): string;
    append(...objs: VNodeAppendable): this;
    prepend(...objs: VNodeAppendable): this;
    appendTo(obj: VNodeExtractable | false, direction?: "append" | "prepend"): this;
    getBounds(): DOMRect;
    value(): string;
    value(value: string | number): this;
    focus(): this;
    ref(run: (arg0: this) => void): this;
    remove(): this;
    setContent(...content: any[]): this;
    clear(): this;
    setStyles(styles: StyleDeclarationWithProps): this;
    setClasses(...classes: string[]): this;
    inDom(parent?: HTMLElement): boolean;
    scroll(x?: number, y?: number): this;
}

declare function VNodeExtractEl(node: VNodeExtractable): HTMLElement;

type PN_Extractable = ProxyNode | VNode | HTMLElement;
type ProxyNodeEvents = {
    append: () => void;
    remove: () => void;
};
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
    get wrapper(): this["ref"];
    ref(run: (arg0: this) => void): this;
    text(content: string): this;
    id(value: string): this;
    attr(attributes?: {
        [attribute: string]: string | number;
    }): this;
    swap(node: this | HTMLElement): this;
    clone(): ProxyNode;
    clear(): this;
    exists(): boolean;
    getChildren(): ProxyNode[];
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
    interval(callback: Function, time?: number, immediate?: boolean): this;
    remove(): this;
    setContent(...content: any[]): this;
    append(...objs: (PN_Extractable | false | string | (PN_Extractable | false | string)[])[]): this;
    appendTo(obj: PN_Extractable | false): this;
    prependTo(obj: PN_Extractable): this;
    prepend(...objs: PN_Extractable[]): this;
    focus(): this;
    scroll(x?: number, y?: number): this;
    setTabIndex(index: number): this;
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
type Kuh = Record<string, ReturnType<Function["bind"]>>;
type VNodeListeners = Record<string, Kuh>;
type VNodeExtractable = HTMLElement | VNode | ProxyNode;
type VNodeAppendable = (VNodeExtractable | false | string | (VNodeExtractable | false | string)[])[];

type Dec = keyof CSSStyleDeclaration | `--${string}`;
declare class JssClass {
    static parseContents(data: Partial<Record<Dec, string>>): string[];
    name: string;
    data: Partial<Record<Dec, string>>;
    constructor(name: JssClass["name"], data: JssClass["data"]);
    toString(): string;
}
type AnimationPosition = `${number}%` | "from" | "to";
declare class JssAnimation {
    name: string;
    data: [
        position: AnimationPosition | AnimationPosition[],
        contents: Partial<Record<Dec, string>>
    ][];
    constructor(name: JssAnimation["name"], data: JssAnimation["data"]);
    toString(): string;
}
declare class JCSSClassManager {
    manager: JCSS;
    private counter;
    private readonly indexes;
    readonly list: Map<JssClass["name"], JssClass>;
    constructor(manager: JCSS);
    call(run: (arg0: this) => void): this;
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
    call(run: (arg0: this) => void): this;
    has(name: JssAnimation["name"]): boolean;
    inject(instance: JssAnimation): void;
    add(name: JssAnimation["name"], style: JssAnimation["data"]): this;
    remove(instance: JssAnimation): boolean;
    removeByName(name: JssAnimation["name"]): boolean;
}
declare class JCSS {
    element: HTMLStyleElement;
    style: ((run: (arg0: JCSSClassManager) => void) => JCSSClassManager) & JCSSClassManager;
    animation: ((run: (arg0: JCSSAnimationManager) => void) => JCSSAnimationManager) & JCSSAnimationManager;
    inserted_state: boolean;
    insert(): this;
    remove(): this;
    rebuild(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}

declare class StyledVNode extends VNode {
    private instance;
    constructor(type: keyof HTMLElementTagNameMap, instance: JCSS);
    appendTo(obj: VNodeExtractable | false, direction?: "append" | "prepend"): this;
    remove(): this;
}
declare class JCSSTracker {
    private instance;
    observer: ObserverTracking;
    callback: () => void;
    constructor(instance: JCSS, observer?: ObserverTracking);
    enable(): void;
    disable(): void;
}

export { JCSS, JCSSTracker, ObserverTracking, ProxyNode, StyledVNode, VNode, _default as default, generateProxyNode, newNode, qs, qsAll };
export type { StyleDeclaration, StyleDeclarationWithProps };
