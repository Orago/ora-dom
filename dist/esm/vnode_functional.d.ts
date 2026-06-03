import { VNodeChildList } from "./interfaces.js";
import { VNodeTagged } from "./vnode_utilities.js";
import type { VNProperties } from "./vnode_utilities.js";
/**
 * Virtual Node (Functional implementation)
 */
export declare function vn<T extends keyof HTMLElementTagNameMap>(tag: T, props?: VNProperties<T> | null, ...children: VNodeChildList): VNodeTagged<T>;
/**
 * Virtual Node - Fragment
 */
export declare function VNFragment(...children: VNodeChildList): DocumentFragment;
