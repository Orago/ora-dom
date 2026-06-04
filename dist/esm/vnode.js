var _a;
import { Emitter, makeCallableClass, trapValue } from "@orago/lib";
import { ProxyNode } from "./proxynode.js";
import { VNodeUtilities, VNodeExtractEl, } from "./vnode_utilities.js";
import { VNodeClasses, VNodeEvents, VNodeStyle, } from "./utilities/vnode_extras.js";
export class VNode {
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
        else if (el instanceof ProxyNode) {
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
        trapValue(this, "style", () => makeCallableClass(VNodeStyle, this));
        trapValue(this, "class", () => makeCallableClass(VNodeClasses, this));
        trapValue(this, "events", () => makeCallableClass(VNodeEvents, this));
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
            VNodeUtilities.applyVNProps(this, props);
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
        VNodeUtilities.setAttributes(this.element, attributes);
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
        VNodeUtilities.injectItems(this.element, "append", objs);
        return this;
    }
    prepend(...objs) {
        VNodeUtilities.injectItems(this.element, "prepend", objs);
        return this;
    }
    appendTo(obj, direction = "append") {
        if (obj == false) {
            return this;
        }
        else {
            if (direction === "append") {
                obj.append(VNodeExtractEl(this.element));
            }
            else {
                obj.prepend(VNodeExtractEl(this.element));
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
                VNodeUtilities.formatAttributeName("camel", key),
                undefined,
            ])));
        }
        for (let [key, value] of Object.entries(record)) {
            key = VNodeUtilities.formatAttributeName("camel", key);
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
VNode.Utilities = VNodeUtilities;
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
            const found = _a.qsAll(VNodeUtilities.whereString(options), element);
            if (options.text != undefined) {
                return VNodeUtilities.elementTextFind(options.text, found.map((e) => [e.element.textContent, e])).map((vec) => vec[1]);
            }
            else {
                return found;
            }
        }
        static getChildren(extractable) {
            const extracted = VNodeExtractEl(extractable);
            return Array.from(extracted.children).map((document_el) => new VNode(document_el));
        }
    },
    _a.extractEl = VNodeExtractEl,
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
VNode.extractEl = VNodeExtractEl;
VNode.send_events = false;
VNode.events = new Emitter();
