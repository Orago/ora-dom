import type {
	VNodeChildList,
	VNodeExtractable,
	VNodeStyleDeclarationWithProps,
} from "./interfaces.js";
import type { ProxyNode } from "./proxynode.js";
import type { VNode } from "./vnode.js";

type VNodeAppendable = VNodeExtractable | string;

export class VNodeUtilities {
	public static flattenContents(contents: VNodeChildList): VNodeAppendable[] {
		return contents
			.flat()
			.filter((content) => content != undefined && content != false)
			.map((a) => {
				let t = typeof a;
				// convert number or bool types to string
				a = "number" == t || "boolean" == t ? String(a) : a;
				// // convert strings to text nodes
				// a = typeof a == "string" ? document.createTextNode(a) : a;
				return a as VNodeAppendable;
			});
	}

	public static flattenElements(contents: VNodeChildList): HTMLElement[] {
		return contents.map((a) => {
			let t = typeof a;

			// convert number or bool types to string
			a = "number" == t || "boolean" == t ? String(a) : a;
			a = "string" == typeof a ? document.createTextNode(a) : a;

			return a as HTMLElement;
		});
	}
	public static injectItems<T extends HTMLElement>(
		node: T,
		direction: "append" | "prepend" = "append",
		objs: VNodeChildList
	): void {
		if (objs.length < 1) {
			return;
		}
		const items = this.flattenContents(objs);

		for (const item of items) {
			const extracted =
				typeof item === "string" ? item : VNodeExtractEl(item);

			if (direction === "append") {
				node.append(extracted);
			} else {
				node.prepend(extracted);
			}
		}
	}
}
export class VNodeUtilityClass<T extends VNode = VNode> {
	constructor(public node: T) {
		this.node = node;
	}

	public nest(run: (arg0: this) => void): this["node"] {
		run(this);
		return this.node;
	}
}

export function VNodeExtractEl(node: VNodeExtractable): HTMLElement {
	if ("element" in node) {
		return node.element;
	}

	return node;
}

export class PNodeUtil {
	public static resetStyles<T extends ProxyNode>(
		vnode: T,
		to_reset: ("content" | "style" | "class")[]
	): T {
		const options =
			to_reset.length > 0 ? to_reset : ["content", "style", "class"];

		for (const option of options) {
			/* Clear inner content */
			if (option === "content") {
				vnode.element.innerHTML = "";
			} else if (option === "style") {
				/* Clear styles */
				if (vnode.element instanceof HTMLElement) {
					const style_ref = vnode.element.style;

					for (let i = style_ref.length; i--; ) {
						const name_string = style_ref[i];
						style_ref.removeProperty(name_string);
					}
				}
			} else if (option === "class") {
				/* Clear classes */
				vnode.element.className = "";
			}
		}

		return vnode;
	}
}

export class P_VNodeUtil {
	public static setStyles(
		element: HTMLElement,
		styles: VNodeStyleDeclarationWithProps = {}
	): void {
		if (
			typeof styles != "object" ||
			element instanceof HTMLElement != true
		) {
			return;
		}

		for (const [key, value] of Object.entries(styles)) {
			if (key === "variables") {
				for (const [prop_key, prop_value] of Object.entries(
					value as Record<string, string>
				)) {
					element.style.setProperty(`--${prop_key}`, prop_value);
				}
			}

			if (value == undefined) {
				continue;
			}

			element.style[key as any] = `${value}`;
		}
	}

	public static removeStyles(element: HTMLElement, styles: string[]): void {
		if (element instanceof HTMLElement) {
			for (const style of styles) {
				element.style.removeProperty(style);
			}
		}
	}

	public static injectItems<T extends VNode>(
		vnode: T,
		direction: "append" | "prepend" = "append",
		objs: (
			| VNodeExtractable
			| false
			| string
			| (VNodeExtractable | false | string)[]
		)[]
	): T {
		if (objs.length < 1) {
			return vnode;
		}

		for (const el of objs) {
			if (Array.isArray(el)) {
				objs.splice(objs.indexOf(el), 1, ...el);
			}
		}

		for (const item of objs) {
			if (item == false || item == null || Array.isArray(item)) {
				continue;
			}

			const extracted =
				typeof item === "string" ? item : VNodeExtractEl(item);

			if (direction === "append") {
				vnode.element.append(extracted);
			} else {
				vnode.element.prepend(extracted);
			}
		}

		return vnode;
	}

	public static attr(
		element: HTMLElement,
		attributes: Record<string, string | number | undefined> = {}
	): void {
		if (typeof attributes == "object" && attributes !== null) {
			for (const [key, value] of Object.entries(attributes)) {
				if (value != null) {
					element.setAttribute(key, String(value));
				}
			}
		}
	}

	// public static animate(
	// 	element: HTMLElement,
	// 	styles: StyleDeclaration[],
	// 	options: number | (KeyframeAnimationOptions & DomAnimationOptionsOld)
	// ) {
	// 	const instance = element.animate(styles as Keyframe[], options);

	// 	if (typeof options === "object") {
	// 		instance.onfinish = (ev) => {
	// 			if (options.save === true) {
	// 				this.setStyles(element, styles[styles.length - 1]);
	// 			}

	// 			options.onFinish?.bind(instance)?.(ev);
	// 		};

	// 		options.onCancel && (instance.oncancel = options.onCancel);
	// 		options.onRemove && (instance.onremove = options.onRemove);
	// 		options.animationReference?.(instance);
	// 	}
	// }
}
