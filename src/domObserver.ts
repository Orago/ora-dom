import { v4 as uuidV4 } from 'uuid';
import { ProxyNode } from './dom.js';
import Emitter from '@orago/lib/emitter';

export class ObservableNode {
	events = new Emitter();
	id: string = uuidV4();
	inDom: boolean;
	killOnRemove: boolean = false;

	constructor(
		public group: ObserverGroup,
		private node: ProxyNode
	) {
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

export class ObserverGroup {
	alive = new Map();

	constructor() {
		const mainObserver = new MutationObserver(() => {
			for (const observer of this.alive.values())
				observer.handleMutation();
		});

		mainObserver.observe(document.body, { childList: true, subtree: true });
	}

	create(node: ProxyNode) {
		return new ObservableNode(this, node);
	}
}