import { Emitter as Emitter$1, makeCallableClass } from '@orago/lib';
import Emitter from '@orago/lib/emitter';

declare class VNodeUtilities {
    static flattenContents(contents: VNodeChildList): (VNodeExtractable | string)[];
    static flattenElements(contents: VNodeChildList): HTMLElement[];
    static injectItems<T extends HTMLElement>(node: T, direction: "append" | "prepend" | undefined, objs: VNodeChildList): void;
    static setAttributes<T extends HTMLElement>(element: T, attributes?: Record<string, string | number | undefined>): void;
    static setStyles(element: HTMLElement, styles?: VNodeStyleDeclarationWithProps): void;
    static removeStyles(element: HTMLElement, styles: string[]): void;
    static formatAttributeName(as: "kebab" | "camel", text: string): string;
    static elementTextFind(options: Exclude<VNodeWhereOptions["text"], undefined>, dict: [string, any][]): [string, any][];
    static whereString(options: VNodeWhereOptions): string;
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
/**
 * @deprecated
 */
declare class ProxynodeTracking {
    static inDom(element: HTMLElement): boolean;
    static handle(element: HTMLElement): void;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    constructor();
}
/**
 * @deprecated
 */
declare class ProxyNode {
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
type VNodeStyleDeclarationWithProps = StyleDeclaration & {
    variables?: Record<string, string | number>;
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
/**
 * Of which an html element can be resolved
 */
type VNodeExtractable = HTMLElement | VNode | ProxyNode;
type VNodeChild = Node | string | number | boolean | null | undefined | VNodeExtractable;
type VNodeChildList = (VNodeChild | VNodeChild[])[];
type VNodeElementName = keyof HTMLElementTagNameMap | (string & {});
type ResolveElement<Input extends VNodeElementName | VNodeExtractable> = Input extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Input] : Input extends HTMLElement ? Input : Input extends VNode ? Input["element"] : HTMLElement;
interface VNodeWhereOptions {
    id?: string;
    classes?: string[];
    data?: Record<string, string>;
    attributes?: Record<string, string>;
    text?: {
        lowercase?: boolean;
        uppercase?: boolean;
        find: string | ((text: string) => boolean);
    };
}

declare class VNodeEventGroup {
    private node;
    map: Map<keyof HTMLElementEventMap, Function>;
    constructor(node: VNode);
    on(event: keyof HTMLElementEventMap, callback: Function): this;
    off(event: keyof HTMLElementEventMap, callback?: Function): this;
    clear(): this;
}

declare class VNode<E extends HTMLElement = HTMLElement> {
    static Utilities: typeof VNodeUtilities;
    static Util: {
        new (): {};
        qs(selector: string, element?: HTMLElement | Document): VNode | null;
        qsAll(selector: string, element?: HTMLElement | Document): VNode[];
        where(options: VNodeWhereOptions, element?: HTMLElement | Document): VNode[];
        extractEl: typeof VNodeExtractEl;
        getChildren(extractable: VNodeExtractable): VNode[];
    };
    static indexing: Map<any, any>;
    /**
     * Replacement for 'newNode' on ProxyNode Utilities
     * @deprecated
     */
    static of: Record<VNodeElementName, VNode>;
    static getElement<T extends VNodeElementName | VNodeExtractable>(el: T): ResolveElement<T>;
    static from<T extends VNodeElementName | VNodeExtractable>(el: T): VNode<ResolveElement<T>>;
    /**
     * @deprecated Use VNode.Util.extractEl
     */
    static extractEl: typeof VNodeExtractEl;
    static send_events: boolean;
    static events: Emitter$1<{
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
    ref(run: (arg0: this) => void): this;
    use(plugins: ((node: VNode) => void)[]): void;
    attr(attributes?: Partial<Record<string, string | number> & E>): this;
    swap(node: VNodeExtractable): this;
    id(value: string): this;
    id(value: undefined): string;
    append(...objs: VNodeChildList): this;
    prepend(...objs: VNodeChildList): this;
    appendTo(obj: VNodeExtractable | false, direction?: "append" | "prepend"): this;
    getBounds(): DOMRect;
    value(): any;
    value(value: string | number): this;
    dataset(): Partial<Record<string, string>>;
    dataset(record: "clear" | Partial<Record<string, string>>): this;
    focus(): this;
    remove(): this;
    setContent(...content: any[]): this;
    /** Clears inner content */
    clear(): this;
    inDom(parent?: HTMLElement): boolean;
    scroll(x?: number, y?: number): this;
}

type VNodeTagged<T extends keyof HTMLElementTagNameMap> = VNode<HTMLElementTagNameMap[T]>;
type VNProperties<T extends keyof HTMLElementTagNameMap> = {
    attributes?: Partial<Record<string, string | number> & HTMLElementTagNameMap[T]>;
    properties?: Partial<HTMLElementTagNameMap[T]>;
    style?: Partial<CSSStyleDeclaration>;
    dataset?: Record<string, string>;
    class?: string[];
    on?: {
        [K in keyof HTMLElementEventMap]?: (this: VNodeTagged<T>, ev: HTMLElementEventMap[K]) => any;
    };
    ref?: (el: VNodeTagged<T>) => void;
};
/**
 * Virtual Node (Functional implementation)
 */
declare function vn<T extends keyof HTMLElementTagNameMap>(tag: T, props?: VNProperties<T> | null, ...children: VNodeChildList): VNodeTagged<T>;
/**
 * Virtual Node - Fragment
 */
declare function VNFragment(...children: VNodeChildList): DocumentFragment;

type ObservedCallback = () => void;
declare class ObserverTracking {
    private static inDom;
    static handle(element: HTMLElement): void;
    private static getEvents;
    private static weak_events;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    events: Emitter$1<{
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

type OraCssStyleNames = keyof CSSStyleDeclaration | `--${string}`;
type StyleOptions = Partial<Record<OraCssStyleNames, string>>;
interface OraCssMediaQueryOptions {
    min_width?: `${number}${"px" | "em"}` | (string & {});
    max_width?: `${number}${"px" | "em"}` | (string & {});
    min_height?: `${number}${"px" | "em"}` | (string & {});
    max_height?: `${number}${"px" | "em"}` | (string & {});
}
type OraCssExtendOption = Record<`&:${string}` | string, StyleOptions>;
type OraCssMediaOption = {
    if: OraCssMediaQueryOptions;
    styles: StyleOptions & {
        extend?: OraCssExtendOption;
    };
};
type OraCssStyleOptions = StyleOptions & {
    extend?: OraCssExtendOption;
    media?: OraCssMediaOption[];
};
type AnimationPosition = `${number}%` | "from" | "to";
type OraCssAnimationOptions = [
    position: AnimationPosition | AnimationPosition[],
    contents: Partial<Record<OraCssStyleNames, string>>
][];
declare class OraCssStyle {
    name: string;
    data: OraCssStyleOptions;
    static Media: {
        new (): {};
        createString(options: OraCssMediaQueryOptions, styles: [name: string, options: Partial<Record<OraCssStyleNames, string>> & {
            extend?: OraCssExtendOption | undefined;
        }][], indent?: number): string;
        toString(style_name: string, options: OraCssMediaOption[], indent?: number): string;
    };
    static parseContents(data: Partial<Record<OraCssStyleNames, string>>): string[];
    static resolve(name: string, data: StyleOptions): string;
    static parseExtend(style_name: string, extend: OraCssExtendOption): string[];
    static toString(style_name: string, data: OraCssStyleOptions, indent?: number): string;
    constructor(name: string, data: OraCssStyleOptions);
    toString(): string;
}
declare class OraCssClass extends OraCssStyle {
    classname: string;
    constructor(classname: string, options: OraCssStyleOptions);
    getName(): string;
}
declare class OraCssAnimation {
    name: string;
    options: OraCssAnimationOptions;
    static toString(name: string, options: OraCssAnimationOptions): string;
    constructor(name: string, options: OraCssAnimationOptions);
    toString(): string;
}
declare class OraCssDepot<Instance extends {
    name: string;
}, OptionType> {
    manager: OraCss;
    generator: (name: string, options: OptionType) => Instance;
    private counter;
    private readonly indexes;
    readonly list: Map<string, Instance>;
    constructor(manager: OraCss, generator: (name: string, options: OptionType) => Instance);
    call(run: (arg0: this) => void): this["manager"];
    has(name: string): boolean;
    insert(instance: Instance): void;
    add(name: string, style: OptionType): this;
    add(instance: Instance): this;
    remove(input: string): boolean;
    remove(input: Instance): boolean;
}
declare class StyleManager extends OraCssDepot<OraCssStyle, OraCssStyleOptions> {
    constructor(manager: OraCss);
}
declare class AnimationManager extends OraCssDepot<OraCssAnimation, OraCssAnimationOptions> {
    constructor(manager: OraCss);
}
declare class OraCss {
    static readonly ExtendStyle: {
        new (): {};
        classname(name: string): string;
    };
    static createPluginStyle(callback: (manager: StyleManager) => void): (manager: StyleManager) => void;
    static createPluginAnimation(callback: (manager: StyleManager) => void): (manager: StyleManager) => void;
    static createStyle(name: string, data: OraCssStyleOptions): OraCssStyle;
    static createClass(name: string, data: OraCssStyleOptions): OraCssClass;
    static createAnimation(name: string, options: OraCssAnimationOptions): OraCssAnimation;
    element: HTMLStyleElement;
    readonly styles: ((run: (arg0: StyleManager) => void) => OraCss) & StyleManager;
    readonly animations: ((run: (arg0: AnimationManager) => void) => OraCss) & AnimationManager;
    attatched?: HTMLElement;
    /**
     * inserts stylesheet into the dom onto element then stores reference
     */
    attach(element?: HTMLElement): this;
    /**
     * removes stylesheet from the DOM
     */
    detach(): this;
    insert(...instances: (OraCssStyle | OraCssAnimation)[]): this;
    build(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}

type ora_css_AnimationPosition = AnimationPosition;
type ora_css_OraCss = OraCss;
declare const ora_css_OraCss: typeof OraCss;
type ora_css_OraCssAnimation = OraCssAnimation;
declare const ora_css_OraCssAnimation: typeof OraCssAnimation;
type ora_css_OraCssAnimationOptions = OraCssAnimationOptions;
type ora_css_OraCssClass = OraCssClass;
declare const ora_css_OraCssClass: typeof OraCssClass;
type ora_css_OraCssMediaQueryOptions = OraCssMediaQueryOptions;
type ora_css_OraCssStyle = OraCssStyle;
declare const ora_css_OraCssStyle: typeof OraCssStyle;
type ora_css_OraCssStyleNames = OraCssStyleNames;
type ora_css_OraCssStyleOptions = OraCssStyleOptions;
type ora_css_StyleOptions = StyleOptions;
declare namespace ora_css {
  export { ora_css_OraCss as OraCss, ora_css_OraCssAnimation as OraCssAnimation, ora_css_OraCssClass as OraCssClass, ora_css_OraCssStyle as OraCssStyle };
  export type { ora_css_AnimationPosition as AnimationPosition, ora_css_OraCssAnimationOptions as OraCssAnimationOptions, ora_css_OraCssMediaQueryOptions as OraCssMediaQueryOptions, ora_css_OraCssStyleNames as OraCssStyleNames, ora_css_OraCssStyleOptions as OraCssStyleOptions, ora_css_StyleOptions as StyleOptions };
}

declare class StyledNodeManager {
    readonly id: number;
    class: OraCssStyle;
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
    static styles: Partial<Record<OraCssStyleNames, string>> & {
        _: unknown;
    };
    static getConstructor<T extends VNode>(ref: T): typeof VNode;
    static findOrCreate(c: typeof VNode<any>, styles: OraCssStyleOptions | OraCssStyle): string;
    /**
     * Connects by finding or creating an instance
     */
    static connect(class_ref: VNode, styles: OraCssStyleOptions | OraCssStyle): void;
    /**
     * Connects if there is an existing instance
     */
    static connect(class_ref: VNode): void;
    static getManager(c: typeof VNode): StyledNodeManager;
    /** Destroys the class and it's relations for a vnode class */
    static destroy(class_ref: VNode): void;
    static init(): void;
    protected static validStyles<S extends Partial<Record<OraCssStyleNames, string>>>(styles: S): S & {
        _: unknown;
    };
    constructor(element: VNodeElementName | VNodeExtractable);
    getConstructor(): typeof StyledVNode;
}
declare class JCSSTracker {
    private instance;
    observer: ObserverTracking;
    callback: () => void;
    constructor(instance: OraCss, observer?: ObserverTracking);
    enable(): void;
    disable(): void;
}

declare class VNodeStateObserver {
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
        observer: VNodeStateObserver;
        destroy(): void;
    };
    static filterQuery(list: any[]): VNode[];
    static query(): VNode[];
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

export { experimental as Experimental, Fullscreen, OraCss as JCSS, JCSSTracker, OraCssAnimation as JssAnimation, OraCssStyle as JssClass, OraCssStyle as JssStyle, OraCssAnimation as OC_Animation, ObserverTracking, OraCss, OraCssStyle as OraCssClass, OraCssStyle, ora_css as OragoCss, PictureApi as Picture, ProxyNode, StateTracking, StyledVNode, VNFragment, VNode, VNodeEventGroup, _default as default, generateProxyNode, newNode, qs, qsAll, vn };
export type { StyleDeclaration, StyleDeclarationWithProps, VNProperties, VNodeStyleDeclarationWithProps, VNodeTagged };
