import { Emitter } from "@orago/lib";
import type {
	StyleDeclaration,
	VNodeAnimationOptions,
	VNodeStyleDeclarationWithProps,
} from "../interfaces.js";
import { SubMap } from "../submap.js";
import {
	VNodeUtilities,
	VNodeUtilityClass,
} from "../vnode_utilities.js";
import type { VNode } from "../vnode.js";
import { SizeTracking, StateTracking } from "./vnode_tracking.js";
import { ReservedEvents, VNodeEventKeys, VNodeEventsT } from "./events.js";

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
					VNodeUtilities.setStyles(this.node.element, styles[end_index]);
				}
			});
		}
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
		VNodeUtilities.setStyles(this.node.element, styles);
		
		return this;
	}

	public remove(...styles: string[]) {
		VNodeUtilities.removeStyles(this.node.element, styles);
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

const dom_tracking_events: (keyof VNodeEventsT)[] = [
	// "dom-append",
	// "dom-remove",
	"connected",
	"disconnected",
];

class VNodeEventCollection {
	private static reserved_events: (keyof VNodeEventsT | (string & {}))[] = [
		...Object.keys(ReservedEvents),
		// "dom-append",
		// "dom-remove",
	];

	private static isReserved(event: VNodeEventKeys) {
		return this.reserved_events.includes(event);
	}

	// 	private static isReserved(event: string): event is typeof VNodeEventCollection["reserved_events"][number] {
	// 	return this.reserved_events.includes(event as any);
	// }
	public static on(
		COLLECTION: VNodeEventCollection,
		event: VNodeEventKeys,
		callback: Function
	) {
		if (this.isReserved(event)) {
			// if (event == "dom-append" || event == "dom-remove") {
			// }
			COLLECTION.events.on(event, callback);
		} else {
			if (event == "keypress" || event == "keydown" || event == "keyup") {
				VNodeUtilities.setAttributes(COLLECTION.element, {
					tabIndex: 0,
				});
			}
			COLLECTION.listeners.add(event, callback);
			COLLECTION.element.addEventListener(event, callback as any);
		}
	}

	public static off(
		COLLECTION: VNodeEventCollection,
		event: VNodeEventKeys,
		callback?: Function
	) {
		if (this.isReserved(event)) {
			COLLECTION.events.off(event, callback);
		} else {
			const group = COLLECTION.listeners;

			if (callback == undefined) {
				for (const callback of group.get(event)) {
					COLLECTION.element.removeEventListener(event, callback);
				}
				group.removeAll(event);
			} else {
				group.remove(event, callback);
				COLLECTION.element.removeEventListener(event, callback as any);
			}
		}
	}

	public static once(
		COLLECTION: VNodeEventCollection,
		event: VNodeEventKeys,
		callback: Function
	): void {
		const once_callback: any = (...args: any[]) => {
			this.off(COLLECTION, event, once_callback);
			callback(...args);
			return void 0;
		};

		this.on(COLLECTION, event, (...args: any[]) => once_callback(...args));
	}

	public static emit(
		COLLECTION: VNodeEventCollection,
		event: VNodeEventKeys,
		...args: any[]
	): void {
		if (this.isReserved(event)) {
			COLLECTION.events.emit(event, ...args);
		} else {
			COLLECTION.listeners.add(event, ...args);
			COLLECTION.element.dispatchEvent(
				new CustomEvent(event, { detail: args })
			);
		}
	}

	public static clear(COLLECTION: VNodeEventCollection) {
		for (const event of COLLECTION.listeners.all.keys()) {
			// Delete off whole event instead of each individual callback
			this.off(COLLECTION, event as any);
		}

		COLLECTION.events.all.clear();
	}
	listeners: SubMap<Record<string, any>, true> = new SubMap();
	events: Emitter<VNodeEventsT> = new Emitter();

	readonly element: HTMLElement;

	constructor(ref: HTMLElement) {
		this.element = ref;
	}
}

export class VNodeEvents<T extends VNode> extends VNodeUtilityClass<T> {
	private static c_events: WeakMap<HTMLElement, VNodeEventCollection> =
		new WeakMap();

	public static getAlways(element: HTMLElement): VNodeEventCollection {
		const found = this.c_events.get(element);

		if (found != undefined) {
			return found;
		}

		const created = new VNodeEventCollection(element);
		this.c_events.set(element, created);
		return created;
	}

	public static on(
		element: HTMLElement,
		event: VNodeEventKeys,
		callback: Function
	): void {
		VNodeEventCollection.on(this.getAlways(element), event, callback);
	}

	public static off(
		element: HTMLElement,
		event: VNodeEventKeys,
		callback?: Function
	) {
		VNodeEventCollection.off(this.getAlways(element), event, callback);
	}

	public static once(
		element: HTMLElement,
		event: VNodeEventKeys,
		callback: Function
	): void {
		VNodeEventCollection.once(this.getAlways(element), event, callback);
	}
	public static emit(
		element: HTMLElement,
		event: VNodeEventKeys,
		...args: any[]
	): void {
		const COLLECTION = this.c_events.get(element);
		if (COLLECTION == undefined) return;

		VNodeEventCollection.emit(COLLECTION, event, ...args);
	}

	public static clear(element: HTMLElement) {
		const COLLECTION = this.c_events.get(element);
		if (COLLECTION == undefined) return;

		VNodeEventCollection.clear(COLLECTION);
		this.c_events.delete(COLLECTION.element);
	}

	element: HTMLElement;

	constructor(node: T) {
		super(node);
		this.element = this.node.element;
	}

	public call(...args: Parameters<VNodeEvents<this["node"]>["nest"]>) {
		return this.nest(...args);
	}

	public on(event: VNodeEventKeys, callback: Function) {
		if (event == "connected" || event == "disconnected") {
			StateTracking.initNodeTracking(this.node);
		}

		if (event == "resize") {
			SizeTracking.initNodeTracking(this.node);
		}

		VNodeEvents.on(this.element, event, callback);
		return this;
	}

	public off(event: VNodeEventKeys, callback?: Function) {
		VNodeEvents.off(this.element, event, callback);
		return this;
	}

	public once(event: VNodeEventKeys, callback: Function) {
		VNodeEvents.once(this.element, event, callback);
		return this;
	}

	public clear() {
		VNodeEvents.clear(this.element);
	}
}
