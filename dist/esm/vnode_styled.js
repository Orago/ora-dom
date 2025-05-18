import { VNode } from "./vnode";
export class StyledVNode extends VNode {
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
