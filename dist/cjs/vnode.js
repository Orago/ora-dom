"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNode = void 0;
const lib_1 = require("@orago/lib");
const proxynode_js_1 = require("./proxynode.js");
const vnode_utilities_js_1 = require("./vnode_utilities.js");
const vnode_extras_js_1 = require("./utilities/vnode_extras.js");
class VNode {
    static getElement(el) {
        if (typeof el === "string") {
            return document.createElement(el);
        }
        else if (el instanceof HTMLElement ||
            el instanceof HTMLInputElement) {
            return el;
        }
        else if (el instanceof VNode) {
            return el.element;
        }
        else if (el instanceof proxynode_js_1.ProxyNode) {
            return el.element;
        }
        else {
            throw new Error("Invalid element");
        }
    }
    static from(el) {
        const element = VNode.getElement(el);
        return new VNode(element);
    }
    constructor(element, props) {
        (0, lib_1.trapValue)(this, "style", () => (0, lib_1.makeCallableClass)(vnode_extras_js_1.VNodeStyle, this));
        (0, lib_1.trapValue)(this, "class", () => (0, lib_1.makeCallableClass)(vnode_extras_js_1.VNodeClasses, this));
        (0, lib_1.trapValue)(this, "events", () => (0, lib_1.makeCallableClass)(vnode_extras_js_1.VNodeEvents, this));
        if (typeof element === "string") {
            this.element = document.createElement(element);
        }
        else {
            this.element = VNode.Util.extractEl(element);
        }
        if (VNode.send_events === true) {
            VNode.events.emit("add", this);
        }
        VNode.events.emit("init", this);
        if (props != undefined) {
            vnode_utilities_js_1.VNodeUtilities.applyVNProps(this, props);
        }
    }
    ref(run) {
        run(this);
        return this;
    }
    use(plugins) {
        for (const plugin of plugins) {
            plugin(this);
        }
        return this;
    }
    attr(attributes = {}) {
        vnode_utilities_js_1.VNodeUtilities.setAttributes(this.element, attributes);
        return this;
    }
    swap(node) {
        const new_node = VNode.Util.extractEl(node);
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
        vnode_utilities_js_1.VNodeUtilities.injectItems(this.element, "append", objs);
        return this;
    }
    prepend(...objs) {
        vnode_utilities_js_1.VNodeUtilities.injectItems(this.element, "prepend", objs);
        return this;
    }
    appendTo(obj, direction = "append") {
        if (obj == false) {
            return this;
        }
        else {
            if (direction === "append") {
                obj.append((0, vnode_utilities_js_1.VNodeExtractEl)(this.element));
            }
            else {
                obj.prepend((0, vnode_utilities_js_1.VNodeExtractEl)(this.element));
            }
            return this;
        }
    }
    getBounds() {
        return this.element.getBoundingClientRect();
    }
    value(value = undefined) {
        if (this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLSelectElement) {
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
    dataset(record) {
        if (record == undefined) {
            return this.element.dataset;
        }
        if (record == "clear") {
            return this.dataset(Object.fromEntries(Object.keys(this.element.dataset).map((key) => [
                vnode_utilities_js_1.VNodeUtilities.formatAttributeName("kebab", key),
                undefined,
            ])));
        }
        for (let [key, value] of Object.entries(record)) {
            key = vnode_utilities_js_1.VNodeUtilities.formatAttributeName("kebab", key);
            if (value == undefined) {
                delete this.element.dataset[key];
            }
            else {
                this.element.dataset[key] = value;
            }
        }
        return this;
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
    remove() {
        this.element.remove();
        return this;
    }
    setContent(...content) {
        return this.clear().append(...content);
    }
    /** Clears inner content */
    clear() {
        this.element.textContent = "";
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
exports.VNode = VNode;
VNode.Utilities = vnode_utilities_js_1.VNodeUtilities;
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
        static where(options, element = document) {
            const found = _a.qsAll(vnode_utilities_js_1.VNodeUtilities.whereString(options), element);
            if (options.text != undefined) {
                return vnode_utilities_js_1.VNodeUtilities.elementTextFind(options.text, found.map((e) => [e.element.textContent, e])).map((vec) => vec[1]);
            }
            else {
                return found;
            }
        }
        static getChildren(extractable) {
            const extracted = (0, vnode_utilities_js_1.VNodeExtractEl)(extractable);
            return Array.from(extracted.children).map((document_el) => new VNode(document_el));
        }
    },
    _a.extractEl = vnode_utilities_js_1.VNodeExtractEl,
    _a);
VNode.indexing = new Map();
/**
 * Replacement for 'newNode' on ProxyNode Utilities
 * @deprecated
 */
VNode.of = new Proxy({}, {
    get(target, element_tag) {
        return new VNode(document.createElement(element_tag));
        // generateProxyNode(document.createElement(elementTag));
    },
});
/**
 * @deprecated Use VNode.Util.extractEl
 */
VNode.extractEl = vnode_utilities_js_1.VNodeExtractEl;
VNode.send_events = false;
VNode.events = new lib_1.Emitter();
