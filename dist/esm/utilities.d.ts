import type { VN_Extractable, VNodeStyleDeclarationWithProps } from "./interfaces.js";
import { ProxyNode } from "./proxynode.js";
import { VNode } from "./vnode.js";
export declare class PNodeUtil {
    static resetStyles<T extends ProxyNode>(vnode: T, to_reset: ("content" | "style" | "class")[]): T;
}
export declare class P_VNodeUtil {
    static setStyles(element: HTMLElement, styles?: VNodeStyleDeclarationWithProps): void;
    static removeStyles(element: HTMLElement, styles: string[]): void;
    static injectItems<T extends VNode>(vnode: T, direction: "append" | "prepend" | undefined, objs: (VN_Extractable | false | string | (VN_Extractable | false | string)[])[]): T;
    static attr(element: HTMLElement, attributes?: Record<string, string | number>): void;
}
export declare class VNodeUtilExtend {
    static qs(selector: string, element?: HTMLElement | Document): VNode | null;
    static qsAll(selector: string, element?: HTMLElement | Document): VNode[];
    static extractEl(node: VN_Extractable): HTMLElement;
    static getChildren(extractable: VN_Extractable): ProxyNode[];
    static setTabIndex(extractable: VN_Extractable, index: number): void;
}
