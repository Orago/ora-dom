import { Emitter, makeCallableClass, State, trapValue } from "@orago/lib";
import type {
	VNodeExtractable,
	VNodeChildList,
	VNodeElementName,
	ResolveElement,
	VNodeWhereOptions,
} from "./interfaces.js";
import { ProxyNode } from "./proxynode.js";
import { VNodeUtilities, VNodeExtractEl } from "./vnode_utilities.js";
import {
	VNodeClasses,
	VNodeEvents,
	VNodeStyle,
} from "./utilities/vnode_extras.js";

type StateValues<T extends readonly State<any>[]> = {
	[K in keyof T]: ReturnType<T[K]["get"]>;
};

type EmitterValue<S> = S extends Emitter<infer T> ? T : never;

export class VNode<E extends HTMLElement = HTMLElement> {
	public static Utilities = VNodeUtilities;
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

		public static where(
			options: VNodeWhereOptions,
			element: HTMLElement | Document = document
		): VNode[] {
			const found = VNodeUtilExtend.qsAll(
				VNodeUtilities.whereString(options),
				element
			);

			if (options.text != undefined) {
				return VNodeUtilities.elementTextFind(
					options.text,
					found.map(
						(e) => [e.element.textContent, e] as [string, VNode]
					)
				).map((vec) => vec[1]);
			} else {
				return found;
			}
		}

		public static extractEl = VNodeExtractEl;

		public static getChildren(extractable: VNodeExtractable): VNode[] {
			const extracted = VNodeExtractEl(extractable);

			return Array.from(extracted.children).map(
				(document_el) => new VNode(document_el as HTMLElement)
			);
		}
	};

	public static indexing = new Map();

	/**
	 * Replacement for 'newNode' on ProxyNode Utilities
	 * @deprecated
	 */
	public static of: Record<VNodeElementName, VNode> = new Proxy(
		{},
		{
			get(target: object, element_tag: string): VNode {
				return new VNode(document.createElement(element_tag));
				// generateProxyNode(document.createElement(elementTag));
			},
		}
	) as any;

	public static getElement<T extends VNodeElementName | VNodeExtractable>(
		el: T
	): ResolveElement<T> {
		if (typeof el === "string") {
			return document.createElement(el) as ResolveElement<T>;
		} else if (
			el instanceof HTMLElement ||
			el instanceof HTMLInputElement
		) {
			return el as ResolveElement<T>;
		} else if (el instanceof VNode) {
			return el.element as ResolveElement<T>;
		} else if (el instanceof ProxyNode) {
			return el.element as ResolveElement<T>;
		} else {
			throw new Error("Invalid element");
		}
	}

	public static from<T extends VNodeElementName | VNodeExtractable>(
		el: T
	): VNode<ResolveElement<T>> {
		const element = VNode.getElement(el);
		return new VNode(element);
	}

	/**
	 * @deprecated Use VNode.Util.extractEl
	 */
	public static extractEl = VNodeExtractEl;

	public static send_events: boolean = false;

	public static events: Emitter<
		{
			init: (node: VNode) => void;
			/**
			 * Do not rely on this
			 * @deprecated
			 * @param node
			 * @returns
			 */
			add: (node: VNode) => void;
			/**
			 * Do not rely on this
			 * @deprecated
			 * @param node
			 * @returns
			 */
			remove: (node: VNode) => void;
		},
		true
	> = new Emitter();

	public element: ResolveElement<E>;

	/**
	 * Styling manager
	 */
	public style!: ReturnType<
		typeof makeCallableClass<typeof VNodeStyle<this>>
	>; //= VNodeUtilTrap("style", this, () => new VNodeStyle(this));
	// = createVNodeExtrasWrapperClosure(this, VNodeStyle);

	/**
	 * Class manager
	 */
	public class!: ReturnType<
		typeof makeCallableClass<typeof VNodeClasses<this>>
	>;

	/**
	 * Event manager
	 */
	public events!: ReturnType<
		typeof makeCallableClass<typeof VNodeEvents<this>>
	>;

	constructor(element: VNodeElementName | VNodeExtractable) {
		trapValue(
			this,
			"style",
			() => makeCallableClass(VNodeStyle, this) as any
		);
		trapValue(
			this,
			"class",
			() => makeCallableClass(VNodeClasses, this) as any
		);
		trapValue(
			this,
			"events",
			() => makeCallableClass(VNodeEvents, this as any) as any
		);

		if (typeof element === "string") {
			this.element = document.createElement(element) as any;
		} else {
			this.element = VNode.Util.extractEl(element) as any;
		}

		if (VNode.send_events === true) {
			VNode.events.emit("add", this as any);
		}

		VNode.events.emit("init", this as any);
	}

	public ref(run: (arg0: this) => void): this {
		run(this);
		return this;
	}

	public use(plugins: ((node: this) => void)[]): this {
		for (const plugin of plugins) {
			plugin(this);
		}

		return this;
	}

	public attr(
		attributes: Partial<Record<string, string | number> & E> = {}
	): this {
		VNodeUtilities.setAttributes(this.element, attributes);
		return this;
	}

	public swap(node: VNodeExtractable): this {
		const new_node = VNode.Util.extractEl(node);
		this.element.replaceWith(new_node);
		this.element = new_node as any;
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

	public append(...objs: VNodeChildList): this {
		VNodeUtilities.injectItems(this.element, "append", objs);

		return this;
	}

	public prepend(...objs: VNodeChildList): this {
		VNodeUtilities.injectItems(this.element, "prepend", objs);
		return this;
	}

	public appendTo(
		obj: VNodeExtractable | false,
		direction: "append" | "prepend" = "append"
	): this {
		if (obj == false) {
			return this;
		} else {
			if (direction === "append") {
				obj.append(VNodeExtractEl(this.element));
			} else {
				obj.prepend(VNodeExtractEl(this.element));
			}
			return this;
		}
	}

	public getBounds() {
		return this.element.getBoundingClientRect();
	}

	public value(): any;
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

	public dataset(): Partial<Record<string, string>>;
	public dataset(record: "clear" | Partial<Record<string, string>>): this;
	public dataset(record?: "clear" | Partial<Record<string, string>>): any {
		if (record == undefined) {
			return this.element.dataset;
		}

		if (record == "clear") {
			return this.dataset(
				Object.fromEntries(
					Object.keys(this.element.dataset).map((key) => [
						VNodeUtilities.formatAttributeName("camel", key),
						undefined,
					])
				)
			);
		}

		for (let [key, value] of Object.entries(record)) {
			key = VNodeUtilities.formatAttributeName("camel", key);
			if (value == undefined) {
				delete this.element.dataset[key];
			} else {
				this.element.dataset[key] = value;
			}
		}
		return this;
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

	public remove() {
		this.element.remove();
		return this;
	}

	public setContent(...content: any[]): this {
		return this.clear().append(...content);
	}

	/** Clears inner content */
	public clear(): this {
		this.element.textContent = "";
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

new VNode("div").events([["meow", () => {}]]);
