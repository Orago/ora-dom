"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxDEV = exports.Fragment = exports.jsxs = exports.jsx = exports.VNX = void 0;
const vnode_js_1 = require("./vnode.js");
const vnode_functional_js_1 = require("./vnode_functional.js");
const vnode_utilities_js_1 = require("./vnode_utilities.js");
class VNX extends vnode_js_1.VNode {
    constructor(type, props) {
        super(type);
        vnode_utilities_js_1.VNodeUtilities.applyVNProps(this, props);
    }
}
exports.VNX = VNX;
function jsx(type, props, key) {
    var _a, _b;
    if (typeof type === "function") {
        if ((props === null || props === void 0 ? void 0 : props.children) != undefined) {
            props.children = vnode_utilities_js_1.VNodeUtilities.flattenElements([
                (_a = props.children) !== null && _a !== void 0 ? _a : [],
            ]);
        }
        return new type(props);
    }
    return (0, vnode_functional_js_1.vn)(type, props, vnode_utilities_js_1.VNodeUtilities.flattenElements([(_b = props === null || props === void 0 ? void 0 : props.children) !== null && _b !== void 0 ? _b : []]));
}
exports.jsx = jsx;
exports.jsxs = jsx;
exports.Fragment = vnode_functional_js_1.VNFragment;
const jsxDEV = (type, props, key, isStatic, source, self) => {
    return jsx(type, props, key);
};
exports.jsxDEV = jsxDEV;
