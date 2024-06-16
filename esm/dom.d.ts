type extractable = ProxyNode | Element;
interface DomAnimationOptions {
    save?: boolean;
    onFinish?: ((this: Animation, ev?: Event) => any);
    onCancel?: ((this: Animation, ev?: Event) => any);
    onRemove?: ((this: Animation, ev?: Event) => any);
    animationReference?: (param0: Animation) => void;
}
export interface AnimationMethods {
    onFinish?: Function;
    onCancel?: Function;
    onRemove?: Function;
}
type styleDeclaration = Partial<Record<keyof CSSStyleDeclaration, string | number>>;
type styleDeclarationWithProps = styleDeclaration & {
    props?: {
        [propName: string]: string | number;
    };
};
export declare class ProxyNode {
    static extractEl(node: extractable): Element;
    static isNode(el: ProxyNode | any): boolean;
    data: {};
    privateData: {};
    element: Element;
    listeners: {
        [key: string]: {
            [listener: string]: ReturnType<Function['bind']>;
        };
    };
    get call(): this;
    constructor(el: Element | string | ProxyNode);
    get focused(): boolean;
    get childFocused(): boolean;
    get bounds(): DOMRect;
    get parent(): ProxyNode | undefined;
    get value(): string;
    set value(value: string);
    get wrapper(): this['ref'];
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
    getChildren(): Array<ProxyNode>;
    reset(...toReset: ('content' | 'style' | 'class')[]): this;
    class(...args: string[]): this;
    hasClass(className: string): boolean;
    addClass(...args: string[]): this;
    removeClass(...args: string[]): this;
    toggleClass(className: string, status?: boolean): this;
    styles(styles?: styleDeclarationWithProps): this;
    removeStyles(...styles: string[]): this;
    on(event: string, callback: Function): this;
    addListener(events: {
        [key: string]: {
            [listener: string]: Function;
        };
    }): this;
    removeListener(key: any): this;
    interval(callback: Function, time?: number, immediate?: boolean): this;
    remove(): this;
    setContent(...content: any[]): this;
    append(...objs: (extractable | false | string | Array<extractable | false | string>)[]): this;
    appendTo(obj: extractable | false): this;
    prependTo(obj: extractable): this;
    prepend(...objs: extractable[]): this;
    focus(): this;
    scroll(x?: number, y?: number): this;
    observer(methods: import('./domObserver.js').Methods, options?: import('./domObserver.js').Options): this;
    setTabIndex(index: number): this;
    horizontalScrolling(): this;
    animate(styles: Array<styleDeclaration>, options: number | (KeyframeAnimationOptions & DomAnimationOptions)): this;
}
export declare function generateProxyNode(el: HTMLElement | Element): ProxyNode;
type newNode = {
    [elementTag: string]: ProxyNode;
};
export declare const newNode: newNode;
export declare function qs(selector: string, element?: HTMLElement | Document): ProxyNode | null;
export declare function qsAll(selector: string, element?: HTMLElement | Document): Array<ProxyNode>;
declare const _default: {
    newNode: newNode;
    qs: typeof qs;
    generateProxyNode: typeof generateProxyNode;
    fetch: typeof fetch;
};
export default _default;
