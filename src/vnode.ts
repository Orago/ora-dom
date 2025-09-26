import { Emitter, makeCallableClass, trapValue } from "@orago/lib";
import type {
	StyleDeclarationWithProps,
	VNodeExtractable,
	VNodeAppendable,
	VNodeElementName,
} from "./interfaces.js";
import { ProxyNode } from "./proxynode.js";
import { P_VNodeUtil, VNodeExtractEl } from "./utilities.js";
import { VNodeClasses, VNodeEvents, VNodeStyle } from "./vnode_extras.js";

export class VNode {
	public static Util = class VNodeUtilExtend {
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
			return Array.from(element.querySelectorAll(selector)).map(
				(current) => {
					return new VNode(current as HTMLElement);
				}
			);
		}

		public static extractEl = VNodeExtractEl;

		public static getChildren(extractable: VNodeExtractable): VNode[] {
			const extracted = this.extractEl(extractable);

			return Array.from(extracted.children).map(
				(document_el) => new VNode(document_el as HTMLElement)
			);
		}
	};

	public static indexing = new Map();

	/**
	 * Replacement for 'newNode' on ProxyNode Utilities
	 */
	public static new: Record<VNodeElementName, VNode> = new Proxy(
		{},
		{
			get(target: object, element_tag: string): VNode {
				return new VNode(document.createElement(element_tag));
				// generateProxyNode(document.createElement(elementTag));
			},
		}
	) as any;

	public static from(el: VNodeElementName | VNodeExtractable) {
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

	/**
	 * @deprecated Use VNode.Util.extractEl
	 */
	public static extractEl = VNodeExtractEl;

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
	// public style!: ReturnType<typeof makeCallableInstance<typeof VNodeStyle<this>>>; //= VNodeUtilTrap("style", this, () => new VNodeStyle(this));
	public style!: ReturnType<
		typeof makeCallableClass<typeof VNodeStyle<this>>
	>; //= VNodeUtilTrap("style", this, () => new VNodeStyle(this));
	// = createVNodeExtrasWrapperClosure(this, VNodeStyle);

	/**
	 * Class manager
	 */
	// public class = new VNodeClasses(this);
	// public temp_class: VNodeClasses | undefined;
	// public class!: CallableUtilUnion<typeof VNodeClasses<this>>;
	public class!: ReturnType<
		typeof makeCallableClass<typeof VNodeClasses<this>>
	>;

	/**
	 * Event manager
	 */
	// public events = new VNodeEvents(this);
	// public temp_events: VNodeEvents | undefined;
	public events!: ReturnType<
		typeof makeCallableClass<typeof VNodeEvents<this>>
	>;

	constructor(element: VNodeElementName | VNodeExtractable) {
		trapValue(this, "style", () => makeCallableClass(VNodeStyle, this));
		trapValue(this, "class", () => makeCallableClass(VNodeClasses, this));
		trapValue(this, "events", () => makeCallableClass(VNodeEvents, this));

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

	public swap(node: VNodeExtractable): this {
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
		obj: VNodeExtractable | false,
		direction: "append" | "prepend" = "append"
	): this {
		if (obj == false) {
			return this;
		}

		if (direction === "append") {
			obj.append(VNodeExtractEl(this.element));
		} else {
			obj.prepend(VNodeExtractEl(this.element));
		}

		return this;
	}

	public getBounds() {
		return this.element.getBoundingClientRect();
	}

	public value(): string;
	public value(value: string | number): this;
	public value(value: string | number | undefined = undefined): any {
		if (
			this.element instanceof HTMLInputElement ||
			this.element instanceof HTMLSelectElement
		) {
			if (value == undefined) {
				return this.element.value;
			} else {
				this.element.value = value.toString();

				return this;
			}
		} else if (this.element instanceof HTMLImageElement) {
			if (value == undefined) {
				return this.element.src;
			} else {
				this.element.src = value.toString();

				return this;
			}
		} else {
			if (value == undefined) {
				return this.element.textContent;
			} else {
				this.element.textContent = value.toString();

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

const gotten = VNode.new;

gotten;
