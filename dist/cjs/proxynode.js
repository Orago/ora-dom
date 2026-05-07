"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qsAll = exports.qs = exports.newNode = exports.generateProxyNode = exports.ProxyNode = exports.ProxynodeTracking = void 0;
const emitter_1 = __importDefault(require("@orago/lib/emitter"));
const submap_js_1 = require("./submap.js");
const utilities_js_1 = require("./utilities.js");
let reserved_events = ["append", "remove"];
class ProxynodeTracking {
    static inDom(element) {
        return this.tracked_in_dom.get(element) == true;
    }
    static handle(element) {
        var _a, _b;
        // If it's in dom now but wasn't before
        if (document.body.contains(element)) {
            if (this.inDom(element) != true) {
                (_a = ProxyNode.getEvents(element)) === null || _a === void 0 ? void 0 : _a.emit("append");
            }
            this.tracked_in_dom.set(element, true);
        }
        else if (this.inDom(element)) {
            /* Was in dom but removed */
            this.tracked_in_dom.set(element, false);
            (_b = ProxyNode.getEvents(element)) === null || _b === void 0 ? void 0 : _b.emit("remove");
        }
    }
    constructor() {
        this.list = new Set();
        this.observer = new MutationObserver(() => {
            for (const element of this.list) {
                ProxynodeTracking.handle(element);
            }
        });
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}
exports.ProxynodeTracking = ProxynodeTracking;
ProxynodeTracking.tracked_in_dom = new WeakMap();
class ProxyNode {
    static getEvents(element) {
        const existing = ProxyNode.weak_events.get(element);
        if (existing) {
            return existing;
        }
        else {
            const emitter = new emitter_1.default();
            ProxyNode.weak_events.set(element, emitter);
            return emitter;
        }
    }
    // static extractEl(node: PN_Extractable): HTMLElement {
    // 	if (node instanceof ProxyNode || node instanceof VNode) {
    // 		return node.element;
    // 	} else {
    // 		return node;
    // 	}
    // }
    static isNode(el) {
        return el instanceof ProxyNode;
    }
    static getCallbacksGroup(element) {
        const got = ProxyNode.stored_listeners.get(element);
        if (got) {
            return got;
        }
        else {
            const submap = new submap_js_1.SubMap();
            ProxyNode.stored_listeners.set(element, submap);
            return submap;
        }
    }
    static getListeners(element, event) {
        const group = ProxyNode.getCallbacksGroup(element);
        return group.get(event);
    }
    // get call() {
    // 	return this;
    // }
    constructor(el) {
        this.listeners = {};
        if (typeof el === "string") {
            this.element = document.createElement(el);
        }
        else if (
        // el instanceof Element ||
        el instanceof HTMLElement ||
            el instanceof HTMLInputElement)
            this.element = el;
        else if (el instanceof ProxyNode) {
            this.element = el.element;
        }
        else {
            throw new Error("Invalid element");
        }
    }
    get focused() {
        return document.activeElement === this.element;
    }
    get childFocused() {
        return this.focused || this.element.contains(document.activeElement);
    }
    get bounds() {
        return this.element.getBoundingClientRect();
    }
    get parent() {
        const parent = this.element.parentElement;
        if (parent != null) {
            return new ProxyNode(parent);
        }
    }
    get value() {
        var _a;
        if (this.element instanceof HTMLInputElement) {
            return this.element.value;
        }
        else {
            return (_a = this.element.textContent) !== null && _a !== void 0 ? _a : "";
        }
    }
    set value(value) {
        if (this.element instanceof HTMLInputElement) {
            this.element.value = value;
        }
        else {
            this.element.textContent = value;
        }
    }
    /** @deprecated - removed in the next version */
    get wrapper() {
        return this.ref;
    }
    ref(run) {
        run(this);
        return this;
    }
    //#region //* Default Utils *//
    text(content) {
        this.element.textContent = content;
        return this;
    }
    id(value) {
        this.element.id = value;
        return this;
    }
    attr(attributes = {}) {
        if (typeof attributes != "object") {
            return this;
        }
        for (const [key, value] of Object.entries(attributes)) {
            this.element.setAttribute(key, value + "");
        }
        return this;
    }
    swap(node) {
        const new_node = ProxyNode.extractEl(node);
        this.element.replaceWith(new_node);
        this.element = new_node;
        return this;
    }
    /**
     * Creates a cloned node
     */
    clone() {
        return new ProxyNode(this.element.cloneNode(true));
    }
    /**
     * Clears inner content
     */
    clear() {
        this.element.textContent = "";
        return this;
    }
    /**
     * Checks if dom contains element
     */
    exists() {
        return document.body.contains(this.element);
    }
    /**
     * Returns a list of child proxy nodes
     */
    getChildren() {
        return Array.from(this.element.children).map((documentEl) => new ProxyNode(documentEl));
    }
    /**
     *
     * @param to_reset
     * @returns
     * @deprecated - Possibly removed in the next version
     */
    reset(...to_reset) {
        return utilities_js_1.PNodeUtil.resetStyles(this, to_reset);
    }
    //#endregion //* Default Utils *//
    //#region //* Classes *//
    class(...args) {
        this.element.className = args.join(" ");
        return this;
    }
    hasClass(className) {
        return this.element.classList.contains(className);
    }
    addClass(...args) {
        for (const arg of args) {
            if (arg.includes(" ")) {
                args.splice(args.indexOf(arg), 1, ...arg.split(" "));
            }
            else if (Array.isArray(arg)) {
                args.splice(args.indexOf(arg), 1, ...arg);
            }
        }
        if (Array.isArray(args)) {
            this.element.classList.add(...args);
        }
        return this;
    }
    removeClass(...args) {
        for (const arg of args) {
            if (arg.includes(" ")) {
                args.splice(args.indexOf(arg), 1, ...arg.split(" "));
            }
        }
        if (Array.isArray(args)) {
            this.element.classList.remove(...args);
        }
        return this;
    }
    toggleClass(className, status = !this.hasClass(className)) {
        status ? this.addClass(className) : this.removeClass(className);
        return this;
    }
    //#endregion //* Classes *//
    //#region //* Styles *//
    styles(styles = {}) {
        if (typeof styles != "object") {
            return this;
        }
        else if (this.element instanceof HTMLElement != true) {
            return this;
        }
        for (const [key, value] of Object.entries(styles)) {
            if (key === "props") {
                for (const [prop_key, prop_value] of Object.entries(value)) {
                    this.element.style.setProperty(`--${prop_key}`, prop_value);
                }
            }
            // @ts-ignore
            this.element.style[key] = value;
        }
        return this;
    }
    removeStyles(...styles) {
        if (this.element instanceof HTMLElement != true) {
            return this;
        }
        for (const style of styles) {
            this.element.style.removeProperty(style);
        }
        return this;
    }
    //#endregion //* Styles *//
    getEvents() {
        return ProxyNode.getEvents(this.element);
    }
    //#region //* Listeners *//
    on(event, callback) {
        if (reserved_events.includes(event)) {
            this.getEvents().on(event, callback);
        }
        else {
            if (event == "keypress" || event == "keydown" || event == "keyup") {
                this.attr({ tabindex: 0 });
            }
            ProxyNode.getCallbacksGroup(this.element).add(event, callback);
            this.element.addEventListener(event, callback);
        }
        return this;
    }
    off(event, callback) {
        if (reserved_events.includes(event)) {
            this.getEvents().off(event, callback);
        }
        else {
            const group = ProxyNode.getCallbacksGroup(this.element);
            if (callback) {
                group.remove(event, callback);
                this.element.removeEventListener(event, callback);
            }
            else {
                for (const callback of group.get(event)) {
                    this.element.removeEventListener(event, callback);
                }
                group.removeAll(event);
            }
        }
        return this;
    }
    once(event, callback) {
        const once_callback = (...args) => {
            this.off(event, once_callback);
            callback(...args);
            return void 0;
        };
        this.on(event, (...args) => once_callback(...args));
        return this;
    }
    addListener(events) {
        var _a;
        var _b;
        for (const [key, event] of Object.entries(events)) {
            for (const [listener, fn] of Object.entries(event)) {
                if (listener == "keypress" ||
                    listener == "keydown" ||
                    listener == "keyup") {
                    this.attr({ tabindex: 0 });
                }
                const func = fn.bind(this);
                (_a = (_b = this.listeners)[key]) !== null && _a !== void 0 ? _a : (_b[key] = {});
                this.listeners[key][listener] = func;
                this.element.addEventListener(listener, func);
            }
        }
        return this;
    }
    removeListener(key) {
        for (const listener in this.listeners[key]) {
            this.element.removeEventListener(listener, this.listeners[key][listener]);
        }
        delete this.listeners[key];
        return this;
    }
    //#endregion //* Listeners *//
    //#region //* Intervals *//
    /**
     *
     * @deprecated - stop using this dumbass
     */
    interval(callback, time = 1000, immediate = false) {
        const toCall = () => callback.bind(this)(this, () => clearInterval(temp_interval));
        if (immediate) {
            toCall();
        }
        const temp_interval = setInterval(toCall, time);
        this.on("remove", () => clearInterval(temp_interval));
        return this;
    }
    //#endregion //* Intervals *//
    //#region //* Random *//
    remove() {
        this.element.remove();
        return this;
    }
    /**
     * clears the content and appends
     */
    setContent(...content) {
        return this.clear().append(...content);
    }
    append(...objs) {
        if (objs.length < 1) {
            return this;
        }
        for (const el of objs) {
            if (Array.isArray(el)) {
                objs.splice(objs.indexOf(el), 1, ...el);
            }
        }
        for (const item of objs) {
            if (item == false || item == null || Array.isArray(item)) {
                continue;
            }
            this.element.append(typeof item === "string" ? item : ProxyNode.extractEl(item));
        }
        return this;
    }
    appendTo(obj) {
        if (obj == false) {
            return this;
        }
        obj.append(ProxyNode.extractEl(this.element));
        return this;
    }
    prependTo(obj) {
        if (obj == null) {
            return this;
        }
        obj.prepend(ProxyNode.extractEl(this.element));
        return this;
    }
    prepend(...objs) {
        if (objs.length < 1) {
            return this;
        }
        for (const el of objs) {
            if (Array.isArray(el)) {
                const i = objs.indexOf(el);
                objs.splice(i, i + el.length);
                objs.push(...el);
            }
        }
        for (const el of objs) {
            this.element.prepend(ProxyNode.extractEl(el));
        }
        return this;
    }
    focus() {
        setTimeout(() => this.element instanceof HTMLElement && this.element.focus(), 0);
        return this;
    }
    scroll(x = 0, y = 0) {
        setTimeout(() => this.element.scroll(x, y), 500);
        return this;
    }
    setTabIndex(index) {
        if (typeof index == "number") {
            if (0 > index) {
                this.element.removeAttribute("tabindex");
            }
            else {
                this.element.setAttribute("tabindex", "0");
            }
        }
        return this;
    }
    /**
     * @deprecated - Possibly removed in the next version
     */
    horizontalScrolling() {
        this.on("wheel", (event) => {
            event.preventDefault();
            this.element.scrollLeft += event.deltaY;
        });
        return this;
    }
    animate(styles, options) {
        var _a;
        const instance = this.element.animate(styles, options);
        if (typeof options === "object") {
            instance.onfinish = (ev) => {
                var _a, _b;
                if (options.save === true) {
                    this.styles(styles[styles.length - 1]);
                }
                (_b = (_a = options.onFinish) === null || _a === void 0 ? void 0 : _a.bind(instance)) === null || _b === void 0 ? void 0 : _b(ev);
            };
            options.onCancel && (instance.oncancel = options.onCancel);
            options.onRemove && (instance.onremove = options.onRemove);
            (_a = options.animationReference) === null || _a === void 0 ? void 0 : _a.call(options, instance);
        }
        return this;
    }
}
exports.ProxyNode = ProxyNode;
ProxyNode.stored_listeners = new WeakMap();
ProxyNode.weak_events = new WeakMap();
// private static qs = qs;
// private static qsAll = qsAll;
ProxyNode.tracking = new ProxynodeTracking();
ProxyNode.extractEl = utilities_js_1.VNodeExtractEl;
function generateProxyNode(el) {
    return new ProxyNode(el);
}
exports.generateProxyNode = generateProxyNode;
exports.newNode = new Proxy({}, {
    get(target, element_tag) {
        return new ProxyNode(document.createElement(element_tag));
        // generateProxyNode(document.createElement(elementTag));
    },
});
function qs(selector, element = document) {
    const currentNode = element.querySelector(selector);
    return currentNode ? new ProxyNode(currentNode) : null;
}
exports.qs = qs;
function qsAll(selector, element = document) {
    return Array.from(element.querySelectorAll(selector)).map(($) => $ ? new ProxyNode($) : exports.newNode.div);
}
exports.qsAll = qsAll;
exports.default = {
    newNode: exports.newNode,
    qs,
    generateProxyNode,
    fetch,
};
