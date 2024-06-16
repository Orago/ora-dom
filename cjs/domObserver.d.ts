import { ProxyNode } from './dom.js';
export interface Options {
    childList?: true;
    subtree?: true;
    killOnRemove?: boolean;
}
export interface Methods {
    onAdd?: Function;
    onRemove?: Function;
}
export declare class ObserverGroup {
    alive: Map<any, any>;
    constructor();
    create(node: ProxyNode, methods: Methods, options?: Options): void;
}
