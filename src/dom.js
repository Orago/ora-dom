import { ObserverGroup } from './domObserver.js';

const nodeObservers = new ObserverGroup;

/**
 * @typedef {{
 *  [style: string]: (string | number) | {[style: string]: string | number},
 * }} stylesInput
 */

/**
 * @typedef {ProxyNode | Element} extractable
 */
export class ProxyNode {
	/**
	 * 
	 * @param {extractable} node 
	 * @returns {Element}
	 */
	static extractEl(node) {
		return node instanceof ProxyNode ? node.element : node;
	}

	/**
	 * @param {ProxyNode | any} el 
	 * @returns {boolean}
	 */
	static isNode(el) {
		return el instanceof ProxyNode;
	}

	data = {};
	privateData = {};

	/**
	 * @type {Element}
	 */
	element;

	/**
	 * @type {{[key: string]: {[listener: string]: ReturnType<Function['bind']> }}}
	 */
	listeners = {};

	get call() {
		return this
	}

	/**
	 * @param {Element | string | ProxyNode} el 
	 */
	constructor(el) {
		if (typeof el === 'string') {
			this.element = document.createElement(el);
		} else if (
			el instanceof Element ||
			el instanceof HTMLElement ||
			el instanceof HTMLInputElement
		) {
			this.element = el;
		} else if (el instanceof ProxyNode) {
			this.element = el.element;
		} else {
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
		return this.element.getBoundingClientRect()
	}

	/** @returns {ProxyNode | undefined} */
	get parent() {
		const parent = this.element.parentElement;

		if (parent != null) {
			return new ProxyNode(parent);
		}
	}

	/** @returns {string} */
	get value() {
		if (this.element instanceof HTMLInputElement) {
			return this.element.value;
		} else {
			return this.element.textContent ?? '';
		}
	}

	/** @param {string} value */
	set value(value) {
		if (this.element instanceof HTMLInputElement) {
			this.element.value = value;
		} else {
			this.element.textContent = value;
		}
	}

	/**
	 * @deprecated
	 * @returns {this['ref']}
	 */
	get wrapper() {
		return this.ref;
	}

	/**
	 * @param {function (ProxyNode): void} run
	 * @returns {this}
	 */
	ref(run) {
		run(this);

		return this;
	}

	//#region //* Default Utils *//
	/**
	 * @param {string} content 
	 * @returns {this}
	 */
	text(content) {
		this.element.textContent = content;

		return this;
	}

	/**
	 * @param {string} value 
	 * @returns {this}
	 */
	id(value) {
		this.element.id = value;

		return this;
	}

	/**
	 * @param {{[attribute: string]: string|number}} attributes 
	 * @returns {this}
	 */
	attr(attributes = {}) {
		if (typeof attributes != 'object') {
			return this;
		}

		for (const [key, value] of Object.entries(attributes)) {
			this.element.setAttribute(key, value + '');
		}

		return this;
	}

	/**
	 * 
	 * @param {this | HTMLElement} node 
	 * @returns {this}
	 */
	swap(node) {
		const newNode = ProxyNode.extractEl(node);

		this.element.replaceWith(newNode);
		this.element = newNode;

		return this;
	}

	/**
	 * Creates a cloned node
	 * @returns {ProxyNode}
	 */
	clone() {
		return new ProxyNode(
			// @ts-ignore
			this.element.cloneNode(true)
		);
	}

	/**
	 * Clears inner content
	 * @returns {this}
	 */
	clear() {
		this.element.textContent = '';

		return this;
	}

	/**
	 * Checks if dom contains element
	 * @returns {boolean}
	 */
	exists() {
		return document.body.contains(this.element);
	}

	/**
	 * Returns a list of child proxy nodes
	 * @returns {Array<ProxyNode>}
	 */
	getChildren() {
		return [...this.element.children].map(documentEl => new ProxyNode(documentEl));
	}

	/**
	 * @param  {...('content' | 'style' | 'class')} toReset 
	 * @returns {this}
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
			} else if (option === 'class') { /* Clear classes */
				this.element.className = '';
			}
		}

		return this;
	}
	//#endregion //* Default Utils *//

	//#region //* Classes *//
	/**
	 * @param  {...string} args 
	 * @returns {this}
	 */
	class(...args) {
		this.element.className = args.join(' ');

		return this;
	}

	/**
	 * @param {string} className 
	 * @returns {boolean}
	 */
	hasClass(className) {
		return this.element.classList.contains(className);
	}

	/**
	 * @param  {...string} args 
	 * @returns {this}
	 */
	addClass(...args) {
		for (const arg of args){
			if (arg.includes(' ')){
				args.splice(args.indexOf(arg), 1, ...arg.split(' '));
			} else if (Array.isArray(arg)){
				args.splice(args.indexOf(arg), 1, ...arg);
			}
		}

		if (Array.isArray(args)){
			this.element.classList.add(...args);
		}

		return this;
	}

	/**
	 * 
	 * @param  {...string} args 
	 * @returns {this}
	 */
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

	/**
	 * @param {string} className 
	 * @param {boolean} status 
	 * @returns {this}
	 */
	toggleClass(className, status = !this.hasClass(className)) {
		status ? this.addClass(className) : this.removeClass(className);

		return this;
	}
	//#endregion //* Classes *//

	//#region //* Styles *//
	/**
	 * @param {stylesInput} styles 
	 * @returns {this}
	 */
	styles(styles = {}) {
		if (typeof styles != 'object') {
			return this;
		} else if (this.element instanceof HTMLElement != true) {
			return this;
		}

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

	/**
	 * @param  {...string} styles 
	 * @returns {this}
	 */
	removeStyles(...styles) {
		if (this.element instanceof HTMLElement != true) {
			return this;
		}

		for (const style of styles) {
			this.element.style.removeProperty(style);
		}

		return this;
	}
	//#endregion //* Styles *//

	//#region //* Listeners *//
	/**
	 * 
	 * @param {string} event 
	 * @param {Function} callback 
	 * @returns {this}
	 */
	on(event, callback) {
		this.addListener({
			temp: {
				[event]: callback
			}
		});

		return this;
	}

	/**
	 * 
	 * @param {{[key: string]: {[listener: string]: Function}}} events 
	 * @returns {this}
	 */
	addListener(events) {
		for (const [key, event] of Object.entries(events)) {
			for (const [listener, fn] of Object.entries(event)) {
				if (
					listener == 'keypress' ||
					listener == 'keydown' ||
					listener == 'keyup'
				) {
					this.attr({ tabindex: 0 });
				}

				const func = fn.bind(this);

				this.listeners[key] ??= {};
				this.listeners[key][listener] = func;

				this.element.addEventListener(listener, func);
			}
		}

		return this;
	}

	/**
	 * 
	 * @param {*} key 
	 * @returns {this}
	 */
	removeListener(key) {
		for (const listener in this.listeners[key]) {
			this.element.removeEventListener(
				listener,
				this.listeners[key][listener]
			);
		}

		delete this.listeners[key]

		return this;
	}
	//#endregion //* Listeners *//

	//#region //* Intervals *//
	/**
	 * @param {Function} callback 
	 * @param {number} [time]  
	 * @param {boolean} [immediate] 
	 * @returns {this}
	 * @deprecated - stop using this dumbass 
	 */
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
	//#endregion //* Intervals *//

	//#region //* Random *//
	remove() {
		this.element.remove();

		return this;
	}

	/**
	 * clears the content and appends
	 * @param  {...any} content 
	 * @returns {this}
	 */
	setContent(...content) {
		return this.clear().append(...content);
	}

	/**
	 * @param  {...extractable | false | string | Array<extractable | false | string>} objs 
	 * @returns {this}
	 */
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
			if (
				item == false ||
				item == null ||
				Array.isArray(item)
			) {
				continue;
			} else if (typeof item === 'string') {
				this.element.append(item);
			} else {
				this.element.append(
					ProxyNode.extractEl(item)
				);
			}
		}

		return this;
	}

	/**
	 * 
	 * @param {extractable | false} obj 
	 * @returns {this}
	 */
	appendTo(obj) {
		if (obj == false) {
			return this;
		}

		obj.append(
			ProxyNode.extractEl(this.element)
		);

		return this;
	}

	/**
	 * @param {extractable} obj 
	 * @returns {this}
	 */
	prependTo(obj) {
		if (obj == null) {
			return this;
		}

		obj.prepend(
			ProxyNode.extractEl(this.element)
		);

		return this;
	}

	/**
	 * @param  {...extractable} objs 
	 * @returns {this}
	 */
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
			this.element.prepend(
				ProxyNode.extractEl(el)
			);
		}

		return this;
	}

	focus() {
		setTimeout(
			() =>
				this.element instanceof HTMLElement &&
				this.element.focus(),
			0
		);

		return this;
	}

	scroll(x = 0, y = 0) {
		setTimeout(() => this.element.scroll(
			x,
			y
		), 500);

		return this;
	}

	/**
	 * @param {import('./domObserver.js').methods} methods 
	 * @param {import('./domObserver.js').options} [options] 
	 * @returns {this}
	 */
	observer(methods, options) {
		nodeObservers.create(this, methods, options);

		return this;
	}

	/**
	 * 
	 * @param {number} index 
	 * @returns {this}
	 */
	setTabIndex(index) {
		if (typeof index == 'number') {
			if (0 > index) {
				this.element.removeAttribute('tabindex');
			} else {
				this.element.setAttribute('tabindex', '0');
			}
		}

		return this;
	}

	horizontalScrolling() {
		this.on(
			'wheel',
			/** @param {any} event */
			event => {
				event.preventDefault();
				this.element.scrollLeft += event.deltaY;
			}
		);

		return this;
	}
	//#endregion //* Random *//
}

/**
 * @param {HTMLElement | Element} el 
 * @returns {ProxyNode}
 */
export function generateProxyNode(el) {
	return new ProxyNode(el);
}

/**
 * @typedef {{[elementTag: string]: ProxyNode}} newNode
 */


/**
 * @type {newNode}
 */
export const newNode = new Proxy({}, {
	/**
	 * 
	 * @param {undefined} target 
	 * @param {string} elementTag 
	 * @returns {ProxyNode}
	 */
	// @ts-ignore
	get(target, elementTag) {
		return generateProxyNode(
			document.createElement(elementTag)
		);
	}
});


/**
 * @param {string} selector 
 * @param {HTMLElement | Document} element 
 * @returns {ProxyNode | null}
 */
export function qs(selector, element = document) {
	const currentNode = element.querySelector(selector);

	return currentNode ? new ProxyNode(currentNode) : null;
}

/**
 * @param {string} selector 
 * @param {HTMLElement | Document} element 
 * @returns {Array<ProxyNode>}
 */
export function qsAll(selector, element = document) {
	return [...element.querySelectorAll(selector)].map(
		$ => $ ? new ProxyNode($) : newNode.div
	);
}

export default {
	newNode,
	qs,
	generateProxyNode,
	fetch
};