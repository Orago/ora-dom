import type { VNodeElementName, VNodeExtractable, VNodeStyleDeclarationWithProps } from "../interfaces.js";
import type { VNode } from "../vnode.js";
export interface VNodeSchema<T extends keyof HTMLElementTagNameMap = "div"> {
    element: VNodeElementName | VNodeExtractable;
    attributes?: Partial<Record<string, string | number> & HTMLElementTagNameMap[T]>;
    properties?: Partial<HTMLElementTagNameMap[T]>;
    style?: VNodeStyleDeclarationWithProps;
    class?: string[] | string;
    use?: ((node: VNode<any>) => void)[];
}
