(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./proxynode.js", "./vnode.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VNodeUtilExtend = exports.P_VNodeUtil = exports.PNodeUtil = void 0;
    const proxynode_js_1 = require("./proxynode.js");
    const vnode_js_1 = require("./vnode.js");
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
    exports.PNodeUtil = PNodeUtil;
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
                const extracted = typeof item === "string" ? item : VNodeUtilExtend.extractEl(item);
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
    exports.P_VNodeUtil = P_VNodeUtil;
    class VNodeUtilExtend {
        static qs(selector, element = document) {
            const current = element.querySelector(selector);
            return current ? new vnode_js_1.VNode(current) : null;
        }
        static qsAll(selector, element = document) {
            return Array.from(element.querySelectorAll(selector)).map((current) => {
                return new vnode_js_1.VNode(current);
            });
        }
        static extractEl(node) {
            if (node instanceof proxynode_js_1.ProxyNode || node instanceof vnode_js_1.VNode) {
                return node.element;
            }
            else {
                return node;
            }
        }
        static getChildren(extractable) {
            const extracted = this.extractEl(extractable);
            return Array.from(extracted.children).map((document_el) => new proxynode_js_1.ProxyNode(document_el));
        }
        static setTabIndex(extractable, index) {
            const extracted = this.extractEl(extractable);
            if (typeof index == "number") {
                if (0 > index) {
                    extracted.removeAttribute("tabindex");
                }
                else {
                    extracted.setAttribute("tabindex", "0");
                }
            }
        }
    }
    exports.VNodeUtilExtend = VNodeUtilExtend;
});
