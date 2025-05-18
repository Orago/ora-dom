import type { VN_Extractable } from "./interfaces";
import { JCSS } from "./jss";
import { VNode } from "./vnode";
export declare class StyledVNode extends VNode {
    private instance;
    constructor(type: keyof HTMLElementTagNameMap, instance: JCSS);
    appendTo(obj: VN_Extractable | false, direction?: "append" | "prepend"): this;
    remove(): this;
}
