import type {
	VNodeChildList,
	VNodeExtractable,
	VNodeStyleDeclarationWithProps,
	VNodeWhereOptions,
} from "./interfaces.js";
import type { ProxyNode } from "./proxynode.js";
import type { VNode } from "./vnode.js";

type StaticMethodKeys<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type VNUtilityParam<
	K extends StaticMethodKeys<typeof VNodeUtilities>,
	P extends number
> = Parameters<(typeof VNodeUtilities)[K]>[P];

export class VNodeUtilities {
	public static flattenContents(
		contents: VNodeChildList
	): (VNodeExtractable | string)[] {
		return contents
			.flat()
			.filter((content) => content != undefined && content != false)
			.map((a) => {
				let t = typeof a;
				// convert number or bool types to string
				a = "number" == t || "boolean" == t ? String(a) : a;
				// // convert strings to text nodes
				// a = typeof a == "string" ? document.createTextNode(a) : a;
				return a as VNodeExtractable | string;
			});
	}

	public static flattenElements(contents: VNodeChildList): HTMLElement[] {
		return contents.map((a) => {
			let t = typeof a;

			// convert number or bool types to string
			a = "number" == t || "boolean" == t ? String(a) : a;
			a = "string" == typeof a ? document.createTextNode(a) : a;

			return a as HTMLElement;
		});
	}

	public static injectItems<T extends HTMLElement>(
		node: T,
		direction: "append" | "prepend" = "append",
		objs: VNodeChildList
	): void {
		if (objs.length < 1) {
			return;
		}
		const items = this.flattenContents(objs);

		for (const item of items) {
			const extracted =
				typeof item === "string" ? item : VNodeExtractEl(item);

			if (direction === "append") {
				node.append(extracted);
			} else {
				node.prepend(extracted);
			}
		}
	}

	public static setAttributes<T extends HTMLElement>(
		element: T,
		attributes: Record<string, string | number | undefined> = {}
	): void {
		if (typeof attributes == "object" && attributes !== null) {
			for (let [key, value] of Object.entries(attributes)) {
				if (value == null) continue;
				key = VNodeUtilities.formatAttributeName("kebab", key);
				element.setAttribute(key, String(value));
			}
		}
	}

	public static setStyles(
		element: HTMLElement,
		styles: VNodeStyleDeclarationWithProps = {}
	): void {
		if (
			typeof styles != "object" ||
			element instanceof HTMLElement != true
		) {
			return;
		}

		for (const [key, value] of Object.entries(styles)) {
			if (key === "variables") {
				for (const [prop_key, prop_value] of Object.entries(
					value as Record<string, string>
				)) {
					element.style.setProperty(`--${prop_key}`, prop_value);
				}
			}

			if (value == undefined) {
				continue;
			}

			element.style[key as any] = `${value}`;
		}
	}

	public static removeStyles(element: HTMLElement, styles: string[]): void {
		if (element instanceof HTMLElement) {
			for (const style of styles) {
				element.style.removeProperty(style);
			}
		}
	}

	public static formatAttributeName(as: "kebab" | "camel", text: string) {
		switch (as) {
			case "camel":
				return text
					.split("-")
					.map(
						(e, i) =>
							(i > 0
								? e.slice(0, 1).toUpperCase()
								: e.slice(0, 1).toLowerCase()) +
							e.slice(1).toLowerCase()
					)
					.join("");
			case "kebab":
				return text
					.replace(/([A-Z]{2,})/g, (match) =>
						match.split("").join("-")
					)
					.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
					.toLowerCase();
		}
	}

		public static elementTextFind(
				options: Exclude<VNodeWhereOptions["text"], undefined>,
				dict: [string, any][]
			) {
				return dict.filter(([text]) => {
					if (options.lowercase == true) {
						text = String(text).toLowerCase();
					}
					if (options.uppercase == true) {
						text = String(text).toUpperCase();
					}
	
					if (typeof options.find == "function") {
						return options.find(text) == true;
					} else {
						return text === options.find;
					}
				});
			}
	

	public static whereString(options: VNodeWhereOptions): string {
			const class_str = options.classes?.map((e) => "." + e)?.join("");
			const attr_str = Object.entries(options.attributes ?? {}).map(
				([k, v]) => {
					k = VNodeUtilities.formatAttributeName("kebab", k);
					return `[${k}='${v}']`;
				}
			);
			const data_str = Object.entries(options.data ?? {}).map(
				([k, v]) => {
					k = VNodeUtilities.formatAttributeName("kebab", k);
					return `[data-${k}='${v}']`;
				}
			);
			return `${options.id ?? ""}${class_str}${attr_str}${data_str}`;
		}
	
}
export class VNodeUtilityClass<T extends VNode = VNode> {
	constructor(public node: T) {}

	public nest(run: (arg0: this) => void): this["node"] {
		run(this);
		return this.node;
	}
}

export function VNodeExtractEl(node: VNodeExtractable): HTMLElement {
	if ("element" in node) {
		return node.element;
	}

	return node;
}


