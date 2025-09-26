import { Emitter, makeCallableClass } from "@orago/lib";
import type { StyleDeclarationWithProps, VNodeExtractable, VNodeAppendable } from "./interfaces.js";
import { ProxyNode } from "./proxynode.js";
import { VNodeExtractEl } from "./utilities.js";
import { VNodeClasses, VNodeEvents, VNodeStyle } from "./vnode_extras.js";
export declare class VNode {
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
