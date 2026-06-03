import { VNodeChildList, VNodeStyleDeclarationWithProps } from "./interfaces.js";
import { VNode } from "./vnode.js";
export type VNodeTagged<T extends keyof HTMLElementTagNameMap> = VNode<HTMLElementTagNameMap[T]>;
export type VNProperties<T extends keyof HTMLElementTagNameMap> = {
    attributes?: Partial<Record<string, string | number> & HTMLElementTagNameMap[T]>;
    properties?: Partial<HTMLElementTagNameMap[T]>;
    style?: VNodeStyleDeclarationWithProps;
    dataset?: Record<string, string>;
    class?: string[] | string;
    on?: {
        [K in keyof HTMLElementEventMap]?: (this: VNodeTagged<T>, ev: HTMLElementEventMap[K]) => any;
    };
    ref?: (el: VNodeTagged<T>) => void;
    use?: ((node: VNodeTagged<T>) => void)[];
    children?: any;
} & {
    [K in keyof HTMLElementEventMap as `on:${K}`]?: (this: VNodeTagged<T>, ev: HTMLElementEventMap[K]) => any;
};
export declare function applyVNProps<T extends keyof HTMLElementTagNameMap = "div">(node: VNode, props?: VNProperties<T> | null): void;
/**
 * Virtual Node (Functional implementation)
 */
export declare function vn<T extends keyof HTMLElementTagNameMap>(tag: T, props?: VNProperties<T> | null, ...children: VNodeChildList): VNodeTagged<T>;
/**
 * Virtual Node - Fragment
 */
export declare function VNFragment(...children: VNodeChildList): DocumentFragment;
