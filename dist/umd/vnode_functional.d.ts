import { VNodeChildList } from "./interfaces.js";
import { VNode } from "./vnode.js";
export type VNodeTagged<T extends keyof HTMLElementTagNameMap> = VNode<HTMLElementTagNameMap[T]>;
export type VNProperties<T extends keyof HTMLElementTagNameMap> = {
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
export declare function vn<T extends keyof HTMLElementTagNameMap>(tag: T, props?: VNProperties<T> | null, ...children: VNodeChildList): VNodeTagged<T>;
/**
 * Virtual Node - Fragment
 */
export declare function VNFragment(...children: VNodeChildList): DocumentFragment;
