import type { VNodeChildList, VNodeExtractable, VNodeStyleDeclarationWithProps, VNodeWhereOptions } from "./interfaces.js";
import type { VNode } from "./vnode.js";
export type VNodeTagged<T extends keyof HTMLElementTagNameMap> = VNode<HTMLElementTagNameMap[T]>;
export type VNProperties<T extends keyof HTMLElementTagNameMap = "div"> = {
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
type StaticMethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
export type VNUtilityParam<K extends StaticMethodKeys<typeof VNodeUtilities>, P extends number> = Parameters<(typeof VNodeUtilities)[K]>[P];
export declare class VNodeUtilities {
    static flattenContents(contents: VNodeChildList): (VNodeExtractable | string)[];
    static flattenElements(contents: VNodeChildList): HTMLElement[];
    static injectItems<T extends HTMLElement>(node: T, direction: "append" | "prepend" | undefined, objs: VNodeChildList): void;
    static setAttributes<T extends HTMLElement>(element: T, attributes?: Record<string, string | number | undefined>): void;
    static setStyles(element: HTMLElement, styles?: VNodeStyleDeclarationWithProps): void;
    static removeStyles(element: HTMLElement, styles: string[]): void;
    static formatAttributeName(as: "kebab" | "camel", text: string): string;
    static elementTextFind(options: Exclude<VNodeWhereOptions["text"], undefined>, dict: [string, any][]): [string, any][];
    static whereString(options: VNodeWhereOptions): string;
    static applyVNProps<T extends keyof HTMLElementTagNameMap = "div">(node: VNode, props?: VNProperties<T> | null): void;
}
export declare class VNodeUtilityClass<T extends VNode = VNode> {
    node: T;
    constructor(node: T);
    nest(run: (arg0: this) => void): this["node"];
}
export declare function VNodeExtractEl(node: VNodeExtractable): HTMLElement;
export {};
