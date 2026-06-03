// polyfill for jsx
import { VNode } from "./vnode.js";
import {
	applyVNProps,
	vn,
	VNFragment,
	VNProperties,
} from "./vnode_functional.js";

export class VNX extends VNode {
	constructor(type: keyof HTMLElementTagNameMap, props: JsxProps) {
		super(type);

		applyVNProps(this, props);
	}
}

declare global {
	namespace JSX {
		export type Element = ReturnType<
			typeof import("./vnode_functional.js").vn
		>;
		export type IntrinsicElements = {
			[K in keyof HTMLElementTagNameMap]: import("./vnode_functional.ts").VNProperties<K>;
		};
	}
}

type JsxProps = (VNProperties<any> & { children?: any[] }) | null | undefined;
export function jsx(type: any, props: JsxProps, key: any) {
	if (typeof type === "function") {
		return new type(props);
	}

	return vn(type, props, ...(props?.children ?? []));
}

export const jsxs = jsx;
export const Fragment = VNFragment;

export const jsxDEV = (
	type: any,
	props: JsxProps,
	key: any,
	isStatic: any,
	source: any,
	self: any
) => {
	return jsx(type, props, key);
};
