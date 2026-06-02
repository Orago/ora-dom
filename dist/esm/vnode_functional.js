import { VNodeUtilities } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";
/**
 * Virtual Node (Functional implementation)
 */
export function vn(tag, props, ...children) {
    const node = new VNode(tag);
    if (props) {
        if (props.attributes) {
            node.attr(props.attributes);
        }
        if (props.properties) {
            Object.assign(node.element, props.properties);
        }
        if (props.style) {
            node.style(props.style);
        }
        if (props.dataset) {
            for (const [key, value] of Object.entries(props.dataset)) {
                node.element.dataset[key] = value;
            }
        }
        if (props.class) {
            if (typeof props.class == "string") {
                node.class.add(props.class);
            }
            else {
                node.class.add(...props.class);
            }
        }
        if (props.on) {
            for (const [event, handler] of Object.entries(props.on)) {
                node.events.on(event, handler);
            }
        }
        const on_pre = "on:";
        for (const key in props) {
            const p = props[key];
            if (key.startsWith(on_pre) && typeof p === "function") {
                const event = key.slice(on_pre.length).toLowerCase();
                node.events.on(event, p);
            }
        }
        if (props.ref) {
            props.ref(node);
        }
        if (props.use) {
            node.use(props.use);
        }
    }
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
