// polyfill for jsx
import { VNode } from "./vnode.js";
import { applyVNProps, vn, VNFragment, } from "./vnode_functional.js";
export class VNX extends VNode {
    constructor(type, props) {
        super(type);
        applyVNProps(this, props);
    }
}
export function jsx(type, props, key) {
    var _a;
    if (typeof type === "function") {
        return new type(props);
    }
    return vn(type, props, ...((_a = props === null || props === void 0 ? void 0 : props.children) !== null && _a !== void 0 ? _a : []));
}
export const jsxs = jsx;
export const Fragment = VNFragment;
export const jsxDEV = (type, props, key, isStatic, source, self) => {
    return jsx(type, props, key);
};
