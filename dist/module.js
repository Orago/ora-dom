function makeCallableClass(Class, ...args) {
    const instance = new Class(...args);
    const callable = ((...fnArgs) => {
        return instance.call(...fnArgs);
    });
    Object.setPrototypeOf(callable, Class.prototype);
    Object.assign(callable, instance);
    return callable;
}
function trapValue(obj, property, callback) {
    Object.defineProperty(obj, property, {
        configurable: true,
        get() {
            const value = callback();
            Object.defineProperty(obj, property, {
                value,
                writable: false,
                configurable: false,
                enumerable: true,
            });
            return value;
        },
    });
}

(undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Emitter {
    constructor(all) {
        this.all = new Map();
        if (all instanceof Map) {
            this.all = all;
        }
        else if (Array.isArray(all)) {
            this.all = new Map(all);
        }
    }
    /** Adds a listener */
    on(event, callback) {
        const handlers = this.all.get(event);
        if (handlers) {
            handlers.push(callback);
        }
        else {
            this.all.set(event, [callback]);
        }
        return this;
    }
    /** Disables a listener */
    off(event, callback) {
        const handlers = this.all.get(event);
        if (handlers) {
            if (callback) {
                const index = handlers.indexOf(callback);
                if (index !== -1) {
                    handlers.splice(index, 1);
                }
            }
            else {
                this.all.set(event, []);
            }
        }
        return this;
    }
    /** Notifies all active listeners */
    emit(event, ...args) {
        let handlers = this.all.get(event);
        if (handlers != undefined) {
            for (const handler of handlers.slice()) {
                handler(...args);
            }
        }
        if ((handlers = this.all.get("*")) != undefined) {
            for (const handler of handlers.slice()) {
                handler(event, ...args);
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
        this.on(event, once_callback);
        return this;
    }
    *[Symbol.iterator]() {
        for (const entry of this.all.entries()) {
            yield entry;
        }
    }
}

var Helpers;
(function (Helpers) {
    class VecLike {
        static toString(args) {
            return `(${this.clean(args).join(",")})`;
        }
        static clean(args) {
            return args;
        }
        static valid(args) {
            return true;
        }
    }
    class VectorNumber extends VecLike {
        static clean(args) {
            return new Array(this.size).fill(0).map((v, i) => { var _a; return (_a = args === null || args === void 0 ? void 0 : args[i]) !== null && _a !== void 0 ? _a : v; });
        }
        static valid(args) {
            return (args.length == this.size &&
                args.every((n) => typeof n === "number"));
        }
    }
    VectorNumber.size = 0;
    Helpers.VectorNumber = VectorNumber;
    class VectorNumberInt extends VectorNumber {
        static clean(args) {
            return super.clean(args).map((n) => n | 0);
        }
        static valid(args) {
            return super.valid(args) && args.every((n) => n == (n | 0));
        }
    }
    VectorNumberInt.size = 0;
    Helpers.VectorNumberInt = VectorNumberInt;
})(Helpers || (Helpers = {}));
class Vector2 extends Helpers.VectorNumber {
    static clean(args) {
        return super.clean(args);
    }
    static valid(args) {
        return super.valid(args);
    }
    static fromObject(point) {
        return this.clean([point.x, point.y]);
    }
    static toObject(args) {
        return { x: args[0], y: args[0] };
    }
}
Vector2.size = 2;
class Vector2i extends Helpers.VectorNumberInt {
    static clean(args) {
        return super.clean(args);
    }
    static valid(args) {
        return super.valid(args);
    }
    static fromObject(point) {
        return this.clean([point.x, point.y]);
    }
    static toObject(args) {
        this.type;
        return { x: args[0] | 0, y: args[1] | 0 };
    }
}
Vector2i.size = 2;
class Vector3 extends Helpers.VectorNumber {
    static clean(args) {
        return super.clean(args);
    }
    static valid(args) {
        return super.valid(args);
    }
    static fromObject(point) {
        return this.clean([point.x, point.y, point.z]);
    }
    static toObject(args) {
        return { x: args[0], y: args[1], z: args[2] };
    }
}
Vector3.size = 3;
class Vector3i extends Helpers.VectorNumberInt {
    static clean(args) {
        return super.clean(args);
    }
    static valid(args) {
        return super.valid(args);
    }
    static toObject(args) {
        return { x: args[0] | 0, y: args[1] | 0, z: args[2] | 0 };
    }
}
Vector3i.size = 3;

class ObserverTracking {
    static inDom(element) {
        return this.tracked_in_dom.get(element) == true;
    }
    static handle(element) {
        var _a, _b;
        if (document.body.contains(element)) {
            if (this.inDom(element) != true) {
                (_a = this.getEvents(element)) === null || _a === void 0 ? void 0 : _a.emit("append");
            }
            this.tracked_in_dom.set(element, true);
        }
        else if (this.inDom(element)) {
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
            const emitter = new Emitter();
            this.weak_events.set(element, emitter);
            return emitter;
        }
    }
    constructor() {
        this.wrap_map = new Map();
        this.list = new Set();
        this.events = new Emitter();
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
ObserverTracking.weak_events = new WeakMap();
ObserverTracking.tracked_in_dom = new WeakMap();

class SubMap {
    constructor() {
        this.all = new Map();
    }
    get(event) {
        var _a;
        return (_a = this.all.get(event)) !== null && _a !== void 0 ? _a : [];
    }
    add(event, ...items) {
        let list = this.all.get(event);
        if (list) {
            list.push(...items.filter((e) => (list === null || list === void 0 ? void 0 : list.includes(e)) != true));
        }
        else {
            this.all.set(event, [...items]);
        }
        return this;
    }
    remove(event, ...items) {
        const list = this.all.get(event);
        if (list) {
            for (const item of items) {
                const index = list.indexOf(item);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        }
        return this;
    }
    removeAll(event) {
        this.all.delete(event);
        return this;
    }
}

function VNodeExtractEl(node) {
    if ("element" in node) {
        return node.element;
    }
    return node;
}
class PNodeUtil {
    static resetStyles(vnode, to_reset) {
        const options = to_reset.length > 0 ? to_reset : ["content", "style", "class"];
        for (const option of options) {
            if (option === "content") {
                vnode.element.innerHTML = "";
            }
            else if (option === "style") {
                if (vnode.element instanceof HTMLElement) {
                    const style_ref = vnode.element.style;
                    for (let i = style_ref.length; i--;) {
                        const name_string = style_ref[i];
                        style_ref.removeProperty(name_string);
                    }
                }
            }
            else if (option === "class") {
                vnode.element.className = "";
            }
        }
        return vnode;
    }
}
class P_VNodeUtil {
    static setStyles(element, styles = {}) {
        if (typeof styles != "object" ||
            element instanceof HTMLElement != true) {
            return;
        }
        for (const [key, value] of Object.entries(styles)) {
            if (key === "variables") {
                for (const [prop_key, prop_value] of Object.entries(value)) {
                    element.style.setProperty(`--${prop_key}`, prop_value);
                }
            }
            if (value == undefined) {
                continue;
            }
            element.style[key] = `${value}`;
        }
    }
    static removeStyles(element, styles) {
        if (element instanceof HTMLElement) {
            for (const style of styles) {
                element.style.removeProperty(style);
            }
        }
    }
    static injectItems(vnode, direction = "append", objs) {
        if (objs.length < 1) {
            return vnode;
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
            const extracted = typeof item === "string" ? item : VNodeExtractEl(item);
            if (direction === "append") {
                vnode.element.append(extracted);
            }
            else {
                vnode.element.prepend(extracted);
            }
        }
        return vnode;
    }
    static attr(element, attributes = {}) {
        if (typeof attributes == "object" && attributes !== null) {
            for (const [key, value] of Object.entries(attributes)) {
                element.setAttribute(key, value + "");
            }
        }
    }
}

let reserved_events = ["append", "remove"];
class ProxynodeTracking {
    static inDom(element) {
        return this.tracked_in_dom.get(element) == true;
    }
    static handle(element) {
        var _a, _b;
        if (document.body.contains(element)) {
            if (this.inDom(element) != true) {
                (_a = ProxyNode.getEvents(element)) === null || _a === void 0 ? void 0 : _a.emit("append");
            }
            this.tracked_in_dom.set(element, true);
        }
        else if (this.inDom(element)) {
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
ProxynodeTracking.tracked_in_dom = new WeakMap();
class ProxyNode {
    static getEvents(element) {
        const existing = ProxyNode.weak_events.get(element);
        if (existing) {
            return existing;
        }
        else {
            const emitter = new Emitter();
            ProxyNode.weak_events.set(element, emitter);
            return emitter;
        }
    }
    static isNode(el) {
        return el instanceof ProxyNode;
    }
    static getCallbacksGroup(element) {
        const got = ProxyNode.stored_listeners.get(element);
        if (got) {
            return got;
        }
        else {
            const submap = new SubMap();
            ProxyNode.stored_listeners.set(element, submap);
            return submap;
        }
    }
    static getListeners(element, event) {
        const group = ProxyNode.getCallbacksGroup(element);
        return group.get(event);
    }
    constructor(el) {
        this.listeners = {};
        if (typeof el === "string") {
            this.element = document.createElement(el);
        }
        else if (el instanceof HTMLElement ||
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
    get wrapper() {
        return this.ref;
    }
    ref(run) {
        run(this);
        return this;
    }
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
    clone() {
        return new ProxyNode(this.element.cloneNode(true));
    }
    clear() {
        this.element.textContent = "";
        return this;
    }
    exists() {
        return document.body.contains(this.element);
    }
    getChildren() {
        return Array.from(this.element.children).map((documentEl) => new ProxyNode(documentEl));
    }
    reset(...to_reset) {
        return PNodeUtil.resetStyles(this, to_reset);
    }
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
    getEvents() {
        return ProxyNode.getEvents(this.element);
    }
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
    interval(callback, time = 1000, immediate = false) {
        const toCall = () => callback.bind(this)(this, () => clearInterval(temp_interval));
        if (immediate) {
            toCall();
        }
        const temp_interval = setInterval(toCall, time);
        this.on("remove", () => clearInterval(temp_interval));
        return this;
    }
    remove() {
        this.element.remove();
        return this;
    }
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
ProxyNode.stored_listeners = new WeakMap();
ProxyNode.weak_events = new WeakMap();
ProxyNode.tracking = new ProxynodeTracking();
ProxyNode.extractEl = VNodeExtractEl;
function generateProxyNode(el) {
    return new ProxyNode(el);
}
const newNode = new Proxy({}, {
    get(target, element_tag) {
        return new ProxyNode(document.createElement(element_tag));
    },
});
function qs(selector, element = document) {
    const currentNode = element.querySelector(selector);
    return currentNode ? new ProxyNode(currentNode) : null;
}
function qsAll(selector, element = document) {
    return Array.from(element.querySelectorAll(selector)).map(($) => $ ? new ProxyNode($) : newNode.div);
}
var proxynode = {
    newNode,
    qs,
    generateProxyNode,
    fetch,
};

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
                    P_VNodeUtil.setStyles(this.node.element, styles[end_index]);
                }
            });
        }
    }
}
class VNodeUtilityClass {
    constructor(node) {
        this.node = node;
        this.node = node;
    }
    nest(run) {
        run(this);
        return this.node;
    }
}
class VNodeStyle extends VNodeUtilityClass {
    call(value = {}) {
        if (typeof value == "object") {
            return this.update(value).node;
        }
        else if (typeof value == "function") {
            return this.nest(value);
        }
        return this.node;
    }
    update(styles = {}) {
        P_VNodeUtil.setStyles(this.node.element, styles);
        return this;
    }
    remove(...styles) {
        P_VNodeUtil.removeStyles(this.node.element, styles);
        return this;
    }
    animate(styles, options) {
        return new VNodeAnimation(this.node, styles, options);
    }
}
class VNodeClasses extends VNodeUtilityClass {
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
    toggleClass(class_name, status = !this.has(class_name)) {
        return this.toggle(class_name, status);
    }
}
class VNodeEvents extends VNodeUtilityClass {
    static getEvents(element) {
        const existing = VNodeEvents.weak_events.get(element);
        if (existing) {
            return existing;
        }
        else {
            const emitter = new Emitter();
            VNodeEvents.weak_events.set(element, emitter);
            return emitter;
        }
    }
    static getCallbacksGroup(element) {
        const got = VNodeEvents.stored_listeners.get(element);
        if (got) {
            return got;
        }
        else {
            const submap = new SubMap();
            VNodeEvents.stored_listeners.set(element, submap);
            return submap;
        }
    }
    static on(element, event, callback) {
        if (VNodeEvents.reserved_events.includes(event)) {
            VNodeEvents.getEvents(element).on(event, callback);
        }
        else {
            if (event == "keypress" || event == "keydown" || event == "keyup") {
                P_VNodeUtil.attr(element, { tabIndex: 0 });
            }
            VNodeEvents.getCallbacksGroup(element).add(event, callback);
            element.addEventListener(event, callback);
        }
    }
    static off(element, event, callback) {
        if (VNodeEvents.reserved_events.includes(event)) {
            VNodeEvents.getEvents(element).off(event, callback);
        }
        else {
            const group = VNodeEvents.getCallbacksGroup(element);
            if (callback) {
                group.remove(event, callback);
                element.removeEventListener(event, callback);
            }
            else {
                for (const callback of group.get(event)) {
                    element.removeEventListener(event, callback);
                }
                group.removeAll(event);
            }
        }
    }
    static once(element, event, callback) {
        const once_callback = (...args) => {
            this.off(element, event, once_callback);
            callback(...args);
            return void 0;
        };
        this.on(element, event, (...args) => once_callback(...args));
    }
    constructor(node) {
        super(node);
        this.element = this.node.element;
    }
    call(...args) {
        return this.nest(...args);
    }
    on(event, callback) {
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
}
VNodeEvents.reserved_events = [
    "append",
    "remove",
];
VNodeEvents.stored_listeners = new WeakMap();
VNodeEvents.weak_events = new WeakMap();

var _a;
class VNode {
    static from(el) {
        if (typeof el === "string") {
            return new VNode(document.createElement(el));
        }
        else if (el instanceof HTMLElement ||
            el instanceof HTMLInputElement) {
            return new VNode(el);
        }
        else if (el instanceof VNode) {
            return new VNode(el.element);
        }
        else if (el instanceof ProxyNode) {
            return new VNode(el.element);
        }
        else {
            throw new Error("Invalid element");
        }
    }
    constructor(element) {
        trapValue(this, "style", () => makeCallableClass(VNodeStyle, this));
        trapValue(this, "class", () => makeCallableClass(VNodeClasses, this));
        trapValue(this, "events", () => makeCallableClass(VNodeEvents, this));
        if (typeof element === "string") {
            this.element = document.createElement(element);
        }
        else {
            this.element = VNode.extractEl(element);
        }
        if (VNode.send_events === true) {
            VNode.events.emit("create", this);
        }
    }
    attr(attributes = {}) {
        P_VNodeUtil.attr(this.element, attributes);
        return this;
    }
    swap(node) {
        const new_node = VNode.extractEl(node);
        this.element.replaceWith(new_node);
        this.element = new_node;
        return this;
    }
    id(value = undefined) {
        if (value == undefined) {
            return this.element.id;
        }
        else {
            this.element.id = value;
            return this;
        }
    }
    append(...objs) {
        return P_VNodeUtil.injectItems(this, "append", objs);
    }
    prepend(...objs) {
        return P_VNodeUtil.injectItems(this, "prepend", objs);
    }
    appendTo(obj, direction = "append") {
        if (obj == false) {
            return this;
        }
        if (direction === "append") {
            obj.append(VNodeExtractEl(this.element));
        }
        else {
            obj.prepend(VNodeExtractEl(this.element));
        }
        return this;
    }
    getBounds() {
        return this.element.getBoundingClientRect();
    }
    value(value = undefined) {
        if (this.element instanceof HTMLInputElement) {
            if (value == undefined) {
                return this.element.value;
            }
            else {
                this.element.value = value.toString();
                return this;
            }
        }
        else if (this.element instanceof HTMLImageElement) {
            if (value == undefined) {
                return this.element.src;
            }
            else {
                this.element.src = value.toString();
                return this;
            }
        }
        else {
            if (value == undefined) {
                return this.element.textContent;
            }
            else {
                this.element.textContent = value.toString();
                return this;
            }
        }
    }
    focus() {
        if (this.inDom()) {
            if (this.element instanceof HTMLElement) {
                this.element.focus();
            }
        }
        else {
            setTimeout(() => {
                if (this.element instanceof HTMLElement) {
                    this.element.focus();
                }
            }, 0);
        }
        return this;
    }
    ref(run) {
        run(this);
        return this;
    }
    remove() {
        this.element.remove();
        return this;
    }
    setContent(...content) {
        return this.clear().append(...content);
    }
    clear() {
        this.element.textContent = "";
        return this;
    }
    setStyles(styles) {
        this.style.update(styles);
        return this;
    }
    setClasses(...classes) {
        this.class.set(...classes);
        return this;
    }
    inDom(parent = document.body) {
        return parent.contains(this.element);
    }
    scroll(x = 0, y = 0) {
        this.element.scroll(x, y);
        return this;
    }
}
VNode.Util = (_a = class VNodeUtilExtend {
        static qs(selector, element = document) {
            const current = element.querySelector(selector);
            return current ? new VNode(current) : null;
        }
        static qsAll(selector, element = document) {
            return Array.from(element.querySelectorAll(selector)).map((current) => {
                return new VNode(current);
            });
        }
        static getChildren(extractable) {
            const extracted = this.extractEl(extractable);
            return Array.from(extracted.children).map((document_el) => new VNode(document_el));
        }
    },
    _a.extractEl = VNodeExtractEl,
    _a);
VNode.indexing = new Map();
VNode.new = new Proxy({}, {
    get(target, element_tag) {
        return new VNode(document.createElement(element_tag));
    },
});
VNode.extractEl = VNodeExtractEl;
VNode.send_events = false;
VNode.events = new Emitter();

class StyledVNode extends VNode {
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
class JCSSTracker {
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

function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
class JssClass {
    static parseContents(data) {
        return Object.entries(data).map(([name, value]) => `${camelToKebab(name)}: ${value}`);
    }
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
    toString() {
        const formatted_styles = JssClass.parseContents(this.data);
        return `${this.name} { ${formatted_styles.join("; ")} }`;
    }
}
class JssAnimation {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
    toString() {
        const formatted_styles = this.data.map(([position, data]) => {
            const dat = JssClass.parseContents(data);
            let range = Array.isArray(position)
                ? position.map(camelToKebab).join(", ")
                : camelToKebab(position);
            return `${range} { ${dat} }`;
        });
        return `@keyframes ${this.name} { ${formatted_styles.join(" ")} }`;
    }
}
class JCSSClassManager {
    constructor(manager) {
        this.manager = manager;
        this.counter = 0;
        this.indexes = new Map();
        this.list = new Map();
        this.manager = manager;
    }
    call(run) {
        run(this);
        return this;
    }
    has(name) {
        return this.list.has(name);
    }
    inject(instance) {
        const index = this.counter++;
        this.list.set(instance.name, instance);
        this.indexes.set(instance, index);
    }
    add(name, style) {
        this.inject(new JssClass(name, style));
        return this;
    }
    remove(instance) {
        const index = this.indexes.get(instance);
        if (index == null) {
            return false;
        }
        else {
            this.list.delete(instance.name);
            this.indexes.delete(instance);
            return true;
        }
    }
    removeByName(name) {
        const found = this.list.get(name);
        if (found == null) {
            return false;
        }
        else {
            return this.remove(found);
        }
    }
}
class JCSSAnimationManager {
    constructor(manager) {
        this.manager = manager;
        this.counter = 0;
        this.indexes = new Map();
        this.list = new Map();
        this.manager = manager;
    }
    call(run) {
        run(this);
        return this;
    }
    has(name) {
        return this.list.has(name);
    }
    inject(instance) {
        const index = this.counter++;
        this.list.set(instance.name, instance);
        this.indexes.set(instance, index);
    }
    add(name, style) {
        this.inject(new JssAnimation(name, style));
        return this;
    }
    remove(instance) {
        const index = this.indexes.get(instance);
        if (index == null) {
            return false;
        }
        else {
            this.list.delete(instance.name);
            this.indexes.delete(instance);
            return true;
        }
    }
    removeByName(name) {
        const found = this.list.get(name);
        if (found == null) {
            return false;
        }
        else {
            return this.remove(found);
        }
    }
}
class JCSS {
    constructor() {
        this.element = document.createElement("style");
        this.style = makeCallableClass(JCSSClassManager, this);
        this.animation = makeCallableClass(JCSSAnimationManager, this);
        this.inserted_state = false;
    }
    insert() {
        if (this.inserted_state == false) {
            document.head.appendChild(this.element);
            this.inserted_state = document.head.contains(this.element);
            this.rebuild();
        }
        return this;
    }
    remove() {
        this.element.remove();
        this.inserted_state = document.head.contains(this.element);
        return this;
    }
    rebuild() {
        const classes_string = Array.from(this.style.list.values())
            .map((instance) => instance.toString())
            .join("\n");
        const animations_string = Array.from(this.animation.list.values())
            .map((instance) => instance.toString())
            .join("\n");
        const result = [classes_string, animations_string].join(" ");
        this.element.innerHTML = result;
        return this;
    }
    getUsageCount() {
        function selectAndCount(e) {
            return document.querySelectorAll(e.name).length;
        }
        return Array.from(this.style.list.values())
            .map(selectAndCount)
            .reduce((accumulator, current) => accumulator + current, 0);
    }
    ref(run) {
        run(this);
        return this;
    }
}

export { JCSS, JCSSTracker, ObserverTracking, ProxyNode, StyledVNode, VNode, proxynode as default, generateProxyNode, newNode, qs, qsAll };
