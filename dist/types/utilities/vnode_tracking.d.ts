import { VNode } from "../vnode.js";
declare class VNodeStateObserver {
    private inDom;
    private tracked_in_dom;
    observer: MutationObserver;
    constructor();
}
export declare class StateTracking {
    static flag: string;
    static ref_prop: string;
    static initNodeTracking(node: VNode): void;
    static init(options?: {
        all?: boolean;
    }): {
        observer: VNodeStateObserver;
        destroy(): void;
    };
    static filterQuery(list: any[]): VNode[];
    static query(): VNode[];
}
declare class VNodeSizeObserver {
    private inDom;
    private tracked_in_dom;
    observer: ResizeObserver;
    constructor();
}
export declare class SizeTracking {
    static flag: string;
    static ref_prop: string;
    static sizes: WeakMap<HTMLElement, {
        width: number;
        height: number;
    }>;
    static initNodeTracking(node: VNode): void;
    static init(options?: {
        all?: boolean;
    }): {
        observer: VNodeSizeObserver;
        destroy(): void;
    };
    static filterQuery(list: any[]): VNode[];
    static query(): VNode[];
}
export {};
