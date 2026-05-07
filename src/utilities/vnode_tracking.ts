import { VNode } from "../vnode.js";
import { VNODE_FLAG } from "./events.js";
import { VNodeEvents } from "./vnode_extras.js";

function getAllRemovedNodes(node: Node): Node[] {
	const nodes: Node[] = [node];
	node.childNodes.forEach((child) => {
		nodes.push(...getAllRemovedNodes(child));
	});
	return nodes;
}
class VNodeStateObserver {
	private inDom(element: HTMLElement) {
		return this.tracked_in_dom.get(element) == true;
	}
	private tracked_in_dom: WeakMap<HTMLElement, boolean> = new WeakMap();
	observer: MutationObserver;

	constructor() {
		this.observer = new MutationObserver((mutations: MutationRecord[]) => {
			const queried = StateTracking.query();

			for (const mutation of mutations) {
				let tmp: HTMLElement[] = [];
				for (const removed of Array.from(mutation.removedNodes)) {
					tmp.push(...(getAllRemovedNodes(removed) as any));
				}
				const removed_query = StateTracking.filterQuery(tmp);
				queried.push(...removed_query);
			}

			for (const node of queried) {
				const element = node.element;

				if (document.body.contains(element)) {
					if (this.inDom(element) != true) {
						VNodeEvents.emit(element, "connected");
					}

					this.tracked_in_dom.set(element, true);
				} else if (this.inDom(element)) {
					/* Was in dom but removed */
					this.tracked_in_dom.set(element, false);
					VNodeEvents.emit(element, "disconnected");
				}
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}

export class StateTracking {
	// state flag
	public static flag = VNODE_FLAG("state");
	public static ref_prop = "__vnode";

	public static initNodeTracking(node: VNode) {
		(node.element as any)[this.ref_prop] = new WeakRef(node);

		// node.element.setAttribute(StateTracking.flag, "");
		node.attr({
			[this.flag]: "",
		});
	}
	public static init(options?: { all?: boolean }) {
		const init_cb = (node: VNode) => this.initNodeTracking(node);
		if (options?.all == true) {
			VNode.events.on("init", init_cb);
		}

		const observer = new VNodeStateObserver();

		return {
			observer,
			destroy() {
				if (options?.all == true) {
					VNode.events.off("init", init_cb);
				}
				observer.observer.disconnect();
			},
		};
	}

	public static filterQuery(list: any[]): VNode[] {
		return list
			.map((e: any) => e?.[this.ref_prop]?.deref())
			.filter((e) => e instanceof VNode);
	}

	public static query(): VNode[] {
		const found = document.querySelectorAll(`[${this.flag}]`);

		return Array.from(found)
			.map((e: any) => e?.[this.ref_prop]?.deref())
			.filter((e) => e instanceof VNode);
	}
}
class VNodeSizeObserver {
	private inDom(element: HTMLElement) {
		return this.tracked_in_dom.get(element) == true;
	}
	private tracked_in_dom: WeakMap<HTMLElement, boolean> = new WeakMap();
	observer: ResizeObserver;

	constructor() {
		this.observer = new ResizeObserver(() => {
			const queried = SizeTracking.query();

			for (const node of queried) {
				const cache_size = SizeTracking.sizes.get(node.element);
				const bounds = node.getBounds();
				const current_size = {
					width: bounds.width,
					height: bounds.height,
				};

				if (
					cache_size == undefined ||
					cache_size.width != current_size.width ||
					cache_size.height != current_size.height
				) {
					SizeTracking.sizes.set(node.element, current_size);
					VNodeEvents.emit(node.element, "resize");
				}
			}
		});

		this.observer.observe(document.body, {});
	}
}

export class SizeTracking {
	public static flag = VNODE_FLAG("size");
	public static ref_prop = "__vnode";

	public static sizes: WeakMap<
		HTMLElement,
		{
			width: number;
			height: number;
		}
	> = new WeakMap();

	public static initNodeTracking(node: VNode) {
		(node.element as any)[this.ref_prop] = new WeakRef(node);

		const bounds = node.getBounds();

		this.sizes.set(node.element, {
			width: bounds.width,
			height: bounds.height,
		});

		// node.element.setAttribute(StateTracking.flag, "");
		node.attr({
			[this.flag]: "",
		});
	}
	public static init(options?: { all?: boolean }) {
		const observer = new VNodeSizeObserver();

		return {
			observer,
			destroy() {
				observer.observer.disconnect();
			},
		};
	}

	public static filterQuery(list: any[]): VNode[] {
		return list
			.map((e: any) => e?.[this.ref_prop]?.deref())
			.filter((e) => e instanceof VNode);
	}

	public static query(): VNode[] {
		const found = document.querySelectorAll(`[${this.flag}]`);

		return Array.from(found)
			.map((e: any) => e?.[this.ref_prop]?.deref())
			.filter((e) => e instanceof VNode);
	}
}
