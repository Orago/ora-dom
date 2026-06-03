import { VNProperties } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";
import { VNFragment } from "./vnode_functional.js";
export declare class VNX extends VNode {
    constructor(type: keyof HTMLElementTagNameMap, props: JsxProps);
}
declare global {
    namespace JSX {
        type Element = ReturnType<typeof import("./vnode_functional.js").vn>;
        type IntrinsicElements = {
            [K in keyof HTMLElementTagNameMap]: import("./vnode_utilities.ts").VNProperties<K>;
        };
    }
}
type JsxProps = (VNProperties<any> & {
    children?: any[];
}) | null | undefined;
export declare function jsx(type: any, props: JsxProps, key: any): any;
export declare const jsxs: typeof jsx;
export declare const Fragment: typeof VNFragment;
export declare const jsxDEV: (type: any, props: JsxProps, key: any, isStatic: any, source: any, self: any) => any;
export {};
