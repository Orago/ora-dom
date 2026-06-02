"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNFragment = exports.vn = void 0;
const vnode_utilities_js_1 = require("./vnode_utilities.js");
const vnode_js_1 = require("./vnode.js");
/**
 * Virtual Node (Functional implementation)
 */
function vn(tag, props, ...children) {
    const node = new vnode_js_1.VNode(tag);
    if (props) {
        if (props.attributes) {
            node.attr(props.attributes);
        }
        if (props.properties) {
            Object.assign(node.element, props.properties);
        }
        if (props.style) {
            Object.assign(node.style, props.style);
        }
        if (props.dataset) {
            for (const [key, value] of Object.entries(props.dataset)) {
                node.element.dataset[key] = value;
            }
        }
        if (props.class) {
            node.class.add(...props.class);
        }
        if (props.on) {
            for (const [event, handler] of Object.entries(props.on)) {
                node.events.on(event, handler);
            }
        }
        if (props.ref) {
            props.ref(node);
        }
    }
    node.append(...children);
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
