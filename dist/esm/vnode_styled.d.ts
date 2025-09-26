import { ObserverTracking } from "./dom_observer.js";
import type { VNodeExtractable } from "./interfaces.js";
import type { JCSS } from "./jss.js";
import { VNode } from "./vnode.js";
export declare class StyledVNode extends VNode {
    private instance;
    constructor(type: keyof HTMLElementTagNameMap, instance: JCSS);
    appendTo(obj: VNodeExtractable | false, direction?: "append" | "prepend"): this;
    remove(): this;
}
export declare class JCSSTracker {
    private instance;
    observer: ObserverTracking;
    callback: () => void;
    constructor(instance: JCSS, observer?: ObserverTracking);
    enable(): void;
    disable(): void;
}
