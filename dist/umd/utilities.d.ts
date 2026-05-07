import type { VNodeExtractable, VNodeStyleDeclarationWithProps } from "./interfaces.js";
import type { ProxyNode } from "./proxynode.js";
import type { VNode } from "./vnode.js";
export declare class VNodeUtilityClass<T extends VNode = VNode> {
    node: T;
    constructor(node: T);
    nest(run: (arg0: this) => void): this["node"];
}
export declare function VNodeExtractEl(node: VNodeExtractable): HTMLElement;
export declare class PNodeUtil {
    static resetStyles<T extends ProxyNode>(vnode: T, to_reset: ("content" | "style" | "class")[]): T;
}
export declare class P_VNodeUtil {
    static setStyles(element: HTMLElement, styles?: VNodeStyleDeclarationWithProps): void;
    static removeStyles(element: HTMLElement, styles: string[]): void;
    static injectItems<T extends VNode>(vnode: T, direction: "append" | "prepend" | undefined, objs: (VNodeExtractable | false | string | (VNodeExtractable | false | string)[])[]): T;
    static attr(element: HTMLElement, attributes?: Record<string, string | number>): void;
}
