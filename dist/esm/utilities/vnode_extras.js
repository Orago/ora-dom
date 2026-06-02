import { Emitter } from "@orago/lib";
import { SubMap } from "../submap.js";
import { VNodeUtilities, VNodeUtilityClass, } from "../vnode_utilities.js";
import { SizeTracking, StateTracking } from "./vnode_tracking.js";
import { ReservedEvents } from "./events.js";
class VNodeAnimation {
    constructor(node, styles, options) {
        this.node = node;
        this.node = node;
        this.animation = this.node.element.animate(styles, options.animation);
        const use_reverse = options.animation.direction == "reverse" ||
            options.animation.direction == "alternate-reverse";
        const end_index = use_reverse ? 0 : styles.length - 1;
        if (typeof options === "object") {
            this.animation.addEventListener("finish", () => {
                if (options.save === true) {
                    VNodeUtilities.setStyles(this.node.element, styles[end_index]);
                }
            });
        }
    }
}
export class VNodeStyle extends VNodeUtilityClass {
    call(value = {}) {
        if (typeof value == "object") {
            return this.update(value).node;
        }
        else if (typeof value == "function") {
            return this.nest(value);
        }
        return this.node;
    }
    // public call(...args: Parameters<this["update"]>) {
    // 	return this.update(...args).node;
    // }
    update(styles = {}) {
        VNodeUtilities.setStyles(this.node.element, styles);
        return this;
    }
    remove(...styles) {
        VNodeUtilities.removeStyles(this.node.element, styles);
        return this;
    }
    animate(styles, options) {
        return new VNodeAnimation(this.node, styles, options);
    }
}
export class VNodeClasses extends VNodeUtilityClass {
    static addClasses(element, args) {
        for (const arg of args) {
            if (arg.includes(" ")) {
                args.splice(args.indexOf(arg), 1, ...arg.split(" "));
            }
            else if (Array.isArray(arg)) {
                args.splice(args.indexOf(arg), 1, ...arg);
            }
        }
        if (Array.isArray(args)) {
            element.classList.add(...args);
        }
    }
    static removeClasses(element, args) {
        for (const arg of args) {
            if (arg.includes(" ")) {
                args.splice(args.indexOf(arg), 1, ...arg.split(" "));
            }
        }
        if (Array.isArray(args)) {
            element.classList.remove(...args);
        }
    }
    call(...value) {
        let [first] = value;
        if (typeof first == "string") {
            return this.set(...value).node;
        }
        else if (typeof first == "function") {
            return this.nest(first);
        }
        return this.node;
    }
    has(class_name) {
        return this.node.element.classList.contains(class_name);
    }
    add(...classes) {
        VNodeClasses.addClasses(this.node.element, classes);
        return this;
    }
    remove(...classes) {
        VNodeClasses.removeClasses(this.node.element, classes);
        return this;
    }
    set(...classes) {
        this.node.element.className = classes.join(" ");
        return this;
    }
    toggle(class_name, status = !this.has(class_name)) {
        if (status) {
            this.add(class_name);
        }
        else {
            this.remove(class_name);
        }
        return this;
    }
    /**
     * @deprecated
     */
    toggleClass(class_name, status = !this.has(class_name)) {
        return this.toggle(class_name, status);
    }
}
const dom_tracking_events = [
    // "dom-append",
    // "dom-remove",
    "connected",
    "disconnected",
];
class VNodeEventCollection {
    static isReserved(event) {
        return this.reserved_events.includes(event);
    }
    // 	private static isReserved(event: string): event is typeof VNodeEventCollection["reserved_events"][number] {
    // 	return this.reserved_events.includes(event as any);
    // }
    static on(COLLECTION, event, callback) {
        if (this.isReserved(event)) {
            // if (event == "dom-append" || event == "dom-remove") {
            // }
            COLLECTION.events.on(event, callback);
        }
        else {
            if (event == "keypress" || event == "keydown" || event == "keyup") {
                VNodeUtilities.setAttributes(COLLECTION.element, {
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
        this.listeners = new SubMap();
        this.events = new Emitter();
        this.element = ref;
    }
}
VNodeEventCollection.reserved_events = [
    ...Object.keys(ReservedEvents),
    // "dom-append",
    // "dom-remove",
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
        if (event == "connected" || event == "disconnected") {
            StateTracking.initNodeTracking(this.node);
        }
        if (event == "resize") {
            SizeTracking.initNodeTracking(this.node);
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
