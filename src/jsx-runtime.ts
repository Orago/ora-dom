// polyfill for jsx
import { VNProperties } from "./vnode_utilities.js";
import { VNode } from "./vnode.js";
import { vn, VNFragment } from "./vnode_functional.js";
import { VNodeUtilities } from "./vnode_utilities.js";
export class VNX extends VNode {
	constructor(type: keyof HTMLElementTagNameMap, props: JsxProps) {
		super(type);

		VNodeUtilities.applyVNProps(this, props);
	}
}

declare global {
	namespace JSX {
		export type Element = ReturnType<
			typeof import("./vnode_functional.js").vn
		>;
		export type IntrinsicElements = {
			[K in keyof HTMLElementTagNameMap]: import("./vnode_utilities.ts").VNProperties<K>;
		};
	}
}

type JsxProps = (VNProperties<any> & { children?: any[] }) | null | undefined;
export function jsx(type: any, props: JsxProps, key: any) {
	if (typeof type === "function") {
		if (props?.children != undefined) {
			props.children = VNodeUtilities.flattenElements([
				props.children ?? [],
			]);
		}
		return new type(props);
	}

	return vn(
		type,
		props,
		VNodeUtilities.flattenElements([props?.children ?? []])
	);
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
