import { VNFragment, VNProperties } from "./vnode_functional.js";
declare global {
    namespace JSX {
        type Element = ReturnType<typeof import("./vnode_functional.js").vn>;
        type IntrinsicElements = {
            [K in keyof HTMLElementTagNameMap]: import("./vnode_functional.ts").VNProperties<K>;
        };
    }
}
type JsxProps = (VNProperties<any> & {
    children: any[];
}) | null | undefined;
export declare function jsx(type: any, props: JsxProps, key: any): import("./vnode_functional.js").VNodeTagged<any>;
export declare const jsxs: typeof jsx;
export declare const Fragment: typeof VNFragment;
export declare const jsxDEV: (type: any, props: JsxProps, key: any, isStatic: any, source: any, self: any) => import("./vnode_functional.js").VNodeTagged<any>;
export {};
