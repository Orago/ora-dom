"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObserverGroup = exports.ObservableNode = void 0;
const uuid_1 = require("uuid");
const emitter_1 = __importDefault(require("@orago/lib/emitter"));
class ObservableNode {
    constructor(group, node) {
        this.group = group;
        this.node = node;
        this.events = new emitter_1.default();
        this.id = (0, uuid_1.v4)();
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
exports.ObservableNode = ObservableNode;
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
exports.ObserverGroup = ObserverGroup;
