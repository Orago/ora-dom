import type { ProxyNode } from "./proxynode.js";
import type { VNode } from "./vnode.js";

interface AnimationMethods {
	onFinish?: Function;
	onCancel?: Function;
	onRemove?: Function;
}

export type StyleDeclaration = Partial<
	Record<keyof CSSStyleDeclaration, string | number>
> &
	object;

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
	/**
	 * Apply last styles at end of animation
	 */
	save?: boolean;

	/**
	 *
	 */

	animation: KeyframeAnimationOptions;
}
/**
 * Record<listener: string, ReturnType<Function["bind"]>>
 */
type Kuh = Record<string, ReturnType<Function["bind"]>>;

/**
 * Record<key: string, Kuh>
 */
export type VNodeListeners = Record<string, Kuh>;

export type VNodeExtractable = HTMLElement | VNode | ProxyNode;

export type VNodeAppendable = (
	| VNodeExtractable
	| false
	| string
	| (VNodeExtractable | false | string)[]
)[];

export type VNodeElementName = keyof HTMLElementTagNameMap | (string & {});