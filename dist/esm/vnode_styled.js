import { ObserverTracking } from "./dom_observer.js";
import { VNode } from "./vnode.js";
export class StyledVNode extends VNode {
    constructor(type, instance) {
        super(type);
        this.instance = instance;
        this.instance = instance;
        this.instance.insert();
    }
    appendTo(obj, direction) {
        super.appendTo(obj, direction);
        this.instance.insert();
        return this;
    }
    remove() {
        super.remove();
        if (this.instance.getUsageCount() === 0) {
            this.instance.remove();
        }
        return this;
    }
}
export class JCSSTracker {
    constructor(instance, observer) {
        this.instance = instance;
        this.instance = instance;
        this.instance.insert();
        this.observer = observer !== null && observer !== void 0 ? observer : new ObserverTracking();
        function callback() {
            if (this.instance.getUsageCount() === 0) {
                this.instance.remove();
            }
            else {
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
