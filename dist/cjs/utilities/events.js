"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEvent = exports.VNodeEvents = exports.VNodeEventGroup = exports.VNODE_FLAG = void 0;
const lib_1 = require("@orago/lib");
const submap_js_1 = require("../submap.js");
const vnode_utilities_js_1 = require("../vnode_utilities.js");
const vnode_tracking_js_1 = require("./vnode_tracking.js");
const base_components_js_1 = require("./base_components.js");
const VNODE_FLAG = (name) => `__vnode_${name}`;
exports.VNODE_FLAG = VNODE_FLAG;
class VNodeEventGroup {
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
exports.VNodeEventGroup = VNodeEventGroup;
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
                vnode_utilities_js_1.VNodeUtilities.setAttributes(COLLECTION.element, {
                    tabIndex: 0,
                });
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
        this.listeners = new submap_js_1.SubMap();
        this.events = new lib_1.Emitter();
        this.element = ref;
    }
}
VNodeEventCollection.reserved_events = [
    ...Object.keys(base_components_js_1.ReservedEvents),
];
class VNodeEvents extends vnode_utilities_js_1.VNodeUtilityClass {
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
        if (event == "connected" || event == "disconnected") {
            vnode_tracking_js_1.StateTracking.initNodeTracking(this.node);
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
    useSignal(events, callback) {
        const handler = () => callback(this);
        const normalized = events.flatMap(normalizeEvent);
        this.on("connected", () => {
            for (const e of normalized) {
                e.on(handler);
            }
        });
        this.on("disconnected", () => {
            for (const e of normalized) {
                e.off(handler);
            }
        });
        return this;
    }
    useStates(states, callback, immediate = false) {
        const getValues = () => states.map((s) => s.get());
        const handler = () => callback(getValues(), this);
        if (immediate == true) {
            handler();
        }
        this.on("connected", () => {
            for (const state of states) {
                state.change.on(handler);
            }
        });
        this.on("disconnected", () => {
            for (const state of states) {
                state.change.off(handler);
            }
        });
        return this;
    }
}
exports.VNodeEvents = VNodeEvents;
VNodeEvents.c_events = new WeakMap();
function normalizeEvent(e) {
    if (e instanceof lib_1.Signal) {
        return [
            {
                on: (h) => e.on(h),
                off: (h) => e.off(h),
            },
        ];
    }
    else if (e instanceof lib_1.Emitter) {
        return [
            {
                on: (h) => e.on("*", h),
                off: (h) => e.off("*", h),
            },
        ];
    }
    else {
        const [emitter, names] = e;
        return names.map((name) => ({
            on: (h) => emitter.on(name, h),
            off: (h) => emitter.off(name, h),
        }));
    }
}
exports.normalizeEvent = normalizeEvent;
