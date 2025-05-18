import Emitter from "@orago/lib/emitter";
import type {
	DomAnimationOptionsOld,
	StyleDeclaration,
	StyleDeclarationWithProps,
	VNodeListeners,
} from "./interfaces.js";

import { ObserverTracking } from "./dom_observer.js";
import { SubMap } from "./submap.js";
import { PNodeUtil } from "./utilities.js";
import { VNode } from "./vnode.js";

// export type {
// 	StyleDeclaration,
// 	StyleDeclarationWithProps,
// } from "./interfaces.js";

type PN_Extractable = ProxyNode | VNode | HTMLElement;

type ProxyNodeEvents = {
	append: () => void;
	remove: () => void;
};

// const node_tracking = new ObserverTracking();
type ReservedEvents = "append" | "remove";

/**
 * Record<element_tag: string, proxy_node: ProxyNode>;
 */
type NewNode = Record<string, ProxyNode>;

let reserved_events: (ReservedEvents | (string & {}))[] = ["append", "remove"];

export class ProxyNode {
	private static stored_listeners: WeakMap<HTMLElement, SubMap> =
		new WeakMap();
	private static weak_events: WeakMap<HTMLElement, Emitter<ProxyNodeEvents>> =
		new WeakMap();
	// private static qs = qs;
	// private static qsAll = qsAll;
	public static tracking = new ObserverTracking();

	static getEvents(element: HTMLElement): Emitter<ProxyNodeEvents> {
		const existing = ProxyNode.weak_events.get(element);

		if (existing) {
			return existing;
		} else {
			const emitter = new Emitter<ProxyNodeEvents>();
			ProxyNode.weak_events.set(element, emitter);
			return emitter;
		}
	}

	static extractEl(node: PN_Extractable): HTMLElement {
		if (node instanceof ProxyNode || node instanceof VNode) {
			return node.element;
		} else {
			return node;
		}
	}

	static isNode(el: ProxyNode | any): boolean {
		return el instanceof ProxyNode;
	}

	private static getCallbacksGroup(element: HTMLElement) {
		const got = ProxyNode.stored_listeners.get(element) as
			| SubMap
			| undefined;

		if (got) {
			return got;
		} else {
			const submap = new SubMap<any>();
			ProxyNode.stored_listeners.set(element, submap);
			return submap;
		}
	}

	private static getListeners(element: HTMLElement, event: string) {
		const group = ProxyNode.getCallbacksGroup(element);
		return group.get(event);
	}

	// private data: any = {};
	// private privateData: any = {};
	element: HTMLElement;
	listeners: VNodeListeners = {};

	// get call() {
	// 	return this;
	// }

	constructor(el: Element | string | ProxyNode) {
		if (typeof el === "string") {
			this.element = document.createElement(el);
		} else if (
			// el instanceof Element ||
			el instanceof HTMLElement ||
			el instanceof HTMLInputElement
		)
			this.element = el;
		else if (el instanceof ProxyNode) {
			this.element = el.element;
		} else {
			throw new Error("Invalid element");
		}
	}

	get focused() {
		return document.activeElement === this.element;
	}

	get childFocused() {
		return this.focused || this.element.contains(document.activeElement);
	}

	get bounds() {
		return this.element.getBoundingClientRect();
	}

	get parent(): ProxyNode | undefined {
		const parent = this.element.parentElement;

		if (parent != null) {
			return new ProxyNode(parent);
		}
	}

	get value(): string {
		if (this.element instanceof HTMLInputElement) {
			return this.element.value;
		} else {
			return this.element.textContent ?? "";
		}
	}

	set value(value: string) {
		if (this.element instanceof HTMLInputElement) {
			this.element.value = value;
		} else {
			this.element.textContent = value;
		}
	}

	/** @deprecated - removed in the next version */
	get wrapper(): this["ref"] {
		return this.ref;
	}

	ref(run: (arg0: this) => void): this {
		run(this);

		return this;
	}

	//#region //* Default Utils *//
	text(content: string): this {
		this.element.textContent = content;

		return this;
	}

	id(value: string): this {
		this.element.id = value;

		return this;
	}

	attr(attributes: { [attribute: string]: string | number } = {}): this {
		if (typeof attributes != "object") {
			return this;
		}

		for (const [key, value] of Object.entries(attributes)) {
			this.element.setAttribute(key, value + "");
		}

		return this;
	}

	swap(node: this | HTMLElement): this {
		const new_node = ProxyNode.extractEl(node);

		this.element.replaceWith(new_node);
		this.element = new_node;

		return this;
	}

	/**
	 * Creates a cloned node
	 */
	clone(): ProxyNode {
		return new ProxyNode(this.element.cloneNode(true) as Element);
	}

	/**
	 * Clears inner content
	 */
	clear(): this {
		this.element.textContent = "";

		return this;
	}

	/**
	 * Checks if dom contains element
	 */
	exists(): boolean {
		return document.body.contains(this.element);
	}

	/**
	 * Returns a list of child proxy nodes
	 */
	getChildren(): ProxyNode[] {
		return Array.from(this.element.children).map(
			(documentEl) => new ProxyNode(documentEl)
		);
	}

	/**
	 *
	 * @param to_reset
	 * @returns
	 * @deprecated - Possibly removed in the next version
	 */
	reset(...to_reset: ("content" | "style" | "class")[]): this {
		return PNodeUtil.resetStyles(this, to_reset);
	}
	//#endregion //* Default Utils *//

	//#region //* Classes *//
	class(...args: string[]): this {
		this.element.className = args.join(" ");

		return this;
	}

	hasClass(className: string): boolean {
		return this.element.classList.contains(className);
	}

	addClass(...args: string[]): this {
		for (const arg of args) {
			if (arg.includes(" ")) {
				args.splice(args.indexOf(arg), 1, ...arg.split(" "));
			} else if (Array.isArray(arg)) {
				args.splice(args.indexOf(arg), 1, ...arg);
			}
		}

		if (Array.isArray(args)) {
			this.element.classList.add(...args);
		}

		return this;
	}

	removeClass(...args: string[]): this {
		for (const arg of args) {
			if (arg.includes(" ")) {
				args.splice(args.indexOf(arg), 1, ...arg.split(" "));
			}
		}

		if (Array.isArray(args)) {
			this.element.classList.remove(...args);
		}

		return this;
	}

	toggleClass(
		className: string,
		status: boolean = !this.hasClass(className)
	): this {
		status ? this.addClass(className) : this.removeClass(className);

		return this;
	}
	//#endregion //* Classes *//

	//#region //* Styles *//
	styles(styles: StyleDeclarationWithProps = {}): this {
		if (typeof styles != "object") {
			return this;
		} else if (this.element instanceof HTMLElement != true) {
			return this;
		}

		for (const [key, value] of Object.entries(styles)) {
			if (key === "props") {
				for (const [prop_key, prop_value] of Object.entries(
					<{ [key: string]: string }>value
				)) {
					this.element.style.setProperty(`--${prop_key}`, prop_value);
				}
			}

			// @ts-ignore
			this.element.style[key] = value;
		}

		return this;
	}

	removeStyles(...styles: string[]): this {
		if (this.element instanceof HTMLElement != true) {
			return this;
		}

		for (const style of styles) {
			this.element.style.removeProperty(style);
		}

		return this;
	}
	//#endregion //* Styles *//

	getEvents() {
		return ProxyNode.getEvents(this.element);
	}

	//#region //* Listeners *//

	on(event: string, callback: Function): this {
		if (reserved_events.includes(event)) {
			this.getEvents().on(event, callback);
		} else {
			if (event == "keypress" || event == "keydown" || event == "keyup") {
				this.attr({ tabindex: 0 });
			}
			ProxyNode.getCallbacksGroup(this.element).add(event, callback);
			this.element.addEventListener(event, callback as any);
		}

		return this;
	}

	off(event: string, callback?: Function): this {
		if (reserved_events.includes(event)) {
			this.getEvents().off(event, callback);
		} else {
			const group = ProxyNode.getCallbacksGroup(this.element);

			if (callback) {
				group.remove(event, callback);
				this.element.removeEventListener(event, callback as any);
			} else {
				for (const callback of group.get(event)) {
					this.element.removeEventListener(event, callback);
				}
				group.removeAll(event);
			}
		}

		return this;
	}

	public once(event: string, callback: Function): this {
		const once_callback: any = (...args: any[]) => {
			this.off(event, once_callback);
			callback(...args);
			return void 0;
		};

		this.on(event, (...args: any[]) => once_callback(...args));

		return this;
	}

	addListener(events: {
		[key: string]: { [listener: string]: Function };
	}): this {
		for (const [key, event] of Object.entries(events)) {
			for (const [listener, fn] of Object.entries(event)) {
				if (
					listener == "keypress" ||
					listener == "keydown" ||
					listener == "keyup"
				) {
					this.attr({ tabindex: 0 });
				}

				const func = fn.bind(this);

				this.listeners[key] ??= {};
				this.listeners[key][listener] = func;

				this.element.addEventListener(listener, func);
			}
		}

		return this;
	}

	removeListener(key: any): this {
		for (const listener in this.listeners[key]) {
			this.element.removeEventListener(
				listener,
				this.listeners[key][listener]
			);
		}

		delete this.listeners[key];

		return this;
	}
	//#endregion //* Listeners *//

	//#region //* Intervals *//
	/**
	 *
	 * @deprecated - stop using this dumbass
	 */
	interval(
		callback: Function,
		time: number = 1000,
		immediate: boolean = false
	): this {
		const toCall = () =>
			callback.bind(this)(this, () => clearInterval(temp_interval));

		if (immediate) {
			toCall();
		}
		const temp_interval = setInterval(toCall, time);

		this.on("remove", () => clearInterval(temp_interval));

		return this;
	}
	//#endregion //* Intervals *//

	//#region //* Random *//
	remove() {
		this.element.remove();

		return this;
	}

	/**
	 * clears the content and appends
	 */
	setContent(...content: any[]): this {
		return this.clear().append(...content);
	}

	append(
		...objs: (
			| PN_Extractable
			| false
			| string
			| (PN_Extractable | false | string)[]
		)[]
	): this {
		if (objs.length < 1) {
			return this;
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

			this.element.append(
				typeof item === "string" ? item : ProxyNode.extractEl(item)
			);
		}

		return this;
	}

	appendTo(obj: PN_Extractable | false): this {
		if (obj == false) {
			return this;
		}

		obj.append(ProxyNode.extractEl(this.element));

		return this;
	}

	prependTo(obj: PN_Extractable): this {
		if (obj == null) {
			return this;
		}

		obj.prepend(ProxyNode.extractEl(this.element));

		return this;
	}

	prepend(...objs: PN_Extractable[]): this {
		if (objs.length < 1) {
			return this;
		}

		for (const el of objs) {
			if (Array.isArray(el)) {
				const i = objs.indexOf(el);

				objs.splice(i, i + el.length);
				objs.push(...el);
			}
		}

		for (const el of objs) {
			this.element.prepend(ProxyNode.extractEl(el));
		}

		return this;
	}

	focus() {
		setTimeout(
			() => this.element instanceof HTMLElement && this.element.focus(),
			0
		);

		return this;
	}

	scroll(x = 0, y = 0) {
		setTimeout(() => this.element.scroll(x, y), 500);

		return this;
	}

	setTabIndex(index: number): this {
		if (typeof index == "number") {
			if (0 > index) {
				this.element.removeAttribute("tabindex");
			} else {
				this.element.setAttribute("tabindex", "0");
			}
		}

		return this;
	}

	/**
	 * @deprecated - Possibly removed in the next version
	 */
	horizontalScrolling() {
		this.on("wheel", (event: any) => {
			event.preventDefault();
			this.element.scrollLeft += event.deltaY;
		});

		return this;
	}

	animate(
		styles: Array<StyleDeclaration>,
		options: number | (KeyframeAnimationOptions & DomAnimationOptionsOld)
	) {
		const instance = this.element.animate(<Array<Keyframe>>styles, options);

		if (typeof options === "object") {
			instance.onfinish = (ev) => {
				if (options.save === true) {
					this.styles(styles[styles.length - 1]);
				}

				options.onFinish?.bind(instance)?.(ev);
			};

			options.onCancel && (instance.oncancel = options.onCancel);
			options.onRemove && (instance.onremove = options.onRemove);
			options.animationReference?.(instance);
		}

		return this;
	}
	//#endregion //* Random *//
}

export function generateProxyNode(el: HTMLElement | Element): ProxyNode {
	return new ProxyNode(el);
}

export const newNode: NewNode = new Proxy(
	{},
	{
		get(target: object, element_tag: string): ProxyNode {
			return new ProxyNode(document.createElement(element_tag));

			// generateProxyNode(document.createElement(elementTag));
		},
	}
);

export function qs(
	selector: string,
	element: HTMLElement | Document = document
): ProxyNode | null {
	const currentNode = element.querySelector(selector);

	return currentNode ? new ProxyNode(currentNode) : null;
}

export function qsAll(
	selector: string,
	element: HTMLElement | Document = document
): ProxyNode[] {
	return Array.from(element.querySelectorAll(selector)).map(($) =>
		$ ? new ProxyNode($) : newNode.div
	);
}

export default {
	newNode,
	qs,
	generateProxyNode,
	fetch,
};
