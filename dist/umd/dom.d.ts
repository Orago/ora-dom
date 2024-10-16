import Emitter from '@orago/lib/emitter';
import type { StyleDeclaration, StyleDeclarationWithProps, DomAnimationOptions } from './interfaces.js';
import { ObserverGroup } from './domObserver.js';
export type { StyleDeclaration, StyleDeclarationWithProps } from './interfaces.js';
export declare const nodeObservers: ObserverGroup;
type Extractable = ProxyNode | Element;
export declare class ProxyNode {
    static extractEl(node: Extractable): Element;
    static isNode(el: ProxyNode | any): boolean;
    element: Element;
    listeners: {
        [key: string]: {
            [listener: string]: ReturnType<Function['bind']>;
        };
    };
    nodeEvents: Emitter;
    private _observer?;
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
    styles(styles?: StyleDeclarationWithProps): this;
    removeStyles(...styles: string[]): this;
    private get safeEvents();
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
    append(...objs: (Extractable | false | string | Array<Extractable | false | string>)[]): this;
    appendTo(obj: Extractable | false): this;
    prependTo(obj: Extractable): this;
    prepend(...objs: Extractable[]): this;
    focus(): this;
    scroll(x?: number, y?: number): this;
    setTabIndex(index: number): this;
    horizontalScrolling(): this;
    animate(styles: Array<StyleDeclaration>, options: number | (KeyframeAnimationOptions & DomAnimationOptions)): this;
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
