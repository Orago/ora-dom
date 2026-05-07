(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@orago/lib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObserverTracking = void 0;
    const lib_1 = require("@orago/lib");
    class ObserverTracking {
        static inDom(element) {
            return this.tracked_in_dom.get(element) == true;
        }
        static handle(element) {
            var _a, _b;
            // If it's in dom now but wasn't before
            if (document.body.contains(element)) {
                if (this.inDom(element) != true) {
                    (_a = this.getEvents(element)) === null || _a === void 0 ? void 0 : _a.emit("append");
                }
                this.tracked_in_dom.set(element, true);
            }
            else if (this.inDom(element)) {
                /* Was in dom but removed */
                this.tracked_in_dom.set(element, false);
                (_b = this.getEvents(element)) === null || _b === void 0 ? void 0 : _b.emit("remove");
            }
        }
        static getEvents(element) {
            const existing = this.weak_events.get(element);
            if (existing) {
                return existing;
            }
            else {
                const emitter = new lib_1.Emitter();
                this.weak_events.set(element, emitter);
                return emitter;
            }
        }
        constructor() {
            // private wrap_map: Map<ObservedCallback, ObservedCallback> = new Map();
            this.list = new Set();
            this.events = new lib_1.Emitter();
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
        cleanupElement(element) {
            // Do cleanup
            if (ObserverTracking.getEvents(element).all.size == 0) {
                this.list.delete(element);
            }
        }
        on(element, event, callback) {
            this.list.add(element);
            ObserverTracking.getEvents(element).on(event, callback);
            return this;
        }
        off(element, event, callback) {
            ObserverTracking.getEvents(element).off(event, callback);
            this.cleanupElement(element);
            return this;
        }
        once(element, event, callback) {
            this.list.add(element);
            ObserverTracking.getEvents(element)
                .once(event, callback)
                .once(event, () => this.cleanupElement(element));
            return this;
        }
    }
    exports.ObserverTracking = ObserverTracking;
    ObserverTracking.weak_events = new WeakMap();
    ObserverTracking.tracked_in_dom = new WeakMap();
});
