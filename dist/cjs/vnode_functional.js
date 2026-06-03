"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNFragment = exports.vn = void 0;
const vnode_utilities_js_1 = require("./vnode_utilities.js");
const vnode_js_1 = require("./vnode.js");
/**
 * Virtual Node (Functional implementation)
 */
function vn(tag, props, ...children) {
    var _a;
    const node = new vnode_js_1.VNode(tag);
    if (props) {
        (_a = props.children) !== null && _a !== void 0 ? _a : (props.children = children);
    }
    vnode_utilities_js_1.VNodeUtilities.applyVNProps(node, props);
    return node;
}
exports.vn = vn;
/**
 * Virtual Node - Fragment
 */
function VNFragment(...children) {
    const frag = document.createDocumentFragment();
    const items = vnode_utilities_js_1.VNodeUtilities.flattenElements(children);
    for (const item of items)
        frag.appendChild(item);
    return frag;
}
exports.VNFragment = VNFragment;
