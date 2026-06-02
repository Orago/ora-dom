import { Emitter, Signal, State } from "@orago/lib";
import { SubMap } from "../submap.js";
import { VNodeUtilities, VNodeUtilityClass } from "../vnode_utilities.js";
import type { VNode } from "../vnode.js";
import { StateTracking } from "./vnode_tracking.js";
import { ReservedEvents } from "./base_components.js";

export type VNodeEventsT = typeof ReservedEvents;
export type VNodeEventKeys =
	| (keyof HTMLElementEventMap | keyof VNodeEventsT)
	| (string & {});

type StateValues<T extends readonly State<any>[]> = {
	[K in keyof T]: ReturnType<T[K]["get"]>;
};




export class VNodeEventGroup {
	map: Map<keyof HTMLElementEventMap, Function> = new Map();

	constructor(private node: VNode) {
		this.node = node;
	}

	public on(event: keyof HTMLElementEventMap, callback: Function): this {
		this.map.set(event, callback);
		this.node.events.on(event, callback);
		return this;
	}

	public off(event: keyof HTMLElementEventMap, callback?: Function): this {
		this.map.delete(event);
		this.node.events.off(event, callback);
		return this;
	}

	public clear(): this {
		for (const [event, callback] of this.map.entries()) {
			this.off(event, callback);
		}
		return this;
	}
}

class VNodeEventCollection {
	private static reserved_events: (keyof VNodeEventsT | (string & {}))[] = [
		...Object.keys(ReservedEvents),
	];

	private static isReserved(event: VNodeEventKeys): boolean {
		return this.reserved_events.includes(event);
	}
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

	public useSignal<
		const T extends readonly ([Emitter, string[]] | Signal<any> | Emitter)[]
	>(events: T, callback: (node: this) => void): this {
		const handler = () => callback(this);
		const normalized = events.flatMap(normalizeEvent);

		this.on("connected", () => {
			for (const e of normalized) {
				e.on(handler);
			}
		});
		this.on("disconnected", () => {
			for (const e of normalized) {
				e.off(handler);
			}
		});

		return this;
	}

	public useStates<const T extends readonly State<any>[]>(
		states: T,
		callback: (values: StateValues<T>, node: this) => void,
		immediate = false
	): this {
		const getValues = () => states.map((s) => s.get()) as StateValues<T>;
		const handler = () => callback(getValues(), this);

		if (immediate == true) {
			handler();
		}

		this.on("connected", () => {
			for (const state of states) {
				state.change.on(handler);
			}
		});
		this.on("disconnected", () => {
			for (const state of states) {
				state.change.off(handler);
			}
		});

		return this;
	}
}

export function normalizeEvent(
	e: Signal<any> | Emitter | [Emitter, string[]]
): {
	on(handler: () => void): void;
	off(handler: () => void): void;
}[] {
	if (e instanceof Signal) {
		return [
			{
				on: (h) => e.on(h),
				off: (h) => e.off(h),
			},
		];
	} else if (e instanceof Emitter) {
		return [
			{
				on: (h) => e.on("*", h),
				off: (h) => e.off("*", h),
			},
		];
	} else {
		const [emitter, names]: [Emitter, string[]] = e;
		return names.map((name) => ({
			on: (h) => emitter.on(name, h),
			off: (h) => emitter.off(name, h),
		}));
	}
}
