import { ObserverTracking } from "./dom_observer.js";
import type { VNodeElementName, VNodeExtractable } from "./interfaces.js";
import {
	OraCss,
	OraCssStyleOptions,
	OraCssStyle,
	OraCssStyleNames,
} from "./ora_css.js";
import { VNode } from "./vnode.js";


type StyleOptions = Partial<Record<OraCssStyleNames, string>>;

class StyledNodeManager {
	public class: OraCssStyle;

	constructor(public readonly id: number) {
		this.class = new OraCssStyle("." + this.getClassName(), {});
	}

	/**
	 * Returns the generated classname prefixed by vns_
	 * which stands for Virtual Node Style -
	 */
	getClassName() {
		return `vns_${this.id.toString(16)}`;
	}
}

export abstract class StyledVNode<
	E extends HTMLElement = HTMLElement
> extends VNode<E> {
	static managers: Map<typeof VNode, StyledNodeManager> = new Map();
	static class_index = 0;

	/** Should not be changed */
	private static sheet = new OraCss();

	/** May be overridden by extending the class */
	static styles: Partial<Record<OraCssStyleNames, string>> & { _: unknown } =
		{} as any;

	static getConstructor<T extends VNode>(ref: T): typeof VNode {
		return ref.constructor as any;
	}

	static findOrCreate(
		c: typeof VNode<any>,
		styles: OraCssStyleOptions | OraCssStyle
	) {
		const is_new = StyledVNode.managers.get(c) == undefined;
		const manager = this.getManager(c);

		if (is_new) {
			if (styles instanceof OraCssStyle) {
				manager.class.data = styles.data;
			} else {
				manager.class.data = styles;
			}
			this.sheet.styles.insert(manager.class);
			this.sheet.build();
		}

		return manager.getClassName();
	}

	/**
	 * Connects by finding or creating an instance
	 */
	static connect(
		class_ref: VNode,
		styles: OraCssStyleOptions | OraCssStyle
	): void;
	/**
	 * Connects if there is an existing instance
	 */
	static connect(class_ref: VNode): void;
	static connect(
		class_ref: VNode,
		styles?: OraCssStyleOptions | OraCssStyle
	): void {
		const c = this.getConstructor(class_ref);
		if (styles == undefined) {
			const manager = StyledVNode.managers.get(c);
			if (manager != undefined) {
				class_ref.class.add(manager.getClassName());
			}
		} else {
			const class_name = this.findOrCreate(c, styles);
			class_ref.class.add(class_name);
		}
	}

	static getManager(c: typeof VNode): StyledNodeManager {
		let manager = StyledVNode.managers.get(c);

		if (manager == undefined) {
			const id = ++StyledVNode.class_index;
			manager = new StyledNodeManager(id);
			StyledVNode.managers.set(c, manager);
		}

		return manager;
	}

	/** Destroys the class and it's relations for a vnode class */
	static destroy(class_ref: VNode) {
		const c = this.getConstructor(class_ref);
		const manager = this.getManager(c);
		const jss_class = this.sheet.styles.list.get(manager.class.name);

		if (jss_class) {
			this.sheet.styles.remove(jss_class);
			this.sheet.build();
		}
		StyledVNode.managers.delete(c);
	}

	public static init() {
		this.sheet.attach();
	}

	protected static validStyles<
		S extends Partial<Record<OraCssStyleNames, string>>
	>(styles: S): S & { _: unknown } {
		return styles as any;
	}

	constructor(element: VNodeElementName | VNodeExtractable) {
		super(element);
		StyledVNode.connect(this, this.getConstructor().styles);
	}
	getConstructor(): typeof StyledVNode {
		return this.constructor as any;
	}
}

export class JCSSTracker {
	callback: () => void;
	constructor(
		private instance: OraCss,
		public observer: ObserverTracking = new ObserverTracking()
	) {
		this.instance.attach();

		function callback(this: JCSSTracker) {
			if (this.instance.getUsageCount() === 0) {
				this.instance.detach();
			} else {
				this.instance.attach();
			}
		}

		this.callback = callback.bind(this);
	}

	enable() {
		this.disable();
		this.observer.events.off("any", this.callback);
	}

	disable() {
		this.observer.events.off("any", this.callback);
	}
}
