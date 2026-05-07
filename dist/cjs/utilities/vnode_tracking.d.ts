import { VNode } from "../vnode.js";
declare class VNodeObserver {
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
        observer: VNodeObserver;
        destroy(): void;
    };
    static filterQuery(list: any[]): VNode[];
    static query(): VNode[];
}
export {};
