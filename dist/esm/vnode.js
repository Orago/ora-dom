import { Emitter } from "@orago/lib";
import { ProxyNode } from "./proxynode.js";
import { P_VNodeUtil, VNodeUtilExtend } from "./utilities.js";
import { valueTrap, VNodeClasses, VNodeEvents, VNodeStyle, } from "./vnode_extras.js";
export class VNode {
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
    static extractEl(node) {
        if (node instanceof ProxyNode || node instanceof VNode) {
            return node.element;
        }
        else {
            return node;
        }
    }
    constructor(element) {
        valueTrap(this, "style", () => new VNodeStyle(this));
        valueTrap(this, "class", () => new VNodeClasses(this));
        valueTrap(this, "events", () => new VNodeEvents(this));
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
            obj.append(VNodeUtilExtend.extractEl(this.element));
        }
        else {
            obj.prepend(VNodeUtilExtend.extractEl(this.element));
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
                this.element.value = value;
                return this;
            }
        }
        else {
            if (value == undefined) {
                return this.element.textContent;
            }
            else {
                this.element.textContent = value;
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
VNode.indexing = new Map();
VNode.new = new Proxy({}, {
    get(target, element_tag) {
        return new VNode(document.createElement(element_tag));
    },
});
VNode.send_events = false;
VNode.events = new Emitter();
