import type { ProxyNode } from "./proxynode.js";
import type { VNode } from "./vnode.js";
export type StyleDeclaration = Partial<Record<keyof CSSStyleDeclaration, string | number>> & object;
export type StyleDeclarationWithProps = StyleDeclaration & {
    props?: Record<string, string | number>;
};
export type VNodeStyleDeclarationWithProps = StyleDeclaration & {
    variables?: Record<string, string | number>;
};
export interface DomAnimationOptionsOld {
    save?: boolean;
    onFinish?: (this: Animation, ev?: Event) => any;
    onCancel?: (this: Animation, ev?: Event) => any;
    onRemove?: (this: Animation, ev?: Event) => any;
    animationReference?: (param0: Animation) => void;
}
export interface VNodeAnimationOptions {
    save?: boolean;
    animation: KeyframeAnimationOptions;
}
type Kuh = Record<string, ReturnType<Function["bind"]>>;
export type VNodeListeners = Record<string, Kuh>;
export type VN_Extractable = HTMLElement | VNode | ProxyNode;
export type VNodeAppendable = (VN_Extractable | false | string)[];
export {};
