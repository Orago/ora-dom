import { v4 as uuidV4 } from 'uuid';
import Emitter from '@orago/lib/emitter';
export class ObservableNode {
    constructor(group, node) {
        this.group = group;
        this.node = node;
        this.events = new Emitter();
        this.id = uuidV4();
        this.killOnRemove = false;
        this.node = node;
        this.inDom = document.body.contains(this.node.element);
        this.group = group;
        this.group.alive.set(this.id, this);
    }
    handleMutation() {
        if (document.body.contains(this.node.element)) {
            if (this.inDom != true)
                this.events.emit('append', this.node);
            this.inDom = true;
        }
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
