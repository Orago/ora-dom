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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@orago/lib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OraCss = exports.OraCssAnimation = exports.OraCssClass = exports.OraCssStyle = void 0;
    const lib_1 = require("@orago/lib");
    function camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }
    class OraCssStyle {
        static parseContents(data) {
            return Object.entries(data).map(([name, value]) => `${camelToKebab(name)}: ${value}`);
        }
        static resolve(name, data) {
            const formatted_styles = OraCssStyle.parseContents(data).join("; ");
            return `${name} { ${formatted_styles} }`;
        }
        static parseExtend(style_name, extend) {
            return Object.entries(extend).map(([key, value]) => {
                let style_name_out;
                if (key.includes("&")) {
                    if (key.startsWith("&")) {
                        key = key.slice(1);
                    }
                    style_name_out = style_name + key.replace(/&/g, style_name);
                }
                else {
                    style_name_out = style_name + key;
                }
                return OraCssStyle.resolve(style_name_out, value);
            });
        }
        static toString(style_name, data, indent = 0) {
            const { extend, media: media_list } = data, other_styles = __rest(data, ["extend", "media"]);
            const indent_string = "\t".repeat(indent);
            const line_seperator = `\n${indent_string}`;
            let strings = [];
            strings.push(OraCssStyle.resolve(style_name, other_styles));
            if (media_list != undefined) {
                const k = OraCssStyle.Media.toString(style_name, media_list, indent);
                strings.push(k);
            }
            if (extend != undefined) {
                strings.push(...OraCssStyle.parseExtend(style_name, extend));
            }
            return ((indent > 0 ? line_seperator : "") +
                strings.join(" " + line_seperator));
        }
        constructor(name, data) {
            this.name = name;
            this.data = data;
        }
        toString() {
            return OraCssStyle.toString(this.name, this.data);
        }
    }
    exports.OraCssStyle = OraCssStyle;
    OraCssStyle.Media = class OraCssMedia {
        static createString(options, styles, indent = 0) {
            let indent_string = "\t".repeat(indent);
            let parts = [];
            if (options.min_width) {
                parts.push(`(min-width: ${options.min_width})`);
            }
            if (options.max_width) {
                parts.push(`(max-width: ${options.max_width})`);
            }
            if (options.min_height) {
                parts.push(`(min-height: ${options.min_height})`);
            }
            if (options.max_height) {
                parts.push(`(max-height: ${options.max_height})`);
            }
            const parts_string = parts.join(" and ");
            const inner_styles = styles
                .map(([name, options]) => {
                return OraCssStyle.toString(name, options, indent + 1);
            })
                .join("\n");
            return `@media ${parts_string} {${inner_styles}\n${indent_string}}`;
        }
        static toString(style_name, options, indent = 0) {
            let s = [];
            for (const m of options) {
                const other_styles = __rest(m.styles, []);
                const str = OraCssStyle.Media.createString(m.if, [[style_name, other_styles]], indent);
                s.push(str);
            }
            return s.join("🐱🐱🐱");
        }
    };
    class OraCssClass extends OraCssStyle {
        constructor(classname, options) {
            super(`.${classname}`, options);
            this.classname = classname;
        }
        getName() {
            return this.classname;
        }
    }
    exports.OraCssClass = OraCssClass;
    class OraCssAnimation {
        static toString(name, options) {
            const formatted_styles = options.map(([position, data]) => {
                const dat = OraCssStyle.parseContents(data);
                let range = Array.isArray(position)
                    ? position.map(camelToKebab).join("; ")
                    : camelToKebab(position);
                return `${range} { ${dat.join(";")} }`;
            });
            return `@keyframes ${name} { ${formatted_styles.join(" ")} }`;
        }
        constructor(name, options) {
            this.name = name;
            this.options = options;
        }
        toString() {
            return OraCssAnimation.toString(this.name, this.options);
        }
    }
    exports.OraCssAnimation = OraCssAnimation;
    class OraCssDepot {
        constructor(manager, generator) {
            this.manager = manager;
            this.generator = generator;
            this.counter = 0;
            this.indexes = new Map();
            this.list = new Map();
        }
        call(run) {
            run(this);
            return this.manager;
        }
        has(name) {
            return this.list.has(name);
        }
        insert(instance) {
            const index = this.counter++;
            this.list.set(instance.name, instance);
            this.indexes.set(instance, index);
        }
        add(...args) {
            switch (arguments.length) {
                case 1: {
                    this.insert(args[0]);
                    break;
                }
                case 2: {
                    this.insert(this.generator(args[0], args[1]));
                    break;
                }
            }
            return this;
        }
        remove(input) {
            if (typeof input == "string") {
                const found = this.list.get(input);
                if (found == null) {
                    return false;
                }
                else {
                    // cycles back to remove instanced version
                    return this.remove(found);
                }
            }
            else {
                const index = this.indexes.get(input);
                if (index == null) {
                    return false;
                }
                else {
                    this.list.delete(input.name);
                    this.indexes.delete(input);
                    return true;
                }
            }
        }
    }
    class StyleManager extends OraCssDepot {
        constructor(manager) {
            super(manager, (name, options) => new OraCssStyle(name, options));
        }
    }
    class AnimationManager extends OraCssDepot {
        constructor(manager) {
            super(manager, (name, options) => new OraCssAnimation(name, options));
        }
    }
    class OraCss {
        constructor() {
            this.element = document.createElement("style");
            this.styles = (0, lib_1.makeCallableClass)(StyleManager, this);
            this.animations = (0, lib_1.makeCallableClass)(AnimationManager, this);
        }
        static createPluginStyle(callback) {
            return callback;
        }
        static createPluginAnimation(callback) {
            return callback;
        }
        static createStyle(name, data) {
            return new OraCssStyle(name, data);
        }
        static createClass(name, data) {
            return new OraCssClass(name, data);
        }
        static createAnimation(name, options) {
            return new OraCssAnimation(name, options);
        }
        /**
         * inserts stylesheet into the dom onto element then stores reference
         */
        attach(element = document.head) {
            if (element !== this.attatched) {
                if (this.attatched != undefined) {
                    this.detach();
                }
                this.attatched = element;
                this.attatched.appendChild(this.element);
                this.build();
            }
            return this;
        }
        /**
         * removes stylesheet from the DOM
         */
        detach() {
            this.element.remove();
            this.attatched = undefined;
            return this;
        }
        insert(...instances) {
            for (const instance of instances) {
                if (instance instanceof OraCssStyle) {
                    this.styles.add(instance);
                }
                else if (instance instanceof OraCssAnimation) {
                    this.animations.add(instance);
                }
            }
            return this;
        }
        build() {
            const classes_string = Array.from(this.styles.list.values())
                .map((instance) => instance.toString())
                .join("\n");
            const animations_string = Array.from(this.animations.list.values())
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
            return Array.from(this.styles.list.values())
                .map(selectAndCount)
                .reduce((accumulator, current) => accumulator + current, 0);
        }
        ref(run) {
            run(this);
            return this;
        }
    }
    exports.OraCss = OraCss;
    OraCss.ExtendStyle = class ExtendStyle {
        static classname(name) {
            return ` .${name}`;
        }
    };
});
