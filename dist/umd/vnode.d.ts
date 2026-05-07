import { Emitter, makeCallableClass } from "@orago/lib";
import type { VNodeExtractable, VNodeAppendable, VNodeElementName, ResolveElement } from "./interfaces.js";
import { VNodeExtractEl } from "./utilities.js";
import { VNodeClasses, VNodeEvents, VNodeStyle } from "./utilities/vnode_extras.js";
export declare class VNode<E extends HTMLElement = HTMLElement> {
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
