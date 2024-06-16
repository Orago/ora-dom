import { v4 as uuidV4 } from 'uuid';
class ObservableNode {
    constructor(parent, domNode, methods, options) {
        var _a, _b, _c;
        if (typeof options != 'object') {
            options = {};
        }
        (_a = options.childList) !== null && _a !== void 0 ? _a : (options.childList = true);
        (_b = options.subtree) !== null && _b !== void 0 ? _b : (options.subtree = true);
        (_c = options.killOnRemove) !== null && _c !== void 0 ? _c : (options.killOnRemove = true);
        this.id = uuidV4();
        this.node = domNode;
        this.methods = methods;
        this.inDom = document.body.contains(this.node.element);
        this.options = options;
        this.parent = parent;
        this.parent.alive.set(this.id, this);
    }
    handleMutation() {
        if (document.body.contains(this.node.element)) {
            if (this.inDom != true && typeof this.methods.onAdd === 'function') {
                this.methods.onAdd(this.node);
            }
            this.inDom = true;
        }
        else if (this.inDom) {
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
    constructor() {
        this.alive = new Map();
        const mainObserver = new MutationObserver(() => {
            for (const observer of this.alive.values()) {
                observer.handleMutation();
            }
        });
        mainObserver.observe(document.body, { childList: true, subtree: true });
    }
    create(node, methods, options) {
        new ObservableNode(this, node, methods, options);
    }
}
