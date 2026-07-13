"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleNode = exports.JCSSTracker = exports.StyledVNode = void 0;
const dom_observer_js_1 = require("./dom_observer.js");
const sparkle_css_js_1 = require("./sparkle-css.js");
const vnode_js_1 = require("./vnode.js");
class StyledNodeManager {
    constructor(id) {
        this.id = id;
        this.class = new sparkle_css_js_1.SparkleStyle("." + this.getClassName(), {});
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
        const is_new = _a.managers.get(c) == undefined;
        const manager = this.getManager(c);
        if (is_new) {
            if (styles instanceof sparkle_css_js_1.SparkleStyle) {
                manager.class.data = styles.data;
            }
            else {
                manager.class.data = styles;
            }
            this.sheet_group.styles.insert(manager.class);
            this.sheet.build();
        }
        return manager.getClassName();
    }
    static connect(class_ref, styles) {
        const c = this.getConstructor(class_ref);
        if (styles == undefined) {
            const manager = _a.managers.get(c);
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
        let manager = _a.managers.get(c);
        if (manager == undefined) {
            const id = ++_a.class_index;
            manager = new StyledNodeManager(id);
            _a.managers.set(c, manager);
        }
        return manager;
    }
    /** Destroys the class and it's relations for a vnode class */
    static destroy(class_ref) {
        const c = this.getConstructor(class_ref);
        const manager = this.getManager(c);
        const jss_class = this.sheet_group.styles.list.get(manager.class.name);
        if (jss_class) {
            this.sheet_group.styles.remove(jss_class);
            this.sheet.build();
        }
        _a.managers.delete(c);
    }
    static init() {
        this.sheet.attach();
    }
    static validStyles(styles) {
        return styles;
    }
    constructor(element) {
        super(element);
        _a.connect(this, this.getConstructor().styles);
    }
    getConstructor() {
        return this.constructor;
    }
}
exports.StyledVNode = StyledVNode;
_a = StyledVNode;
StyledVNode.managers = new Map();
StyledVNode.class_index = 0;
/** Should not be changed */
StyledVNode.sheet = new sparkle_css_js_1.Sparkle();
StyledVNode.sheet_group = _a.sheet.newGroup();
/** May be overridden by extending the class */
StyledVNode.styles = {};
class JCSSTracker {
    constructor(instance, observer = new dom_observer_js_1.ObserverTracking()) {
        this.instance = instance;
        this.observer = observer;
        this.instance.attach();
        function callback() {
            if (this.instance.getUsageCount() === 0) {
                this.instance.detach();
            }
            else {
                this.instance.attach();
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
class StyleNode extends vnode_js_1.VNode {
    static css(value) {
        const node = new StyleNode();
        return node.css(value);
    }
    constructor() {
        const sparkle = new sparkle_css_js_1.Sparkle();
        const group = new sparkle_css_js_1.SparkleGroup();
        super(sparkle.element);
        this.sparkle = sparkle;
        this.group = group;
        this.sparkle.insert(group);
    }
    css(value) {
        this.group.css(value);
        this.sparkle.build();
        return this;
    }
}
exports.StyleNode = StyleNode;
