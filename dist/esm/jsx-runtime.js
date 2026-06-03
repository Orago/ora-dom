import { VNode } from "./vnode.js";
import { vn, VNFragment } from "./vnode_functional.js";
import { VNodeUtilities } from "./vnode_utilities.js";
export class VNX extends VNode {
    constructor(type, props) {
        super(type);
        VNodeUtilities.applyVNProps(this, props);
    }
}
export function jsx(type, props, key) {
    var _a, _b;
    if (typeof type === "function") {
        if ((props === null || props === void 0 ? void 0 : props.children) != undefined) {
            props.children = VNodeUtilities.flattenElements([
                (_a = props.children) !== null && _a !== void 0 ? _a : [],
            ]);
        }
        return new type(props);
    }
    return vn(type, props, VNodeUtilities.flattenElements([(_b = props === null || props === void 0 ? void 0 : props.children) !== null && _b !== void 0 ? _b : []]));
}
export const jsxs = jsx;
export const Fragment = VNFragment;
export const jsxDEV = (type, props, key, isStatic, source, self) => {
    return jsx(type, props, key);
};
