"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledVNode = void 0;
const vnode_1 = require("./vnode");
class StyledVNode extends vnode_1.VNode {
    constructor(type, instance) {
        super(type);
        this.instance = instance;
        this.instance = instance;
        this.instance.insert();
    }
    appendTo(obj, direction) {
        super.appendTo(obj, direction);
        this.instance.insert();
        return this;
    }
    remove() {
        super.remove();
        if (this.instance.getUsageCount() === 0) {
            this.instance.remove();
        }
        return this;
    }
}
exports.StyledVNode = StyledVNode;
