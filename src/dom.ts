import Emitter from '@orago/lib/emitter';
import type {
	StyleDeclaration,
	StyleDeclarationWithProps,
	DomAnimationOptions
} from './interfaces.js';

import { ObservableNode, ObserverGroup } from './domObserver.js';

export type {
	StyleDeclaration,
	StyleDeclarationWithProps
} from './interfaces.js';

export const nodeObservers = new ObserverGroup();


type Extractable = ProxyNode | Element;


export class ProxyNode {
	static extractEl(node: Extractable): Element {
		return node instanceof ProxyNode ? node.element : node;
	}

	static isNode(el: ProxyNode | any): boolean {
		return el instanceof ProxyNode;
	}

	// private data: any = {};
	// private privateData: any = {};
	element: Element;
	listeners: { [key: string]: { [listener: string]: ReturnType<Function['bind']>; }; } = {};
	nodeEvents: Emitter = new Emitter();
	private _observer?: ObservableNode;

	get call() {
		return this;
	}

	constructor(el: Element | string | ProxyNode) {
		if (typeof el === 'string')
			this.element = document.createElement(el);

		else if (
			el instanceof Element ||
			el instanceof HTMLElement ||
			el instanceof HTMLInputElement
		)
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
		return this.element.getBoundingClientRect()
	}

	get parent(): ProxyNode | undefined {
		const parent = this.element.parentElement;

		if (parent != null)
			return new ProxyNode(parent);
	}

	get value(): string {
		if (this.element instanceof HTMLInputElement)
			return this.element.value;

		return this.element.textContent ?? '';
	}

	set value(value: string) {
		if (this.element instanceof HTMLInputElement)
			this.element.value = value;

		else
			this.element.textContent = value;
	}

	/** @deprecated - removed in the next version */
	get wrapper(): this['ref'] {
		return this.ref;
	}

	ref(run: (arg0: this) => void): this {
		run(this);

		return this;
	}

	//#region //* Default Utils *//
	text(content: string): this {
		this.element.textContent = content;

		return this;
	}

	id(value: string): this {
		this.element.id = value;

		return this;
	}

	attr(attributes: { [attribute: string]: string | number; } = {}): this {
		if (typeof attributes != 'object')
			return this;

		for (const [key, value] of Object.entries(attributes))
			this.element.setAttribute(key, value + '');

		return this;
	}

	swap(node: this | HTMLElement): this {
		const newNode = ProxyNode.extractEl(node);

		this.element.replaceWith(newNode);
		this.element = newNode;

		return this;
	}

	/**
	 * Creates a cloned node
	 */
	clone(): ProxyNode {
		return new ProxyNode(
			this.element.cloneNode(true) as Element
		);
	}

	/**
	 * Clears inner content
	 */
	clear(): this {
		this.element.textContent = '';

		return this;
	}

	/**
	 * Checks if dom contains element
	 */
	exists(): boolean {
		return document.body.contains(this.element);
	}

	/**
	 * Returns a list of child proxy nodes
	 */
	getChildren(): Array<ProxyNode> {
		return Array.from(this.element.children).map(documentEl => new ProxyNode(documentEl));
	}

	/**
	 * 
	 * @param toReset 
	 * @returns 
	 * @deprecated - Possibly removed in the next version
	 */
	reset(...toReset: ('content' | 'style' | 'class')[]): this {
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
	class(...args: string[]): this {
		this.element.className = args.join(' ');

		return this;
	}

	hasClass(className: string): boolean {
		return this.element.classList.contains(className);
	}

	addClass(...args: string[]): this {
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

	removeClass(...args: string[]): this {
		for (const arg of args)
			if (arg.includes(' '))
				args.splice(args.indexOf(arg), 1, ...arg.split(' '));

		if (Array.isArray(args))
			this.element.classList.remove(...args);

		return this;
	}

	toggleClass(className: string, status: boolean = !this.hasClass(className)): this {
		status ? this.addClass(className) : this.removeClass(className);

		return this;
	}
	//#endregion //* Classes *//

	//#region //* Styles *//
	styles(styles: StyleDeclarationWithProps = {}): this {
		if (typeof styles != 'object')
			return this;

		if (this.element instanceof HTMLElement != true)
			return this;

		for (const [key, value] of Object.entries(styles)) {
			if (key === 'props') {
				for (const [propKey, propValue] of Object.entries(<{ [key: string]: string }>value)) {
					this.element.style.setProperty(`--${propKey}`, propValue);
				}
			}

			// @ts-ignore
			this.element.style[key] = value;
		}

		return this;
	}

	removeStyles(...styles: string[]): this {
		if (this.element instanceof HTMLElement != true)
			return this;

		for (const style of styles)
			this.element.style.removeProperty(style);

		return this;
	}
	//#endregion //* Styles *//

	private get safeEvents() {
		return this.nodeEvents ??= new Emitter();
	}

	//#region //* Listeners *//
	on(event: string, callback: Function): this {
		if (event === 'remove' || event === 'append') {
			if (this._observer == null)
				this._observer = nodeObservers.create(this);

			this._observer
				.events
				.on('append', () =>
					this.safeEvents.emit('append')
				)
				.on('remove', () => {
					this.safeEvents.emit('remove');
					this._observer?.kill();
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

	addListener(events: { [key: string]: { [listener: string]: Function; }; }): this {
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

	removeListener(key: any): this {
		for (const listener in this.listeners[key])
			this.element.removeEventListener(
				listener,
				this.listeners[key][listener]
			);


		delete this.listeners[key]

		return this;
	}
	//#endregion //* Listeners *//

	//#region //* Intervals *//
	/**
	 * 
	 * @deprecated - stop using this dumbass 
	 */
	interval(callback: Function, time: number = 1000, immediate: boolean = false): this {
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
	setContent(...content: any[]): this {
		return this.clear().append(...content);
	}

	append(...objs: (Extractable | false | string | Array<Extractable | false | string>)[]): this {
		if (objs.length < 1)
			return this;

		for (const el of objs)
			if (Array.isArray(el))
				objs.splice(
					objs.indexOf(el),
					1,
					...el
				);

		for (const item of objs) {
			if (
				item == false ||
				item == null ||
				Array.isArray(item)
			) continue;

			this.element.append(
				typeof item === 'string' ?
					item :
					ProxyNode.extractEl(item)
			);
		}

		return this;
	}

	appendTo(obj: Extractable | false): this {
		if (obj == false)
			return this;

		obj.append(
			ProxyNode.extractEl(this.element)
		);

		return this;
	}

	prependTo(obj: Extractable): this {
		if (obj == null)
			return this;

		obj.prepend(
			ProxyNode.extractEl(this.element)
		);

		return this;
	}

	prepend(...objs: Extractable[]): this {
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
			this.element.prepend(
				ProxyNode.extractEl(el)
			);


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

	setTabIndex(index: number): this {
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
		this.on(
			'wheel',
			(event: any) => {
				event.preventDefault();
				this.element.scrollLeft += event.deltaY;
			}
		);

		return this;
	}

	animate(
		styles: Array<StyleDeclaration>,
		options: number | (KeyframeAnimationOptions & DomAnimationOptions)
	) {
		const instance = this.element.animate(<Array<Keyframe>>styles, options);

		if (typeof options === 'object') {
			instance.onfinish = (ev) => {
				if (options.save === true) {
					this.styles(
						styles[styles.length - 1]
					);
				}

				options.onFinish?.bind(instance)?.(ev);
			}

			options.onCancel && (instance.oncancel = options.onCancel);
			options.onRemove && (instance.onremove = options.onRemove);
			options.animationReference?.(instance);
		}

		return this;
	}
	//#endregion //* Random *//
}

export function generateProxyNode(el: HTMLElement | Element): ProxyNode {
	return new ProxyNode(el);
}

type newNode = { [elementTag: string]: ProxyNode; };

export const newNode: newNode = new Proxy({}, {
	get(target: object, elementTag: string): ProxyNode {
		return generateProxyNode(
			document.createElement(elementTag)
		);
	}
});

export function qs(
	selector: string,
	element: HTMLElement | Document = document
): ProxyNode | null {
	const currentNode = element.querySelector(selector);

	return currentNode ? new ProxyNode(currentNode) : null;
}

export function qsAll(
	selector: string,
	element: HTMLElement | Document = document
): Array<ProxyNode> {
	return Array
		.from(element.querySelectorAll(selector))
		.map(
			$ => $ ? new ProxyNode($) : newNode.div
		);
}

export default {
	newNode,
	qs,
	generateProxyNode,
	fetch
};