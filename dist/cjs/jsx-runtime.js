"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxDEV = exports.Fragment = exports.jsxs = exports.jsx = void 0;
// polyfill for jsx
const vnode_functional_js_1 = require("./vnode_functional.js");
function jsx(type, props, key) {
    var _a;
    return (0, vnode_functional_js_1.vn)(type, props, ...((_a = props === null || props === void 0 ? void 0 : props.children) !== null && _a !== void 0 ? _a : []));
}
exports.jsx = jsx;
exports.jsxs = jsx;
exports.Fragment = vnode_functional_js_1.VNFragment;
const jsxDEV = (type, props, key, isStatic, source, self) => {
    var _a;
    return (0, vnode_functional_js_1.vn)(type, props, ...((_a = props === null || props === void 0 ? void 0 : props.children) !== null && _a !== void 0 ? _a : []));
};
exports.jsxDEV = jsxDEV;
