// polyfill for jsx
import { vn, VNFragment } from "./vnode_functional.js";
export function jsx(type, props, key) {
    var _a;
    return vn(type, props, ...((_a = props === null || props === void 0 ? void 0 : props.children) !== null && _a !== void 0 ? _a : []));
}
export const jsxs = jsx;
export const Fragment = VNFragment;
export const jsxDEV = (type, props, key, isStatic, source, self) => {
    var _a;
    return vn(type, props, ...((_a = props === null || props === void 0 ? void 0 : props.children) !== null && _a !== void 0 ? _a : []));
};
