import { Emitter } from "@orago/lib";
import type {
	StyleDeclarationWithProps,
	VN_Extractable,
	VNodeAppendable,
} from "./interfaces.js";
import { ProxyNode } from "./proxynode.js";
import { P_VNodeUtil, VNodeUtilExtend } from "./utilities.js";
import {
	valueTrap,
	VNodeClasses,
	VNodeEvents,
	VNodeStyle,
} from "./vnode_extras.js";

export class VNode {
	public static Util = VNodeUtilExtend;

	public static indexing = new Map();

	/**
	 * Replacement for 'newNode' on ProxyNode Utilities
	 */
	public static new: Record<string, VNode> = new Proxy(
		{},
		{
			get(target: object, element_tag: string): VNode {
				return new VNode(document.createElement(element_tag));

				// generateProxyNode(document.createElement(elementTag));
			},
		}
	);

	public static from(el: Element | string | VNode | ProxyNode) {
		if (typeof el === "string") {
			// this.element = document.createElement(el);
			return new VNode(document.createElement(el));
		} else if (
			// el instanceof Element ||
			el instanceof HTMLElement ||
			el instanceof HTMLInputElement
		) {
			// this.element = el;
			return new VNode(el);
		} else if (el instanceof VNode) {
			return new VNode(el.element);
			// this.element = el.element;
		} else if (el instanceof ProxyNode) {
			return new VNode(el.element);
		} else {
			throw new Error("Invalid element");
		}
	}

	public static extractEl(node: VN_Extractable): HTMLElement {
		if (node instanceof ProxyNode || node instanceof VNode) {
			return node.element;
		} else {
			return node;
		}
	}

	public static send_events: boolean = false;

	public static events: Emitter<
		{
			create: (node: VNode) => void;
			remove: (node: VNode) => void;
		},
		true
	> = new Emitter();

	public element: HTMLElement;

	/**
	 * Styling manager
	 */
	// public style = new VNodeStyle(this);
	// public temp_style: VNodeStyle | undefined;
	public style!: VNodeStyle; //= VNodeUtilTrap("style", this, () => new VNodeStyle(this));
	// = createVNodeExtrasWrapperClosure(this, VNodeStyle);

	/**
	 * Class manager
	 */
	// public class = new VNodeClasses(this);
	// public temp_class: VNodeClasses | undefined;
	public class!: VNodeClasses;

	/**
	 * Event manager
	 */
	// public events = new VNodeEvents(this);
	// public temp_events: VNodeEvents | undefined;
	public events!: VNodeEvents;

	constructor(
		element: keyof HTMLElementTagNameMap | (string & {}) | VN_Extractable
	) {
		valueTrap(this, "style", () => new VNodeStyle(this));
		valueTrap(this, "class", () => new VNodeClasses(this));
		valueTrap(this, "events", () => new VNodeEvents(this));

		if (typeof element === "string") {
			this.element = document.createElement(element);
		} else {
			this.element = VNode.extractEl(element);
		}

		if (VNode.send_events === true) {
			VNode.events.emit("create", this);
		}
	}

	public attr(attributes: Record<string, string | number> = {}): this {
		P_VNodeUtil.attr(this.element, attributes);
		return this;
	}

	public swap(node: VN_Extractable): this {
		const new_node = VNode.extractEl(node);

		this.element.replaceWith(new_node);
		this.element = new_node;

		return this;
	}

	public id(value: string): this;
	public id(value: undefined): string;
	public id(value: string | undefined = undefined): any {
		if (value == undefined) {
			return this.element.id;
		} else {
			this.element.id = value;

			return this;
		}
	}

	public append(...objs: VNodeAppendable): this {
		return P_VNodeUtil.injectItems(this, "append", objs);
	}

	public prepend(...objs: VNodeAppendable): this {
		return P_VNodeUtil.injectItems(this, "prepend", objs);
	}

	public appendTo(
		obj: VN_Extractable | false,
		direction: "append" | "prepend" = "append"
	): this {
		if (obj == false) {
			return this;
		}

		if (direction === "append") {
			obj.append(VNodeUtilExtend.extractEl(this.element));
		} else {
			obj.prepend(VNodeUtilExtend.extractEl(this.element));
		}

		return this;
	}

	public getBounds() {
		return this.element.getBoundingClientRect();
	}

	public value(value: string): this;
	public value(value: undefined): string;
	public value(value: string | undefined = undefined): any {
		if (this.element instanceof HTMLInputElement) {
			if (value == undefined) {
				return this.element.value;
			} else {
				this.element.value = value;

				return this;
			}
		} else {
			if (value == undefined) {
				return this.element.textContent;
			} else {
				this.element.textContent = value;

				return this;
			}
		}
	}

	public focus() {
		if (this.inDom()) {
			if (this.element instanceof HTMLElement) {
				this.element.focus();
			}
		} else {
			setTimeout(() => {
				if (this.element instanceof HTMLElement) {
					this.element.focus();
				}
			}, 0);
		}

		return this;
	}

	public ref(run: (arg0: this) => void): this {
		run(this);

		return this;
	}

	public remove() {
		this.element.remove();

		// if (VNode.send_events === true) {
		// 	VNode.events.emit("remove", this);
		// }

		return this;
	}

	public setContent(...content: any[]): this {
		return this.clear().append(...content);
	}

	/**
	 * Clears inner content
	 */
	public clear(): this {
		this.element.textContent = "";

		return this;
	}

	public setStyles(styles: StyleDeclarationWithProps) {
		this.style.update(styles);

		return this;
	}

	public setClasses(...classes: string[]) {
		this.class.set(...classes);
		return this;
	}

	inDom(parent = document.body) {
		return parent.contains(this.element);
	}

	scroll(x = 0, y = 0) {
		this.element.scroll(x, y);
		return this;
	}
}
