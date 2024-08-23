class Emitter {
    constructor(all) {
        this.all = new Map();
        if (all instanceof Map) {
            this.all = all;
        }
        else if (Array.isArray(all)) {
            this.all = new Map(all);
        }
    }
    on(event, handler) {
        const handlers = this.all.get(event);
        if (handlers) {
            handlers.push(handler);
        }
        else {
            this.all.set(event, [handler]);
        }
        return this;
    }
    off(event, handler) {
        const handlers = this.all.get(event);
        if (handlers) {
            if (handler) {
                const index = handlers.indexOf(handler);
                if (index !== -1) {
                    handlers.splice(index, 1);
                }
            }
            else {
                this.all.set(event, []);
            }
        }
        return this;
    }
    emit(event, ...args) {
        let handlers = this.all.get(event);
        if (handlers) {
            for (const handler of handlers.slice()) {
                handler(...args);
            }
        }
        if (handlers = this.all.get('*')) {
            for (const handler of handlers.slice()) {
                handler(event, ...args);
            }
        }
        return this;
    }
    *[Symbol.iterator]() {
        for (const entry of this.all.entries()) {
            yield entry;
        }
    }
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  return unsafeStringify(rnds);
}

class ObservableNode {
    constructor(group, node) {
        this.group = group;
        this.node = node;
        this.events = new Emitter();
        this.id = v4();
        this.killOnRemove = false;
        this.node = node;
        this.inDom = document.body.contains(this.node.element);
        this.group = group;
        this.group.alive.set(this.id, this);
    }
    handleMutation() {
        // If it's in dom now but wasn't before
        if (document.body.contains(this.node.element)) {
            if (this.inDom != true)
                this.events.emit('append', this.node);
            this.inDom = true;
        }
        /* Was in dom but removed */
        else if (this.inDom) {
            this.inDom = false;
            this.events.emit('remove', this.node);
            if (this.killOnRemove == true)
                this.kill();
        }
    }
    kill() {
        this.group.alive.delete(this.id);
    }
}
class ObserverGroup {
    constructor() {
        this.alive = new Map();
        const mainObserver = new MutationObserver(() => {
            for (const observer of this.alive.values())
                observer.handleMutation();
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
    }
    create(node) {
        return new ObservableNode(this, node);
    }
}

const nodeObservers = new ObserverGroup();
class ProxyNode {
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
        if (typeof el === 'string')
            this.element = document.createElement(el);
        else if (el instanceof Element ||
            el instanceof HTMLElement ||
            el instanceof HTMLInputElement)
            this.element = el;
        else if (el instanceof ProxyNode)
            this.element = el.element;
        else
            throw new Error('Invalid element');
        // if (weakStorage.has(this.element) != true)
        // 	weakStorage.set(this.element, new ProxyNodeStorage());
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
        if (parent != null)
            return new ProxyNode(parent);
    }
    get value() {
        var _a;
        if (this.element instanceof HTMLInputElement)
            return this.element.value;
        return (_a = this.element.textContent) !== null && _a !== void 0 ? _a : '';
    }
    set value(value) {
        if (this.element instanceof HTMLInputElement)
            this.element.value = value;
        else
            this.element.textContent = value;
    }
    /** @deprecated - removed in the next version */
    get wrapper() {
        return this.ref;
    }
    ref(run) {
        run(this);
        return this;
    }
    //#region //* Default Utils *//
    text(content) {
        this.element.textContent = content;
        return this;
    }
    id(value) {
        this.element.id = value;
        return this;
    }
    attr(attributes = {}) {
        if (typeof attributes != 'object')
            return this;
        for (const [key, value] of Object.entries(attributes))
            this.element.setAttribute(key, value + '');
        return this;
    }
    swap(node) {
        const newNode = ProxyNode.extractEl(node);
        this.element.replaceWith(newNode);
        this.element = newNode;
        return this;
    }
    /**
     * Creates a cloned node
     */
    clone() {
        return new ProxyNode(this.element.cloneNode(true));
    }
    /**
     * Clears inner content
     */
    clear() {
        this.element.textContent = '';
        return this;
    }
    /**
     * Checks if dom contains element
     */
    exists() {
        return document.body.contains(this.element);
    }
    /**
     * Returns a list of child proxy nodes
     */
    getChildren() {
        return Array.from(this.element.children).map(documentEl => new ProxyNode(documentEl));
    }
    /**
     *
     * @param toReset
     * @returns
     * @deprecated - Possibly removed in the next version
     */
    reset(...toReset) {
        const options = toReset.length > 0 ? toReset : ['content', 'style', 'class'];
        for (const option of options) {
            /* Clear inner content */
            if (option === 'content') {
                this.element.innerHTML = '';
            }
            /* Clear styles */
            else if (option === 'style') {
                if (this.element instanceof HTMLElement) {
                    const styleObj = this.element.style;
                    for (let i = styleObj.length; i--;) {
                        const nameString = styleObj[i];
                        styleObj.removeProperty(nameString);
                    }
                }
            }
            else if (option === 'class') { /* Clear classes */
                this.element.className = '';
            }
        }
        return this;
    }
    //#endregion //* Default Utils *//
    //#region //* Classes *//
    class(...args) {
        this.element.className = args.join(' ');
        return this;
    }
    hasClass(className) {
        return this.element.classList.contains(className);
    }
    addClass(...args) {
        for (const arg of args) {
            if (arg.includes(' '))
                args.splice(args.indexOf(arg), 1, ...arg.split(' '));
            else if (Array.isArray(arg))
                args.splice(args.indexOf(arg), 1, ...arg);
        }
        if (Array.isArray(args))
            this.element.classList.add(...args);
        return this;
    }
    removeClass(...args) {
        for (const arg of args)
            if (arg.includes(' '))
                args.splice(args.indexOf(arg), 1, ...arg.split(' '));
        if (Array.isArray(args))
            this.element.classList.remove(...args);
        return this;
    }
    toggleClass(className, status = !this.hasClass(className)) {
        status ? this.addClass(className) : this.removeClass(className);
        return this;
    }
    //#endregion //* Classes *//
    //#region //* Styles *//
    styles(styles = {}) {
        if (typeof styles != 'object')
            return this;
        if (this.element instanceof HTMLElement != true)
            return this;
        for (const [key, value] of Object.entries(styles)) {
            if (key === 'props') {
                for (const [propKey, propValue] of Object.entries(value)) {
                    this.element.style.setProperty(`--${propKey}`, propValue);
                }
            }
            // @ts-ignore
            this.element.style[key] = value;
        }
        return this;
    }
    removeStyles(...styles) {
        if (this.element instanceof HTMLElement != true)
            return this;
        for (const style of styles)
            this.element.style.removeProperty(style);
        return this;
    }
    //#endregion //* Styles *//
    get safeEvents() {
        var _a;
        return (_a = this.events) !== null && _a !== void 0 ? _a : (this.events = new Emitter());
    }
    //#region //* Listeners *//
    on(event, callback) {
        if (event === 'remove' || event === 'append') {
            if (this._observer == null)
                this._observer = nodeObservers.create(this);
            this._observer
                .events
                .on('append', () => this.safeEvents.emit('append'))
                .on('remove', () => {
                var _a;
                this.safeEvents.emit('remove');
                (_a = this._observer) === null || _a === void 0 ? void 0 : _a.kill();
                delete this._observer;
            });
            if (event === 'remove')
                this.safeEvents.on('remove', callback);
            else if (event === 'append')
                this.safeEvents.on('append', callback);
        }
        else
            this.addListener({
                temp: { [event]: callback }
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
        for (const listener in this.listeners[key])
            this.element.removeEventListener(listener, this.listeners[key][listener]);
        delete this.listeners[key];
        return this;
    }
    //#endregion //* Listeners *//
    //#region //* Intervals *//
    /**
     *
     * @deprecated - stop using this dumbass
     */
    interval(callback, time = 1000, immediate = false) {
        const toCall = () => callback.bind(this)(this, () => clearInterval(tempInterval));
        if (immediate)
            toCall();
        const tempInterval = setInterval(toCall, time);
        this.on('remove', () => clearInterval(tempInterval));
        return this;
    }
    //#endregion //* Intervals *//
    //#region //* Random *//
    remove() {
        this.element.remove();
        return this;
    }
    /**
     * clears the content and appends
     */
    setContent(...content) {
        return this.clear().append(...content);
    }
    append(...objs) {
        if (objs.length < 1)
            return this;
        for (const el of objs)
            if (Array.isArray(el))
                objs.splice(objs.indexOf(el), 1, ...el);
        for (const item of objs) {
            if (item == false ||
                item == null ||
                Array.isArray(item))
                continue;
            this.element.append(typeof item === 'string' ?
                item :
                ProxyNode.extractEl(item));
        }
        return this;
    }
    appendTo(obj) {
        if (obj == false)
            return this;
        obj.append(ProxyNode.extractEl(this.element));
        return this;
    }
    prependTo(obj) {
        if (obj == null)
            return this;
        obj.prepend(ProxyNode.extractEl(this.element));
        return this;
    }
    prepend(...objs) {
        if (objs.length < 1)
            return this;
        for (const el of objs) {
            if (Array.isArray(el)) {
                const i = objs.indexOf(el);
                objs.splice(i, i + el.length);
                objs.push(...el);
            }
        }
        for (const el of objs)
            this.element.prepend(ProxyNode.extractEl(el));
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
    setTabIndex(index) {
        if (typeof index == 'number') {
            if (0 > index)
                this.element.removeAttribute('tabindex');
            else
                this.element.setAttribute('tabindex', '0');
        }
        return this;
    }
    /**
     * @deprecated - Possibly removed in the next version
     */
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
                if (options.save === true) {
                    this.styles(styles[styles.length - 1]);
                }
                (_b = (_a = options.onFinish) === null || _a === void 0 ? void 0 : _a.bind(instance)) === null || _b === void 0 ? void 0 : _b(ev);
            };
            options.onCancel && (instance.oncancel = options.onCancel);
            options.onRemove && (instance.onremove = options.onRemove);
            (_a = options.animationReference) === null || _a === void 0 ? void 0 : _a.call(options, instance);
        }
        return this;
    }
}
function generateProxyNode(el) {
    return new ProxyNode(el);
}
const newNode = new Proxy({}, {
    get(target, elementTag) {
        return generateProxyNode(document.createElement(elementTag));
    }
});
function qs(selector, element = document) {
    const currentNode = element.querySelector(selector);
    return currentNode ? new ProxyNode(currentNode) : null;
}
function qsAll(selector, element = document) {
    return Array
        .from(element.querySelectorAll(selector))
        .map($ => $ ? new ProxyNode($) : newNode.div);
}
var dom = {
    newNode,
    qs,
    generateProxyNode,
    fetch
};

export { ProxyNode, dom as default, generateProxyNode, newNode, nodeObservers, qs, qsAll };
