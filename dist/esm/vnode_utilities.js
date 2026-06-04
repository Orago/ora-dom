export class VNodeUtilities {
    static flattenContents(contents) {
        return contents
            .flat()
            .filter((content) => content != undefined && content != false)
            .map((a) => {
            let t = typeof a;
            // convert number or bool types to string
            a = "number" == t || "boolean" == t ? String(a) : a;
            // // convert strings to text nodes
            // a = typeof a == "string" ? document.createTextNode(a) : a;
            return a;
        });
    }
    static flattenElements(contents) {
        return contents
            .flat()
            .filter((content) => content !== undefined && content !== false)
            .map((a) => {
            let t = typeof a;
            // convert number or bool types to string
            a = "number" == t || "boolean" == t ? String(a) : a;
            a = "string" == typeof a ? document.createTextNode(a) : a;
            return a;
        });
    }
    static injectItems(node, direction = "append", objs) {
        if (objs.length < 1) {
            return;
        }
        const items = this.flattenContents(objs);
        for (const item of items) {
            const extracted = typeof item === "string" ? item : VNodeExtractEl(item);
            if (direction === "append") {
                node.append(extracted);
            }
            else {
                node.prepend(extracted);
            }
        }
    }
    static setAttributes(element, attributes = {}) {
        if (typeof attributes == "object" && attributes !== null) {
            for (let [key, value] of Object.entries(attributes)) {
                if (value == null)
                    continue;
                key = VNodeUtilities.formatAttributeName("kebab", key);
                element.setAttribute(key, String(value));
            }
        }
    }
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
    static formatAttributeName(as, text) {
        switch (as) {
            case "camel":
                return text
                    .split("-")
                    .map((e, i) => (i > 0
                    ? e.slice(0, 1).toUpperCase()
                    : e.slice(0, 1).toLowerCase()) +
                    e.slice(1))
                    .join("");
            case "kebab":
                return text
                    .replace(/([A-Z]{2,})/g, (match) => match.split("").join("-"))
                    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                    .toLowerCase();
        }
    }
    static elementTextFind(options, dict) {
        return dict.filter(([text]) => {
            if (options.lowercase == true) {
                text = String(text).toLowerCase();
            }
            if (options.uppercase == true) {
                text = String(text).toUpperCase();
            }
            if (typeof options.find == "function") {
                return options.find(text) == true;
            }
            else {
                return text === options.find;
            }
        });
    }
    static whereString(options) {
        var _a, _b, _c, _d, _e;
        const class_str = (_b = (_a = options.classes) === null || _a === void 0 ? void 0 : _a.map((e) => "." + e)) === null || _b === void 0 ? void 0 : _b.join("");
        const attr_str = Object.entries((_c = options.attributes) !== null && _c !== void 0 ? _c : {}).map(([k, v]) => {
            k = VNodeUtilities.formatAttributeName("kebab", k);
            return `[${k}='${v}']`;
        });
        const data_str = Object.entries((_d = options.data) !== null && _d !== void 0 ? _d : {}).map(([k, v]) => {
            k = VNodeUtilities.formatAttributeName("kebab", k);
            return `[data-${k}='${v}']`;
        });
        return `${(_e = options.id) !== null && _e !== void 0 ? _e : ""}${class_str}${attr_str}${data_str}`;
    }
    static applyVNProps(node, props) {
        var _a;
        if (props) {
            if (props.attributes) {
                node.attr(props.attributes);
            }
            if (props.properties) {
                Object.assign(node.element, props.properties);
            }
            if (props.style) {
                node.style(props.style);
            }
            if (props.dataset) {
                for (const [key, value] of Object.entries(props.dataset)) {
                    node.element.dataset[key] = value;
                }
            }
            if (props.class) {
                if (typeof props.class == "string") {
                    node.class.add(props.class);
                }
                else {
                    node.class.add(...props.class);
                }
            }
            if (props.on) {
                for (const [event, handler] of Object.entries(props.on)) {
                    node.events.on(event, handler);
                }
            }
            const on_pre = "on:";
            for (const key in props) {
                const p = props[key];
                if (key.startsWith(on_pre) && typeof p === "function") {
                    const event = key.slice(on_pre.length).toLowerCase();
                    node.events.on(event, p);
                }
            }
            if (props.ref) {
                props.ref(node);
            }
            if (props.use) {
                node.use(props.use);
            }
            const children = VNodeUtilities.flattenElements([
                (_a = props.children) !== null && _a !== void 0 ? _a : [],
            ]);
            const all_string = children.every((e) => typeof e == "string");
            if (all_string) {
                node.append(children.join(""));
            }
            else {
                node.append(...children);
            }
        }
    }
}
export class VNodeUtilityClass {
    constructor(node) {
        this.node = node;
    }
    nest(run) {
        run(this);
        return this.node;
    }
}
export function VNodeExtractEl(node) {
    if ("element" in node) {
        return node.element;
    }
    return node;
}
