(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@orago/lib", "./proxynode.js", "./utilities.js", "./vnode_extras.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VNode = void 0;
    const lib_1 = require("@orago/lib");
    const proxynode_js_1 = require("./proxynode.js");
    const utilities_js_1 = require("./utilities.js");
    const vnode_extras_js_1 = require("./vnode_extras.js");
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
            else if (el instanceof proxynode_js_1.ProxyNode) {
                return new VNode(el.element);
            }
            else {
                throw new Error("Invalid element");
            }
        }
        constructor(element) {
            (0, lib_1.trapValue)(this, "style", () => (0, lib_1.makeCallableClass)(vnode_extras_js_1.VNodeStyle, this));
            (0, lib_1.trapValue)(this, "class", () => (0, lib_1.makeCallableClass)(vnode_extras_js_1.VNodeClasses, this));
            (0, lib_1.trapValue)(this, "events", () => (0, lib_1.makeCallableClass)(vnode_extras_js_1.VNodeEvents, this));
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
            utilities_js_1.P_VNodeUtil.attr(this.element, attributes);
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
            return utilities_js_1.P_VNodeUtil.injectItems(this, "append", objs);
        }
        prepend(...objs) {
            return utilities_js_1.P_VNodeUtil.injectItems(this, "prepend", objs);
        }
        appendTo(obj, direction = "append") {
            if (obj == false) {
                return this;
            }
            if (direction === "append") {
                obj.append((0, utilities_js_1.VNodeExtractEl)(this.element));
            }
            else {
                obj.prepend((0, utilities_js_1.VNodeExtractEl)(this.element));
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
    exports.VNode = VNode;
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
        _a.extractEl = utilities_js_1.VNodeExtractEl,
        _a);
    VNode.indexing = new Map();
    VNode.new = new Proxy({}, {
        get(target, element_tag) {
            return new VNode(document.createElement(element_tag));
        },
    });
    VNode.extractEl = utilities_js_1.VNodeExtractEl;
    VNode.send_events = false;
    VNode.events = new lib_1.Emitter();
});
