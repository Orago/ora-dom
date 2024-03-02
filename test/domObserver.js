import { v4 as uuidV4 } from 'uuid';
import { ProxyNode } from './dom.js';

/**
 * @typedef {object} options
 * @property {true} [childList] -
 * @property {true} [subtree] -
 * @property {boolean} [killOnRemove] -
 */

/**
 * @typedef {object} methods
 * @property {Function} [onAdd] -
 * @property {Function} [onRemove] -
 */

class ObservableNode {
	parent;

	/**
	 * @param {ObserverGroup} parent 
	 * @param {ProxyNode} domNode 
	 * @param {methods} methods
	 * @param {options} [options]
	 */
	constructor(parent, domNode, methods, options) {
		if (typeof options != 'object') {
			options = {};
		}

		options.childList ??= true;
		options.subtree ??= true;
		options.killOnRemove ??= true;

		this.id = uuidV4();
		this.node = domNode;
		this.methods = methods;
		this.inDom = document.body.contains(this.node.element);
		this.options = options;

		this.parent = parent;
		this.parent.alive.set(this.id, this);
	}

	handleMutation() {
		// If it's in dom now but wasn't before
		if (document.body.contains(this.node.element)) {
			if (this.inDom != true && typeof this.methods.onAdd === 'function') {
				this.methods.onAdd(this.node);
			}

			this.inDom = true;
		} else if (this.inDom) { /* Was in dom but removed */
			this.handleRemove();
		}
	}

	handleRemove() {
		this.inDom = false;

		if (typeof this.methods.onRemove === 'function') {
			this.methods.onRemove(this.node);
		}

		if (this.options.killOnRemove == true) {
			this.parent.alive.delete(this.id);
		}
	}
}

export class ObserverGroup {
	alive = new Map();

	constructor() {
		const mainObserver = new MutationObserver(() => {
			for (const observer of this.alive.values()) {
				observer.handleMutation();
			}
		});

		mainObserver.observe(document.body, { childList: true, subtree: true });
	}

	/**
	 * 
	 * @param {ProxyNode} node 
	 * @param {methods} methods 
	 * @param {options} [options]
	 */
	create(node, methods, options) {

		new ObservableNode(this, node, methods, options);
	}
}