import type {
	VN_Extractable,
	VNodeStyleDeclarationWithProps
} from "./interfaces.js";
import { ProxyNode } from "./proxynode.js";
import { VNode } from "./vnode.js";

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
			| VN_Extractable
			| false
			| string
			| (VN_Extractable | false | string)[]
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
				typeof item === "string" ? item : VNodeUtilExtend.extractEl(item);

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
		attributes: Record<string, string | number> = {}
	): void {
		if (typeof attributes == "object" && attributes !== null) {
			for (const [key, value] of Object.entries(attributes)) {
				element.setAttribute(key, value + "");
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

export class VNodeUtilExtend {
	public static qs(
		selector: string,
		element: HTMLElement | Document = document
	): VNode | null {
		const current = element.querySelector(selector);

		return current ? new VNode(current as HTMLElement) : null;
	}

	public static qsAll(
		selector: string,
		element: HTMLElement | Document = document
	): VNode[] {
		return Array.from(element.querySelectorAll(selector)).map((current) => {
			return new VNode(current as HTMLElement);
		});
	}

	public static extractEl(node: VN_Extractable): HTMLElement {
		if (node instanceof ProxyNode || node instanceof VNode) {
			return node.element;
		} else {
			return node;
		}
	}

	public static getChildren(extractable: VN_Extractable): VNode[] {
		const extracted = this.extractEl(extractable);

		return Array.from(extracted.children).map(
			(document_el) => new VNode(document_el as HTMLElement)
		);
	}

	public static setTabIndex(extractable: VN_Extractable, index: number) {
		const extracted = this.extractEl(extractable);

		if (typeof index == "number") {
			if (0 > index) {
				extracted.removeAttribute("tabindex");
			} else {
				extracted.setAttribute("tabindex", "0");
			}
		}
	}
}
