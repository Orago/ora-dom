(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../vnode.js", "./vnode_extras.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateTracking = void 0;
    const vnode_js_1 = require("../vnode.js");
    const vnode_extras_js_1 = require("./vnode_extras.js");
    function getAllRemovedNodes(node) {
        const nodes = [node];
        node.childNodes.forEach((child) => {
            nodes.push(...getAllRemovedNodes(child));
        });
        return nodes;
    }
    class VNodeObserver {
        inDom(element) {
            return this.tracked_in_dom.get(element) == true;
        }
        constructor() {
            this.tracked_in_dom = new WeakMap();
            this.observer = new MutationObserver((mutations) => {
                const queried = StateTracking.query();
                for (const mutation of mutations) {
                    let tmp = [];
                    for (const removed of Array.from(mutation.removedNodes)) {
                        tmp.push(...getAllRemovedNodes(removed));
                    }
                    const removed_query = StateTracking.filterQuery(tmp);
                    queried.push(...removed_query);
                }
                for (const node of queried) {
                    const element = node.element;
                    if (document.body.contains(element)) {
                        if (this.inDom(element) != true) {
                            vnode_extras_js_1.VNodeEvents.emit(element, "dom-append");
                        }
                        this.tracked_in_dom.set(element, true);
                    }
                    else if (this.inDom(element)) {
                        /* Was in dom but removed */
                        this.tracked_in_dom.set(element, false);
                        vnode_extras_js_1.VNodeEvents.emit(element, "dom-remove");
                    }
                }
            });
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }
    class StateTracking {
        static initNodeTracking(node) {
            node.element[this.ref_prop] = new WeakRef(node);
            // node.element.setAttribute(StateTracking.flag, "");
            node.attr({
                [StateTracking.flag]: "",
            });
        }
        static init(options) {
            const init_cb = (node) => this.initNodeTracking(node);
            if ((options === null || options === void 0 ? void 0 : options.all) == true) {
                vnode_js_1.VNode.events.on("init", init_cb);
            }
            const observer = new VNodeObserver();
            return {
                observer,
                destroy() {
                    if ((options === null || options === void 0 ? void 0 : options.all) == true) {
                        vnode_js_1.VNode.events.off("init", init_cb);
                    }
                    observer.observer.disconnect();
                },
            };
        }
        static filterQuery(list) {
            return list
                .map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e[StateTracking.ref_prop]) === null || _a === void 0 ? void 0 : _a.deref(); })
                .filter((e) => e instanceof vnode_js_1.VNode);
        }
        static query() {
            const found = document.querySelectorAll(`[${StateTracking.flag}]`);
            return Array.from(found)
                .map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e[StateTracking.ref_prop]) === null || _a === void 0 ? void 0 : _a.deref(); })
                .filter((e) => e instanceof vnode_js_1.VNode);
        }
    }
    exports.StateTracking = StateTracking;
    StateTracking.flag = "__vnode_e";
    StateTracking.ref_prop = "__vnode";
});
