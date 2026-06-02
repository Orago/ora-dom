import { makeCallableClass } from "@orago/lib";

function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export type OraCssStyleNames = keyof CSSStyleDeclaration | `--${string}`;
export type StyleOptions = Partial<Record<OraCssStyleNames, string>>;

export interface OraCssMediaQueryOptions {
	min_width?: `${number}${"px" | "em"}` | (string & {});
	max_width?: `${number}${"px" | "em"}` | (string & {});
	min_height?: `${number}${"px" | "em"}` | (string & {});
	max_height?: `${number}${"px" | "em"}` | (string & {});
}

type OraCssExtendOption = Record<`&:${string}` | string, StyleOptions>;
type OraCssMediaOption = {
	if: OraCssMediaQueryOptions;
	styles: StyleOptions & { extend?: OraCssExtendOption };
};
export type OraCssStyleOptions = StyleOptions & {
	extend?: OraCssExtendOption;
	media?: OraCssMediaOption[];
};
export type AnimationPosition = `${number}%` | "from" | "to";

export type OraCssAnimationOptions = [
	position: AnimationPosition | AnimationPosition[],
	contents: Partial<Record<OraCssStyleNames, string>>
][];

export class OraCssStyle {
	static Media = class OraCssMedia {
		static createString(
			options: OraCssMediaQueryOptions,
			styles: [name: string, options: OraCssMediaOption["styles"]][],
			indent: number = 0
		): string {
			let indent_string = "\t".repeat(indent);
			let parts: string[] = [];

			if (options.min_width) {
				parts.push(`(min-width: ${options.min_width})`);
			}
			if (options.max_width) {
				parts.push(`(max-width: ${options.max_width})`);
			}
			if (options.min_height) {
				parts.push(`(min-height: ${options.min_height})`);
			}
			if (options.max_height) {
				parts.push(`(max-height: ${options.max_height})`);
			}
			const parts_string = parts.join(" and ");
			const inner_styles = styles
				.map(([name, options]) => {
					return OraCssStyle.toString(name, options, indent + 1);
				})
				.join("\n");

			return `@media ${parts_string} {${inner_styles}\n${indent_string}}`;
		}

		static toString(
			style_name: string,
			options: OraCssMediaOption[],
			indent: number = 0
		) {
			let s: string[] = [];

			for (const m of options) {
				const { ...other_styles } = m.styles;
				const str = OraCssStyle.Media.createString(
					m.if,
					[[style_name, other_styles]],
					indent
				);

				s.push(str);
			}

			return s.join("🐱🐱🐱");
		}
	};

	static parseContents(data: Partial<Record<OraCssStyleNames, string>>) {
		return Object.entries(data).map(
			([name, value]) => `${camelToKebab(name)}: ${value}`
		);
	}

	static resolve(name: string, data: StyleOptions) {
		const formatted_styles = OraCssStyle.parseContents(data).join("; ");
		return `${name} { ${formatted_styles} }`;
	}

	static parseExtend(style_name: string, extend: OraCssExtendOption) {
		return Object.entries(extend).map(([key, value]) => {
			let style_name_out: string;
			if (key.includes("&")) {
				if (key.startsWith("&")) {
					key = key.slice(1);
				}
				style_name_out = style_name + key.replace(/&/g, style_name);
			} else {
				style_name_out = style_name + key;
			}
			return OraCssStyle.resolve(style_name_out, value);
		});
	}

	static toString(
		style_name: string,
		data: OraCssStyleOptions,
		indent: number = 0
	) {
		const { extend, media: media_list, ...other_styles } = data;
		const indent_string = "\t".repeat(indent);
		const line_seperator = `\n${indent_string}`;
		let strings: string[] = [];
		strings.push(OraCssStyle.resolve(style_name, other_styles));

		if (media_list != undefined) {
			const k = OraCssStyle.Media.toString(
				style_name,
				media_list,
				indent
			);
			strings.push(k);
		}
		if (extend != undefined) {
			strings.push(...OraCssStyle.parseExtend(style_name, extend));
		}

		return (
			(indent > 0 ? line_seperator : "") +
			strings.join(" " + line_seperator)
		);
	}

	constructor(public name: string, public data: OraCssStyleOptions) {}

	toString() {
		return OraCssStyle.toString(this.name, this.data);
	}
}

export class OraCssClass extends OraCssStyle {
	constructor(public classname: string, options: OraCssStyleOptions) {
		super(`.${classname}`, options);
	}

	getName() {
		return this.classname;
	}
}

export class OraCssAnimation {
	static toString(name: string, options: OraCssAnimationOptions) {
		const formatted_styles = options.map(([position, data]) => {
			const dat = OraCssStyle.parseContents(data);

			let range = Array.isArray(position)
				? position.map(camelToKebab).join("; ")
				: camelToKebab(position);

			return `${range} { ${dat.join(";")} }`;
		});

		return `@keyframes ${name} { ${formatted_styles.join(" ")} }`;
	}
	constructor(public name: string, public options: OraCssAnimationOptions) {}

	toString() {
		return OraCssAnimation.toString(this.name, this.options);
	}
}

class OraCssDepot<Instance extends { name: string }, OptionType> {
	private counter = 0;
	private readonly indexes: Map<Instance, number> = new Map();
	public readonly list: Map<string, Instance> = new Map();

	constructor(
		public manager: OraCss,
		public generator: (name: string, options: OptionType) => Instance
	) {}

	public call(run: (arg0: this) => void): this["manager"] {
		run(this);
		return this.manager;
	}

	public has(name: string) {
		return this.list.has(name);
	}

	public insert(instance: Instance) {
		const index = this.counter++;
		this.list.set(instance.name, instance);
		this.indexes.set(instance, index);
	}

	public add(name: string, style: OptionType): this;
	public add(instance: Instance): this;
	public add(...args: any[]): this {
		switch (arguments.length) {
			case 1: {
				this.insert(args[0]);
				break;
			}
			case 2: {
				this.insert(this.generator(args[0], args[1]));
				break;
			}
		}

		return this;
	}

	public remove(input: string): boolean;
	public remove(input: Instance): boolean;
	public remove(input: string | Instance): boolean {
		if (typeof input == "string") {
			const found = this.list.get(input);
			if (found == null) {
				return false;
			} else {
				// cycles back to remove instanced version
				return this.remove(found);
			}
		} else {
			const index = this.indexes.get(input);

			if (index == null) {
				return false;
			} else {
				this.list.delete(input.name);
				this.indexes.delete(input);
				return true;
			}
		}
	}
}

class StyleManager extends OraCssDepot<OraCssStyle, OraCssStyleOptions> {
	constructor(manager: OraCss) {
		super(manager, (name, options) => new OraCssStyle(name, options));
	}
}
class AnimationManager extends OraCssDepot<
	OraCssAnimation,
	OraCssAnimationOptions
> {
	constructor(manager: OraCss) {
		super(manager, (name, options) => new OraCssAnimation(name, options));
	}
}

export class OraCss {
	public static readonly ExtendStyle = class ExtendStyle {
		public static classname(name: string) {
			return ` .${name}`;
		}
	};
	public static createPluginStyle(callback: (manager: StyleManager) => void) {
		return callback;
	}
	public static createPluginAnimation(
		callback: (manager: StyleManager) => void
	) {
		return callback;
	}
	public static createStyle(
		name: string,
		data: OraCssStyleOptions
	): OraCssStyle {
		return new OraCssStyle(name, data);
	}

	public static createClass(
		name: string,
		data: OraCssStyleOptions
	): OraCssClass {
		return new OraCssClass(name, data);
	}

	public static createAnimation(
		name: string,
		options: OraCssAnimationOptions
	): OraCssAnimation {
		return new OraCssAnimation(name, options);
	}

	public element: HTMLStyleElement = document.createElement("style");
	public readonly styles = makeCallableClass(StyleManager, this);
	public readonly animations = makeCallableClass(AnimationManager, this);

	public attatched?: HTMLElement;

	/**
	 * inserts stylesheet into the dom onto element then stores reference
	 */
	public attach(element: HTMLElement = document.head) {
		if (element !== this.attatched) {
			if (this.attatched != undefined) {
				this.detach();
			}
			this.attatched = element;
			this.attatched.appendChild(this.element);
			this.build();
		}
		return this;
	}

	/**
	 * removes stylesheet from the DOM
	 */
	public detach() {
		this.element.remove();
		this.attatched = undefined;
		return this;
	}

	public insert(...instances: (OraCssStyle | OraCssAnimation)[]): this {
		for (const instance of instances) {
			if (instance instanceof OraCssStyle) {
				this.styles.add(instance);
			} else if (instance instanceof OraCssAnimation) {
				this.animations.add(instance);
			}
		}
		return this;
	}

	public build(): this {
		const classes_string: string = Array.from(this.styles.list.values())
			.map((instance) => instance.toString())
			.join("\n");

		const animations_string: string = Array.from(
			this.animations.list.values()
		)
			.map((instance) => instance.toString())
			.join("\n");

		const result: string = [classes_string, animations_string].join(" ");
		this.element.innerHTML = result;
		return this;
	}

	public getUsageCount() {
		function selectAndCount(e: OraCssStyle) {
			return document.querySelectorAll(e.name).length;
		}

		return Array.from(this.styles.list.values())
			.map(selectAndCount)
			.reduce((accumulator, current) => accumulator + current, 0);
	}

	public ref(run: (arg0: this) => void): this {
		run(this);
		return this;
	}
}
