import { VNodeUtilities } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";
/**
 * Virtual Node (Functional implementation)
 */
export function vn(tag, props, ...children) {
    var _a;
    const node = new VNode(tag);
    if (props) {
        (_a = props.children) !== null && _a !== void 0 ? _a : (props.children = children);
    }
    VNodeUtilities.applyVNProps(node, props);
    return node;
}
/**
 * Virtual Node - Fragment
 */
export function VNFragment(...children) {
    const frag = document.createDocumentFragment();
    const items = VNodeUtilities.flattenElements(children);
    for (const item of items)
        frag.appendChild(item);
    return frag;
}
