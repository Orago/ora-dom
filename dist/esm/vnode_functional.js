import { VNodeUtilities } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";
/**
 * Virtual Node (Functional implementation)
 */
export function vn(tag, props, ...children) {
    const node = new VNode(tag);
    VNodeUtilities.applyVNProps(node, props);
    const all_string = children.every((e) => typeof e == "string");
    if (all_string) {
        node.append(children.join(""));
    }
    else {
        node.append(...children);
    }
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
