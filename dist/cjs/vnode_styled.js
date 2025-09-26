"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JCSSTracker = exports.StyledVNode = void 0;
const dom_observer_js_1 = require("./dom_observer.js");
const vnode_js_1 = require("./vnode.js");
class StyledVNode extends vnode_js_1.VNode {
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
exports.StyledVNode = StyledVNode;
class JCSSTracker {
    constructor(instance, observer) {
        this.instance = instance;
        this.instance = instance;
        this.instance.insert();
        this.observer = observer !== null && observer !== void 0 ? observer : new dom_observer_js_1.ObserverTracking();
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
exports.JCSSTracker = JCSSTracker;
