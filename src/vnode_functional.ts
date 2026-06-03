import { VNodeChildList } from "./interfaces.js";
import { VNodeTagged, VNodeUtilities } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";
import type { VNProperties } from "./vnode_utilities.js";

/**
 * Virtual Node (Functional implementation)
 */
export function vn<T extends keyof HTMLElementTagNameMap>(
	tag: T,
	props?: VNProperties<T> | null,
	...children: VNodeChildList
): VNodeTagged<T> {
	const node: VNodeTagged<T> = new VNode(tag);

	VNodeUtilities.applyVNProps<T>(node, props);

	const all_string = children.every((e) => typeof e == "string");
	if (all_string) {
		node.append(children.join(""));
	} else {
		node.append(...children);
	}
	return node;
}

/**
 * Virtual Node - Fragment
 */
export function VNFragment(...children: VNodeChildList): DocumentFragment {
	const frag = document.createDocumentFragment();
	const items = VNodeUtilities.flattenElements(children);
	for (const item of items) frag.appendChild(item);
	return frag;
}
