import { ProxyNode } from './dom.js';
import Emitter from '@orago/lib/emitter';
export declare class ObservableNode {
    group: ObserverGroup;
    private node;
    events: Emitter;
    id: string;
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
