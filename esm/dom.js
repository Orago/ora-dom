import { ObserverGroup } from './domObserver.js';
const nodeObservers = new ObserverGroup;
export class ProxyNode {
    static extractEl(node) {
        return node instanceof ProxyNode ? node.element : node;
    }
    static isNode(el) {
        return el instanceof ProxyNode;
    }
    get call() {
        return this;
    }
    constructor(el) {
        this.data = {};
        this.privateData = {};
        this.listeners = {};
        if (typeof el === 'string') {
            this.element = document.createElement(el);
        }
        else if (el instanceof Element ||
            el instanceof HTMLElement ||
            el instanceof HTMLInputElement) {
            this.element = el;
        }
        else if (el instanceof ProxyNode) {
            this.element = el.element;
        }
        else {
            throw new Error('Invalid el');
        }
    }
    get focused() {
        return document.activeElement === this.element;
    }
    get childFocused() {
        return this.focused || this.element.contains(document.activeElement);
    }
    get bounds() {
        return this.element.getBoundingClientRect();
    }
    get parent() {
        const parent = this.element.parentElement;
        if (parent != null) {
            return new ProxyNode(parent);
        }
    }
    get value() {
        var _a;
        if (this.element instanceof HTMLInputElement) {
            return this.element.value;
        }
        else {
            return (_a = this.element.textContent) !== null && _a !== void 0 ? _a : '';
        }
    }
    set value(value) {
        if (this.element instanceof HTMLInputElement) {
            this.element.value = value;
        }
        else {
            this.element.textContent = value;
        }
    }
    get wrapper() {
        return this.ref;
    }
    ref(run) {
        run(this);
        return this;
    }
    text(content) {
        this.element.textContent = content;
        return this;
    }
    id(value) {
        this.element.id = value;
        return this;
    }
    attr(attributes = {}) {
        if (typeof attributes != 'object') {
            return this;
        }
        for (const [key, value] of Object.entries(attributes)) {
            this.element.setAttribute(key, value + '');
        }
        return this;
    }
    swap(node) {
        const newNode = ProxyNode.extractEl(node);
        this.element.replaceWith(newNode);
        this.element = newNode;
        return this;
    }
    clone() {
        return new ProxyNode(this.element.cloneNode(true));
    }
    clear() {
        this.element.textContent = '';
        return this;
    }
    exists() {
        return document.body.contains(this.element);
    }
    getChildren() {
        return Array.from(this.element.children).map(documentEl => new ProxyNode(documentEl));
    }
    reset(...toReset) {
        const options = toReset.length > 0 ? toReset : ['content', 'style', 'class'];
        for (const option of options) {
            if (option === 'content') {
                this.element.innerHTML = '';
            }
            else if (option === 'style') {
                if (this.element instanceof HTMLElement) {
                    const styleObj = this.element.style;
                    for (let i = styleObj.length; i--;) {
                        const nameString = styleObj[i];
                        styleObj.removeProperty(nameString);
                    }
                }
            }
            else if (option === 'class') {
                this.element.className = '';
            }
        }
        return this;
    }
    class(...args) {
        this.element.className = args.join(' ');
        return this;
    }
    hasClass(className) {
        return this.element.classList.contains(className);
    }
    addClass(...args) {
        for (const arg of args) {
            if (arg.includes(' ')) {
                args.splice(args.indexOf(arg), 1, ...arg.split(' '));
            }
            else if (Array.isArray(arg)) {
                args.splice(args.indexOf(arg), 1, ...arg);
            }
        }
        if (Array.isArray(args)) {
            this.element.classList.add(...args);
        }
        return this;
    }
    removeClass(...args) {
        for (const arg of args) {
            if (arg.includes(' ')) {
                args.splice(args.indexOf(arg), 1, ...arg.split(' '));
            }
        }
        if (Array.isArray(args)) {
            this.element.classList.remove(...args);
        }
        return this;
    }
    toggleClass(className, status = !this.hasClass(className)) {
        status ? this.addClass(className) : this.removeClass(className);
        return this;
    }
    styles(styles = {}) {
        if (typeof styles != 'object') {
            return this;
        }
        else if (this.element instanceof HTMLElement != true) {
            return this;
        }
        for (const [key, value] of Object.entries(styles)) {
            if (key === 'props') {
                for (const [propKey, propValue] of Object.entries(value)) {
                    this.element.style.setProperty(`--${propKey}`, propValue);
                }
            }
            this.element.style[key] = value;
        }
        return this;
    }
    removeStyles(...styles) {
        if (this.element instanceof HTMLElement != true) {
            return this;
        }
        for (const style of styles) {
            this.element.style.removeProperty(style);
        }
        return this;
    }
    on(event, callback) {
        this.addListener({
            temp: {
                [event]: callback
            }
        });
        return this;
    }
    addListener(events) {
        var _a;
        var _b;
        for (const [key, event] of Object.entries(events)) {
            for (const [listener, fn] of Object.entries(event)) {
                if (listener == 'keypress' ||
                    listener == 'keydown' ||
                    listener == 'keyup') {
                    this.attr({ tabindex: 0 });
                }
                const func = fn.bind(this);
                (_a = (_b = this.listeners)[key]) !== null && _a !== void 0 ? _a : (_b[key] = {});
                this.listeners[key][listener] = func;
                this.element.addEventListener(listener, func);
            }
        }
        return this;
    }
    removeListener(key) {
        for (const listener in this.listeners[key]) {
            this.element.removeEventListener(listener, this.listeners[key][listener]);
        }
        delete this.listeners[key];
        return this;
    }
    interval(callback, time = 1000, immediate = false) {
        const toCall = () => callback.bind(this)(this, () => clearInterval(tempInterval));
        if (immediate) {
            toCall();
        }
        let tempInterval = setInterval(toCall, time);
        this.observer({
            onRemove: () => clearInterval(tempInterval)
        });
        return this;
    }
    remove() {
        this.element.remove();
        return this;
    }
    setContent(...content) {
        return this.clear().append(...content);
    }
    append(...objs) {
        if (objs.length < 1) {
            return this;
        }
        for (const el of objs) {
            if (Array.isArray(el)) {
                objs.splice(objs.indexOf(el), 1, ...el);
            }
        }
        for (const item of objs) {
            if (item == false ||
                item == null ||
                Array.isArray(item)) {
                continue;
            }
            else if (typeof item === 'string') {
                this.element.append(item);
            }
            else {
                this.element.append(ProxyNode.extractEl(item));
            }
        }
        return this;
    }
    appendTo(obj) {
        if (obj == false) {
            return this;
        }
        obj.append(ProxyNode.extractEl(this.element));
        return this;
    }
    prependTo(obj) {
        if (obj == null) {
            return this;
        }
        obj.prepend(ProxyNode.extractEl(this.element));
        return this;
    }
    prepend(...objs) {
        if (objs.length < 1) {
            return this;
        }
        for (const el of objs) {
            if (Array.isArray(el)) {
                const i = objs.indexOf(el);
                objs.splice(i, i + el.length);
                objs.push(...el);
            }
        }
        for (const el of objs) {
            this.element.prepend(ProxyNode.extractEl(el));
        }
        return this;
    }
    focus() {
        setTimeout(() => this.element instanceof HTMLElement &&
            this.element.focus(), 0);
        return this;
    }
    scroll(x = 0, y = 0) {
        setTimeout(() => this.element.scroll(x, y), 500);
        return this;
    }
    observer(methods, options) {
        nodeObservers.create(this, methods, options);
        return this;
    }
    setTabIndex(index) {
        if (typeof index == 'number') {
            if (0 > index) {
                this.element.removeAttribute('tabindex');
            }
            else {
                this.element.setAttribute('tabindex', '0');
            }
        }
        return this;
    }
    horizontalScrolling() {
        this.on('wheel', (event) => {
            event.preventDefault();
            this.element.scrollLeft += event.deltaY;
        });
        return this;
    }
    animate(styles, options) {
        var _a;
        const instance = this.element.animate(styles, options);
        if (typeof options === 'object') {
            instance.onfinish = (ev) => {
                var _a, _b;
                (_b = (_a = options.onFinish) === null || _a === void 0 ? void 0 : _a.bind(instance)) === null || _b === void 0 ? void 0 : _b(ev);
                if (options.save === true) {
                    this.styles(styles[styles.length - 1]);
                }
            };
            options.onCancel && (instance.oncancel = options.onCancel);
            options.onRemove && (instance.onremove = options.onRemove);
            (_a = options.animationReference) === null || _a === void 0 ? void 0 : _a.call(options, instance);
        }
        return this;
    }
}
export function generateProxyNode(el) {
    return new ProxyNode(el);
}
export const newNode = new Proxy({}, {
    get(target, elementTag) {
        return generateProxyNode(document.createElement(elementTag));
    }
});
export function qs(selector, element = document) {
    const currentNode = element.querySelector(selector);
    return currentNode ? new ProxyNode(currentNode) : null;
}
export function qsAll(selector, element = document) {
    return Array
        .from(element.querySelectorAll(selector))
        .map($ => $ ? new ProxyNode($) : newNode.div);
}
export default {
    newNode,
    qs,
    generateProxyNode,
    fetch
};
