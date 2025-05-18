import { ProxyNode } from "./proxynode.js";
import Emitter from "@orago/lib/emitter";
export declare class ObservableNode {
    group: ObserverGroup;
    private node;
    private static ids;
    events: Emitter<{
        append: (node: ProxyNode) => void;
        remove: (node: ProxyNode) => void;
    }>;
    id: number;
    inDom: boolean;
    killOnRemove: boolean;
    constructor(group: ObserverGroup, node: ProxyNode);
    handleMutation(): void;
    kill(): void;
}
export declare class ObserverGroup {
    alive: Map<any, any>;
    constructor();
    create(node: ProxyNode): ObservableNode;
}
export declare class ObserverTracking {
    static inDom(element: HTMLElement): boolean;
    static handle(element: HTMLElement): void;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    constructor();
}
