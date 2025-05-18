function camelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
class JssClass {
    static parseContents(data) {
        return Object.entries(data).map(([name, value]) => `${camelToKebab(name)}: ${value}`);
    }
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
    toString() {
        const formatted_styles = JssClass.parseContents(this.data);
        return `${this.name} { ${formatted_styles.join("; ")} }`;
    }
}
class JssAnimation {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
    toString() {
        const formatted_styles = this.data.map(([position, data]) => {
            const dat = JssClass.parseContents(data);
            let range = Array.isArray(position)
                ? position.map(camelToKebab).join(", ")
                : camelToKebab(position);
            return `${range} { ${dat} }`;
        });
        return `@keyframes ${this.name} { ${formatted_styles.join(" ")} }`;
    }
}
class JCSSClassManager {
    constructor(manager) {
        this.manager = manager;
        this.counter = 0;
        this.indexes = new Map();
        this.list = new Map();
        this.manager = manager;
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
export class JCSS {
    constructor() {
        this.element = document.createElement("style");
        this.styles = new JCSSClassManager(this);
        this.animations = new JCSSAnimationManager(this);
        this.inserted_state = false;
    }
    insert() {
        if (this.inserted_state == false) {
            document.head.appendChild(this.element);
            this.inserted_state = document.head.contains(this.element);
        }
        return this;
    }
    remove() {
        this.element.remove();
        this.inserted_state = document.head.contains(this.element);
        return this;
    }
    rebuild() {
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
