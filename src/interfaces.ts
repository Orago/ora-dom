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

/**
 * Of which an html element can be resolved
 */
export type VNodeExtractable = HTMLElement | VNode | ProxyNode;
export type VNodeChild =
	| Node
	| string
	| number
	| boolean
	| null
	| undefined
	| VNodeExtractable;
export type VNodeChildList = (VNodeChild | VNodeChild[])[];

export type VNodeElementName = keyof HTMLElementTagNameMap | (string & {});

export type ResolveElement<Input extends VNodeElementName | VNodeExtractable> =
	Input extends keyof HTMLElementTagNameMap
		? HTMLElementTagNameMap[Input]
		: Input extends HTMLElement
		? Input
		: Input extends VNode
		? Input["element"]
		: HTMLElement;


export interface VNodeWhereOptions {
	id?: string;
	classes?: string[];
	data?: Record<string, string>;
	attributes?: Record<string, string>;

	text?: {
		lowercase?: boolean;
		uppercase?: boolean;
		find: string | ((text: string) => boolean);
	};
}