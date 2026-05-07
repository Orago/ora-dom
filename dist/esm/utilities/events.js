import { Emitter } from "@orago/lib";
import { SubMap } from "../submap.js";
import { P_VNodeUtil, VNodeUtilityClass } from "../utilities.js";
import { StateTracking } from "./vnode_tracking.js";
export class VNodeEventGroup {
    constructor(node) {
        this.node = node;
        this.map = new Map();
        this.node = node;
    }
    on(event, callback) {
        this.map.set(event, callback);
        this.node.events.on(event, callback);
        return this;
    }
    off(event, callback) {
        this.map.delete(event);
        this.node.events.off(event, callback);
        return this;
    }
    clear() {
        for (const [event, callback] of this.map.entries()) {
            this.off(event, callback);
        }
        return this;
    }
}
class VNodeEventCollection {
    static isReserved(event) {
        return this.reserved_events.includes(event);
    }
    static on(COLLECTION, event, callback) {
        if (this.isReserved(event)) {
            // if (event == "dom-append" || event == "dom-remove") {
            // }
            COLLECTION.events.on(event, callback);
        }
        else {
            if (event == "keypress" || event == "keydown" || event == "keyup") {
                P_VNodeUtil.attr(COLLECTION.element, { tabIndex: 0 });
            }
            COLLECTION.listeners.add(event, callback);
            COLLECTION.element.addEventListener(event, callback);
        }
    }
    static off(COLLECTION, event, callback) {
        if (this.isReserved(event)) {
            COLLECTION.events.off(event, callback);
        }
        else {
            const group = COLLECTION.listeners;
            if (callback == undefined) {
                for (const callback of group.get(event)) {
                    COLLECTION.element.removeEventListener(event, callback);
                }
                group.removeAll(event);
            }
            else {
                group.remove(event, callback);
                COLLECTION.element.removeEventListener(event, callback);
            }
        }
    }
    static once(COLLECTION, event, callback) {
        const once_callback = (...args) => {
            this.off(COLLECTION, event, once_callback);
            callback(...args);
            return void 0;
        };
        this.on(COLLECTION, event, (...args) => once_callback(...args));
    }
    static emit(COLLECTION, event, ...args) {
        if (this.isReserved(event)) {
            COLLECTION.events.emit(event, ...args);
        }
        else {
            COLLECTION.listeners.add(event, ...args);
            COLLECTION.element.dispatchEvent(new CustomEvent(event, { detail: args }));
        }
    }
    static clear(COLLECTION) {
        for (const event of COLLECTION.listeners.all.keys()) {
            // Delete off whole event instead of each individual callback
            this.off(COLLECTION, event);
        }
        COLLECTION.events.all.clear();
    }
    constructor(ref) {
        this.listeners = new SubMap();
        this.events = new Emitter();
        this.element = ref;
    }
}
VNodeEventCollection.reserved_events = [
    "dom-append",
    "dom-remove",
];
export class VNodeEvents extends VNodeUtilityClass {
    static getAlways(element) {
        const found = this.c_events.get(element);
        if (found != undefined) {
            return found;
        }
        const created = new VNodeEventCollection(element);
        this.c_events.set(element, created);
        return created;
    }
    static on(element, event, callback) {
        VNodeEventCollection.on(this.getAlways(element), event, callback);
    }
    static off(element, event, callback) {
        VNodeEventCollection.off(this.getAlways(element), event, callback);
    }
    static once(element, event, callback) {
        VNodeEventCollection.once(this.getAlways(element), event, callback);
    }
    static emit(element, event, ...args) {
        const COLLECTION = this.c_events.get(element);
        if (COLLECTION == undefined)
            return;
        VNodeEventCollection.emit(COLLECTION, event, ...args);
    }
    static clear(element) {
        const COLLECTION = this.c_events.get(element);
        if (COLLECTION == undefined)
            return;
        VNodeEventCollection.clear(COLLECTION);
        this.c_events.delete(COLLECTION.element);
    }
    constructor(node) {
        super(node);
        this.element = this.node.element;
    }
    call(...args) {
        return this.nest(...args);
    }
    on(event, callback) {
        if (event == "dom-append" || event == "dom-remove") {
            StateTracking.initNodeTracking(this.node);
        }
        VNodeEvents.on(this.element, event, callback);
        return this;
    }
    off(event, callback) {
        VNodeEvents.off(this.element, event, callback);
        return this;
    }
    once(event, callback) {
        VNodeEvents.once(this.element, event, callback);
        return this;
    }
    clear() {
        VNodeEvents.clear(this.element);
    }
}
VNodeEvents.c_events = new WeakMap();
