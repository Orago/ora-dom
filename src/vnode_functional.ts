import { VNodeChildList } from "./interfaces.js";
import { VNodeUtilities } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";

export type VNodeTagged<T extends keyof HTMLElementTagNameMap> = VNode<
	HTMLElementTagNameMap[T]
>;

export type VNProperties<T extends keyof HTMLElementTagNameMap> = {
	attributes?: Partial<
		Record<string, string | number> & HTMLElementTagNameMap[T]
	>;
	properties?: Partial<HTMLElementTagNameMap[T]>;
	style?: Partial<CSSStyleDeclaration>;
	dataset?: Record<string, string>;
	class?: string[];
	on?: {
		[K in keyof HTMLElementEventMap]?: (
			this: VNodeTagged<T>,
			ev: HTMLElementEventMap[K]
		) => any;
	};
	ref?: (el: VNodeTagged<T>) => void;
};

/**
 * Virtual Node (Functional implementation)
 */
export function vn<T extends keyof HTMLElementTagNameMap>(
	tag: T,
	props?: VNProperties<T> | null,
	...children: VNodeChildList
): VNodeTagged<T> {
	const node: VNodeTagged<T> = new VNode(tag);

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
				node.events.on(event, handler as EventListener);
			}
		}

		if (props.ref) {
			props.ref(node);
		}
	}

	node.append(...children);

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
