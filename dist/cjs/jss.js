"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JCSS = exports.JssAnimation = exports.JssClass = exports.JssStyle = void 0;
const lib_1 = require("@orago/lib");
function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
class JssStyle {
    static parseContents(data) {
        return Object.entries(data).map(([name, value]) => `${camelToKebab(name)}: ${value}`);
    }
    constructor(data) {
        this.data = data;
    }
    resolve(name, data) {
        const formatted_styles = JssClass.parseContents(data).join("; ");
        return `${name} { ${formatted_styles} }`;
    }
    toString(name) {
        const _a = this.data, { extend } = _a, data = __rest(_a, ["extend"]);
        let style = "";
        style += this.resolve(name, data);
        if (extend != undefined) {
            for (const [key, value] of Object.entries(extend)) {
                style += this.resolve(name + key, value);
            }
        }
        return style;
    }
}
exports.JssStyle = JssStyle;
class JssClass extends JssStyle {
    static parseContents(data) {
        return Object.entries(data).map(([name, value]) => `${camelToKebab(name)}: ${value}`);
    }
    constructor(name, data) {
        super(data);
        this.name = name;
    }
    resolve(name, data) {
        const formatted_styles = JssClass.parseContents(data).join("; ");
        return `${name} { ${formatted_styles} }`;
    }
    toString() {
        return super.toString(this.name);
    }
}
exports.JssClass = JssClass;
class JssAnimation {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
    toString() {
        const formatted_styles = this.data.map(([position, data]) => {
            const dat = JssClass.parseContents(data);
            let range = Array.isArray(position)
                ? position.map(camelToKebab).join("; ")
                : camelToKebab(position);
            return `${range} { ${dat} }`;
        });
        return `@keyframes ${this.name} { ${formatted_styles.join(" ")} }`;
    }
}
exports.JssAnimation = JssAnimation;
class JCSSStyleManager {
    constructor(manager) {
        this.manager = manager;
        this.counter = 0;
        this.indexes = new Map();
        this.list = new Map();
        this.manager = manager;
    }
    call(run) {
        run(this);
        return this.manager;
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
        // this.element.sheet?.insertRule(cssClass.toString(), index);
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
        return this.manager;
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
        // this.element.sheet?.insertRule(cssClass.toString(), index);
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
        this.style = (0, lib_1.makeCallableClass)(JCSSStyleManager, this);
        // new JCSSClassManager(this);
        // animations = new JCSSAnimationManager(this);
        this.animation = (0, lib_1.makeCallableClass)(JCSSAnimationManager, this);
        this.inserted_state = false;
    }
    insert() {
        if (this.inserted_state == false) {
            document.head.appendChild(this.element);
            this.inserted_state = document.head.contains(this.element);
            this.build();
        }
        return this;
    }
    remove() {
        this.element.remove();
        this.inserted_state = document.head.contains(this.element);
        return this;
    }
    /**
     * @deprecated
     */
    rebuild() {
        return this.build();
    }
    build() {
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
exports.JCSS = JCSS;
