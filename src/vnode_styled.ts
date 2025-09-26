import { ObserverTracking } from "./dom_observer.js";
import type { VNodeExtractable } from "./interfaces.js";
import type { JCSS } from "./jss.js";
import { VNode } from "./vnode.js";

export class StyledVNode extends VNode {
	constructor(type: keyof HTMLElementTagNameMap, private instance: JCSS) {
		super(type);

		this.instance = instance;
		this.instance.insert();
	}

	public appendTo(
		obj: VNodeExtractable | false,
		direction?: "append" | "prepend"
	): this {
		super.appendTo(obj, direction);
		this.instance.insert();
		return this;
	}

	public remove(): this {
		super.remove();

		if (this.instance.getUsageCount() === 0) {
			this.instance.remove();
		}

		return this;
	}
}

export class JCSSTracker {
	observer: ObserverTracking;

	callback: () => void;
	constructor(private instance: JCSS, observer?: ObserverTracking) {
		this.instance = instance;
		this.instance.insert();
		this.observer = observer ?? new ObserverTracking();

		function callback(this: JCSSTracker) {
			if (this.instance.getUsageCount() === 0) {
				this.instance.remove();
			} else {
				this.instance.insert();
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
