import { Emitter } from "@orago/lib";
import type {
	StyleDeclaration,
	VNodeAnimationOptions,
	VNodeStyleDeclarationWithProps,
} from "./interfaces.js";
import { SubMap } from "./submap.js";
import { P_VNodeUtil } from "./utilities.js";
import type { VNode } from "./vnode.js";
class VNodeAnimation<T extends VNode> {
	public animation: Animation;

	constructor(
		private node: T,
		styles: StyleDeclaration[],
		options: VNodeAnimationOptions
	) {
		this.node = node;

		this.animation = this.node.element.animate(
			styles as Keyframe[],
			options.animation
		);

		const use_reverse: boolean =
			options.animation.direction == "reverse" ||
			options.animation.direction == "alternate-reverse";

		const end_index: number = use_reverse ? 0 : styles.length - 1;

		if (typeof options === "object") {
			this.animation.addEventListener("finish", () => {
				if (options.save === true) {
					P_VNodeUtil.setStyles(this.node.element, styles[end_index]);
				}
			});
		}
	}
}

class VNodeUtilityClass<T extends VNode = VNode> {
	constructor(public node: T) {
		this.node = node;
	}

	public nest(run: (arg0: this) => void): this["node"] {
		run(this);
		return this.node;
	}
}

export class VNodeStyle<T extends VNode> extends VNodeUtilityClass<T> {
	public call(styles: VNodeStyleDeclarationWithProps): T;
	public call(value: (arg0: this) => void): T;
	public call(
		value: VNodeStyleDeclarationWithProps | ((arg0: this) => void) = {}
	): T {
		if (typeof value == "object") {
			return this.update(value).node;
		} else if (typeof value == "function") {
			return this.nest(value);
		}

		return this.node;
	}

	// public call(...args: Parameters<this["update"]>) {
	// 	return this.update(...args).node;
	// }

	public update(styles: VNodeStyleDeclarationWithProps = {}) {
		P_VNodeUtil.setStyles(this.node.element, styles);
		return this;
	}

	public remove(...styles: string[]) {
		P_VNodeUtil.removeStyles(this.node.element, styles);
		return this;
	}

	public animate(
		styles: VNodeStyleDeclarationWithProps[],
		options: VNodeAnimationOptions
	) {
		return new VNodeAnimation(this.node, styles, options);
	}
}

export class VNodeClasses<T extends VNode> extends VNodeUtilityClass<T> {
	public static addClasses(element: HTMLElement, args: string[]): void {
		for (const arg of args) {
			if (arg.includes(" ")) {
				args.splice(args.indexOf(arg), 1, ...arg.split(" "));
			} else if (Array.isArray(arg)) {
				args.splice(args.indexOf(arg), 1, ...arg);
			}
		}

		if (Array.isArray(args)) {
			element.classList.add(...args);
		}
	}

	public static removeClasses(element: HTMLElement, args: string[]): void {
		for (const arg of args) {
			if (arg.includes(" ")) {
				args.splice(args.indexOf(arg), 1, ...arg.split(" "));
			}
		}

		if (Array.isArray(args)) {
			element.classList.remove(...args);
		}
	}

	public call(...classes: string[]): T;
	public call(nest: (arg0: this) => void): T;

	public call(...value: string[] | [(arg0: this) => void]): T {
		let [first] = value;

		if (typeof first == "string") {
			return this.set(...(value as string[])).node;
		} else if (typeof first == "function") {
			return this.nest(first);
		}

		return this.node;
	}

	public has(class_name: string): boolean {
		return this.node.element.classList.contains(class_name);
	}

	public add(...classes: string[]) {
		VNodeClasses.addClasses(this.node.element, classes);
		return this;
	}

	public remove(...classes: string[]) {
		VNodeClasses.removeClasses(this.node.element, classes);
		return this;
	}

	public set(...classes: string[]) {
		this.node.element.className = classes.join(" ");
		return this;
	}

	public toggle(class_name: string, status: boolean = !this.has(class_name)) {
		if (status) {
			this.add(class_name);
		} else {
			this.remove(class_name);
		}

		return this;
	}

	/**
	 * @deprecated
	 */
	public toggleClass(
		class_name: string,
		status: boolean = !this.has(class_name)
	) {
		return this.toggle(class_name, status);
	}
}

type ReservedEvents = "append" | "remove";
type VNodeEventsT = {
	append: () => void;
	remove: () => void;
};
export class VNodeEvents<T extends VNode> extends VNodeUtilityClass<T> {
	private static reserved_events: (ReservedEvents | (string & {}))[] = [
		"append",
		"remove",
	];
	private static stored_listeners: WeakMap<HTMLElement, SubMap> =
		new WeakMap();
	private static weak_events: WeakMap<HTMLElement, Emitter<VNodeEventsT>> =
		new WeakMap();

	private static getEvents(element: HTMLElement): Emitter<VNodeEventsT> {
		const existing = VNodeEvents.weak_events.get(element);

		if (existing) {
			return existing;
		} else {
			const emitter = new Emitter<VNodeEventsT>();
			VNodeEvents.weak_events.set(element, emitter);
			return emitter;
		}
	}

	private static getCallbacksGroup(element: HTMLElement) {
		const got = VNodeEvents.stored_listeners.get(element) as
			| SubMap
			| undefined;

		if (got) {
			return got;
		} else {
			const submap = new SubMap<any>();
			VNodeEvents.stored_listeners.set(element, submap);
			return submap;
		}
	}

	public static on(
		element: HTMLElement,
		event: string,
		callback: Function
	): void {
		if (VNodeEvents.reserved_events.includes(event)) {
			VNodeEvents.getEvents(element).on(event, callback);
		} else {
			if (event == "keypress" || event == "keydown" || event == "keyup") {
				P_VNodeUtil.attr(element, { tabIndex: 0 });
			}
			VNodeEvents.getCallbacksGroup(element).add(event, callback);
			element.addEventListener(event, callback as any);
		}
	}

	public static off(
		element: HTMLElement,
		event: string,
		callback?: Function
	) {
		if (VNodeEvents.reserved_events.includes(event)) {
			VNodeEvents.getEvents(element).off(event, callback);
		} else {
			const group = VNodeEvents.getCallbacksGroup(element);

			if (callback) {
				group.remove(event, callback);
				element.removeEventListener(event, callback as any);
			} else {
				for (const callback of group.get(event)) {
					element.removeEventListener(event, callback);
				}
				group.removeAll(event);
			}
		}
	}

	public static once(
		element: HTMLElement,
		event: string,
		callback: Function
	): void {
		const once_callback: any = (...args: any[]) => {
			this.off(element, event, once_callback);
			callback(...args);
			return void 0;
		};

		this.on(element, event, (...args: any[]) => once_callback(...args));
	}

	element: HTMLElement;

	constructor(node: T) {
		super(node);
		this.element = this.node.element;
	}

	public call(...args: Parameters<VNodeEvents<this["node"]>["nest"]>) {
		return this.nest(...args);
	}

	public on(event: string, callback: Function) {
		VNodeEvents.on(this.element, event, callback);
		return this;
	}

	public off(event: string, callback?: Function) {
		VNodeEvents.off(this.element, event, callback);
		return this;
	}

	public once(event: string, callback: Function) {
		VNodeEvents.once(this.element, event, callback);
		return this;
	}
}
