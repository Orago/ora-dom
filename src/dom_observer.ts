import { ProxyNode } from "./proxynode.js";
import Emitter from "@orago/lib/emitter";

export class ObservableNode {
	private static ids: number = 0;

	events: Emitter<{
		append: (node: ProxyNode) => void;
		remove: (node: ProxyNode) => void;
	}> = new Emitter();

	id: number = ++ObservableNode.ids;
	inDom: boolean;
	killOnRemove: boolean = false;

	constructor(public group: ObserverGroup, private node: ProxyNode) {
		this.node = node;
		this.inDom = document.body.contains(this.node.element);

		this.group = group;
		this.group.alive.set(this.id, this);
	}

	handleMutation() {
		// If it's in dom now but wasn't before
		if (document.body.contains(this.node.element)) {
			if (this.inDom != true) {
				this.events.emit("append", this.node);
			}

			this.inDom = true;
		} else if (this.inDom) {
			/* Was in dom but removed */
			this.inDom = false;

			this.events.emit("remove", this.node);

			if (this.killOnRemove == true) {
				this.kill();
			}
		}
	}

	kill() {
		this.group.alive.delete(this.id);
	}
}

export class ObserverGroup {
	alive = new Map();

	constructor() {
		const main_observer = new MutationObserver(() => {
			for (const observer of this.alive.values()) {
				observer.handleMutation();
			}
		});

		main_observer.observe(document.body, { childList: true, subtree: true });
	}

	create(node: ProxyNode) {
		return new ObservableNode(this, node);
	}
}

export class ObserverTracking {
	static inDom(element: HTMLElement) {
		return this.tracked_in_dom.get(element) == true;
	}

	static handle(element: HTMLElement) {
		// If it's in dom now but wasn't before
		if (document.body.contains(element)) {
			if (this.inDom(element) != true) {
				ProxyNode.getEvents(element)?.emit("append");
			}

			this.tracked_in_dom.set(element, true);
		} else if (this.inDom(element)) {
			/* Was in dom but removed */
			this.tracked_in_dom.set(element, false);
			ProxyNode.getEvents(element)?.emit("remove");
		}
	}

	private static tracked_in_dom: WeakMap<HTMLElement, boolean> =
		new WeakMap();

	list = new Set<HTMLElement>();
	observer: MutationObserver;

	constructor() {
		this.observer = new MutationObserver(() => {
			for (const element of this.list) {
				ObserverTracking.handle(element);
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
}
