import { Emitter } from "@orago/lib";

type ObservedCallback = () => void;
type ObserverNodeEvents = {
	append: ObservedCallback;
	remove: ObservedCallback;
};

export class ObserverTracking {
	private static inDom(element: HTMLElement) {
		return this.tracked_in_dom.get(element) == true;
	}

	static handle(element: HTMLElement) {
		// If it's in dom now but wasn't before
		if (document.body.contains(element)) {
			if (this.inDom(element) != true) {
				this.getEvents(element)?.emit("append");
			}

			this.tracked_in_dom.set(element, true);
		} else if (this.inDom(element)) {
			/* Was in dom but removed */
			this.tracked_in_dom.set(element, false);
			this.getEvents(element)?.emit("remove");
		}
	}

	private static getEvents(
		element: HTMLElement
	): Emitter<ObserverNodeEvents> {
		const existing = this.weak_events.get(element);

		if (existing) {
			return existing;
		} else {
			const emitter = new Emitter<ObserverNodeEvents>();
			this.weak_events.set(element, emitter);
			return emitter;
		}
	}

	private static weak_events: WeakMap<
		HTMLElement,
		Emitter<ObserverNodeEvents>
	> = new WeakMap();

	private static tracked_in_dom: WeakMap<HTMLElement, boolean> =
		new WeakMap();
	private wrap_map: Map<ObservedCallback, ObservedCallback> = new Map();

	list = new Set<HTMLElement>();
	observer: MutationObserver;
	events: Emitter<
		{
			append: ObservedCallback;
			remove: ObservedCallback;
			any: () => void;
		},
		true
	> = new Emitter();

	constructor() {
		this.observer = new MutationObserver(() => {
			for (const element of this.list) {
				ObserverTracking.handle(element);
			}

			this.events.emit("any");
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
	private cleanupElement(element: HTMLElement) {
		// Do cleanup
		if (ObserverTracking.getEvents(element).all.size == 0) {
			this.list.delete(element);
		}
	}

	on(
		element: HTMLElement,
		event: "append" | "remove",
		callback: ObservedCallback
	) {
		this.list.add(element);
		ObserverTracking.getEvents(element).on(event, callback);
		return this;
	}

	off(
		element: HTMLElement,
		event: "append" | "remove",
		callback?: ObservedCallback
	) {
		ObserverTracking.getEvents(element).off(event, callback);
		this.cleanupElement(element);
		return this;
	}

	once(
		element: HTMLElement,
		event: "append" | "remove",
		callback: ObservedCallback
	) {
		this.list.add(element);

		ObserverTracking.getEvents(element)
			.once(event, callback)
			.once(event, () => this.cleanupElement(element));

		return this;
	}
}
