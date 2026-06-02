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
	class?: string[] | string;
	on?: {
		[K in keyof HTMLElementEventMap]?: (
			this: VNodeTagged<T>,
			ev: HTMLElementEventMap[K]
		) => any;
	};
	// `on:${string}`: any;
	ref?: (el: VNodeTagged<T>) => void;
	use?: ((node: VNodeTagged<T>) => void)[];
	children?: any;
} & {
	[K in keyof HTMLElementEventMap as `on:${K}`]?: (
		this: VNodeTagged<T>,
		ev: HTMLElementEventMap[K]
	) => any;
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
			if (typeof props.class == "string") {
				node.class.add(props.class);
			} else {
				node.class.add(...props.class);
			}
		}

		if (props.on) {
			for (const [event, handler] of Object.entries(props.on)) {
				node.events.on(event, handler as EventListener);
			}
		}
		const on_pre: string = "on:";
		for (const key in props) {
			const p = props[key as keyof typeof props];
			if (key.startsWith(on_pre) && typeof p === "function") {
				const event = key.slice(on_pre.length).toLowerCase();
				node.events.on(event, p as EventListener);
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
