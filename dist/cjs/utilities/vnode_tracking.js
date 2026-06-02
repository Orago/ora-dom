"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeTracking = exports.StateTracking = void 0;
const vnode_js_1 = require("../vnode.js");
const base_components_js_1 = require("./base_components.js");
const vnode_extras_js_1 = require("./vnode_extras.js");
function getAllRemovedNodes(node) {
    const nodes = [node];
    node.childNodes.forEach((child) => {
        nodes.push(...getAllRemovedNodes(child));
    });
    return nodes;
}
class VNodeStateObserver {
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
                        vnode_extras_js_1.VNodeEvents.emit(element, "connected");
                    }
                    this.tracked_in_dom.set(element, true);
                }
                else if (this.inDom(element)) {
                    /* Was in dom but removed */
                    this.tracked_in_dom.set(element, false);
                    vnode_extras_js_1.VNodeEvents.emit(element, "disconnected");
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
            [this.flag]: "",
        });
    }
    static init(options) {
        const init_cb = (node) => this.initNodeTracking(node);
        if ((options === null || options === void 0 ? void 0 : options.all) == true) {
            vnode_js_1.VNode.events.on("init", init_cb);
        }
        const observer = new VNodeStateObserver();
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
            .map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e[this.ref_prop]) === null || _a === void 0 ? void 0 : _a.deref(); })
            .filter((e) => e instanceof vnode_js_1.VNode);
    }
    static query() {
        const found = document.querySelectorAll(`[${this.flag}]`);
        return Array.from(found)
            .map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e[this.ref_prop]) === null || _a === void 0 ? void 0 : _a.deref(); })
            .filter((e) => e instanceof vnode_js_1.VNode);
    }
}
exports.StateTracking = StateTracking;
// state flag
StateTracking.flag = (0, base_components_js_1.VNODE_FLAG)("state");
StateTracking.ref_prop = "__vnode";
class VNodeSizeObserver {
    inDom(element) {
        return this.tracked_in_dom.get(element) == true;
    }
    constructor() {
        this.tracked_in_dom = new WeakMap();
        this.observer = new ResizeObserver(() => {
            const queried = SizeTracking.query();
            for (const node of queried) {
                const cache_size = SizeTracking.sizes.get(node.element);
                const bounds = node.getBounds();
                const current_size = {
                    width: bounds.width,
                    height: bounds.height,
                };
                if (cache_size == undefined ||
                    cache_size.width != current_size.width ||
                    cache_size.height != current_size.height) {
                    SizeTracking.sizes.set(node.element, current_size);
                    vnode_extras_js_1.VNodeEvents.emit(node.element, "resize");
                }
            }
        });
        this.observer.observe(document.body, {});
    }
}
class SizeTracking {
    static initNodeTracking(node) {
        node.element[this.ref_prop] = new WeakRef(node);
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
    static init(options) {
        const observer = new VNodeSizeObserver();
        return {
            observer,
            destroy() {
                observer.observer.disconnect();
            },
        };
    }
    static filterQuery(list) {
        return list
            .map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e[this.ref_prop]) === null || _a === void 0 ? void 0 : _a.deref(); })
            .filter((e) => e instanceof vnode_js_1.VNode);
    }
    static query() {
        const found = document.querySelectorAll(`[${this.flag}]`);
        return Array.from(found)
            .map((e) => { var _a; return (_a = e === null || e === void 0 ? void 0 : e[this.ref_prop]) === null || _a === void 0 ? void 0 : _a.deref(); })
            .filter((e) => e instanceof vnode_js_1.VNode);
    }
}
exports.SizeTracking = SizeTracking;
SizeTracking.flag = (0, base_components_js_1.VNODE_FLAG)("size");
SizeTracking.ref_prop = "__vnode";
SizeTracking.sizes = new WeakMap();
