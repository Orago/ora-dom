(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./dom_observer.js", "./jss.js", "./vnode.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JCSSTracker = exports.StyledVNode = void 0;
    const dom_observer_js_1 = require("./dom_observer.js");
    const jss_js_1 = require("./jss.js");
    const vnode_js_1 = require("./vnode.js");
    class StyledNodeManager {
        constructor(id) {
            this.id = id;
            this.class = new jss_js_1.JssClass("." + this.getClassName(), {});
        }
        /**
         * Returns the generated classname prefixed by vns_
         * which stands for Virtual Node Style -
         */
        getClassName() {
            return `vns_${this.id.toString(16)}`;
        }
    }
    class StyledVNode extends vnode_js_1.VNode {
        static getConstructor(ref) {
            return ref.constructor;
        }
        static findOrCreate(c, styles) {
            const is_new = StyledVNode.managers.get(c) == undefined;
            const manager = this.getManager(c);
            if (is_new) {
                if (styles instanceof jss_js_1.JssStyle) {
                    manager.class.data = styles.data;
                }
                else {
                    manager.class.data = styles;
                }
                this.sheet.style.inject(manager.class);
                this.sheet.build();
            }
            return manager.getClassName();
        }
        static connect(class_ref, styles) {
            const c = this.getConstructor(class_ref);
            if (styles == undefined) {
                const manager = StyledVNode.managers.get(c);
                if (manager != undefined) {
                    class_ref.class.add(manager.getClassName());
                }
            }
            else {
                const class_name = this.findOrCreate(c, styles);
                class_ref.class.add(class_name);
            }
        }
        static getManager(c) {
            let manager = StyledVNode.managers.get(c);
            if (manager == undefined) {
                const id = ++StyledVNode.class_index;
                manager = new StyledNodeManager(id);
                StyledVNode.managers.set(c, manager);
            }
            return manager;
        }
        /** Destroys the class and it's relations for a vnode class */
        static destroy(class_ref) {
            const c = this.getConstructor(class_ref);
            const manager = this.getManager(c);
            const jss_class = this.sheet.style.list.get(manager.class.name);
            if (jss_class) {
                this.sheet.style.remove(jss_class);
                this.sheet.build();
            }
            StyledVNode.managers.delete(c);
        }
        static init() {
            this.sheet.insert();
        }
        static validStyles(styles) {
            return styles;
        }
        constructor(element) {
            super(element);
            StyledVNode.connect(this, this.getConstructor().styles);
        }
        getConstructor() {
            return this.constructor;
        }
    }
    exports.StyledVNode = StyledVNode;
    StyledVNode.managers = new Map();
    StyledVNode.class_index = 0;
    /** Should not be changed */
    StyledVNode.sheet = new jss_js_1.JCSS();
    /** May be overridden by extending the class */
    StyledVNode.styles = {};
    class JCSSTracker {
        constructor(instance, observer) {
            this.instance = instance;
            this.instance = instance;
            this.instance.insert();
            this.observer = observer !== null && observer !== void 0 ? observer : new dom_observer_js_1.ObserverTracking();
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
    exports.JCSSTracker = JCSSTracker;
});
