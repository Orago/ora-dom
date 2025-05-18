"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObserverTracking = exports.ObserverGroup = exports.ObservableNode = void 0;
const proxynode_js_1 = require("./proxynode.js");
const emitter_1 = __importDefault(require("@orago/lib/emitter"));
class ObservableNode {
    constructor(group, node) {
        this.group = group;
        this.node = node;
        this.events = new emitter_1.default();
        this.id = ++ObservableNode.ids;
        this.killOnRemove = false;
        this.node = node;
        this.inDom = document.body.contains(this.node.element);
        this.group = group;
        this.group.alive.set(this.id, this);
    }
    handleMutation() {
        if (document.body.contains(this.node.element)) {
            if (this.inDom != true) {
                this.events.emit("append", this.node);
            }
            this.inDom = true;
        }
        else if (this.inDom) {
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
exports.ObservableNode = ObservableNode;
ObservableNode.ids = 0;
class ObserverGroup {
    constructor() {
        this.alive = new Map();
        const main_observer = new MutationObserver(() => {
            for (const observer of this.alive.values()) {
                observer.handleMutation();
            }
        });
        main_observer.observe(document.body, { childList: true, subtree: true });
    }
    create(node) {
        return new ObservableNode(this, node);
    }
}
exports.ObserverGroup = ObserverGroup;
class ObserverTracking {
    static inDom(element) {
        return this.tracked_in_dom.get(element) == true;
    }
    static handle(element) {
        var _a, _b;
        if (document.body.contains(element)) {
            if (this.inDom(element) != true) {
                (_a = proxynode_js_1.ProxyNode.getEvents(element)) === null || _a === void 0 ? void 0 : _a.emit("append");
            }
            this.tracked_in_dom.set(element, true);
        }
        else if (this.inDom(element)) {
            this.tracked_in_dom.set(element, false);
            (_b = proxynode_js_1.ProxyNode.getEvents(element)) === null || _b === void 0 ? void 0 : _b.emit("remove");
        }
    }
    constructor() {
        this.list = new Set();
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
exports.ObserverTracking = ObserverTracking;
ObserverTracking.tracked_in_dom = new WeakMap();
