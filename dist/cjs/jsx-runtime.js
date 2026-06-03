"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxDEV = exports.Fragment = exports.jsxs = exports.jsx = exports.VNX = void 0;
// polyfill for jsx
const vnode_js_1 = require("./vnode.js");
const vnode_functional_js_1 = require("./vnode_functional.js");
class VNX extends vnode_js_1.VNode {
    constructor(type, props) {
        super(type);
        (0, vnode_functional_js_1.applyVNProps)(this, props);
    }
}
exports.VNX = VNX;
function jsx(type, props, key) {
    var _a;
    if (typeof type === "function") {
        return new type(props);
    }
    return (0, vnode_functional_js_1.vn)(type, props, ...((_a = props === null || props === void 0 ? void 0 : props.children) !== null && _a !== void 0 ? _a : []));
}
exports.jsx = jsx;
exports.jsxs = jsx;
exports.Fragment = vnode_functional_js_1.VNFragment;
const jsxDEV = (type, props, key, isStatic, source, self) => {
    return jsx(type, props, key);
};
exports.jsxDEV = jsxDEV;
