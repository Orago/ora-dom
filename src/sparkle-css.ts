import { makeCallableClass } from "@orago/lib";

function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

type SparkleStyleNames = keyof CSSStyleDeclaration | `--${string}`;
type StyleOptions = Partial<Record<SparkleStyleNames, string>>;

interface SparkleMediaQueryOptions {
	min_width?: `${number}${"px" | "em"}` | (string & {});
	max_width?: `${number}${"px" | "em"}` | (string & {});
	min_height?: `${number}${"px" | "em"}` | (string & {});
	max_height?: `${number}${"px" | "em"}` | (string & {});
}

type SparkleExtendOption = Record<`&:${string}` | string, StyleOptions>;
type MediaOption = {
	if: SparkleMediaQueryOptions;
	styles: StyleOptions & { extend?: SparkleExtendOption };
};

type SparkleStyleOptions = StyleOptions & {
	extend?: SparkleExtendOption;
	media?: MediaOption[];
};
type AnimationPosition = `${number}%` | "from" | "to";

type AnimationOptions = [
	position: AnimationPosition | AnimationPosition[],
	contents: Partial<Record<SparkleStyleNames, string>>
][];

class SparkleStyle {
	static Media = class SparkleMedia {
		static createString(
			options: SparkleMediaQueryOptions,
			styles: [name: string, options: MediaOption["styles"]][],
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
					return SparkleStyle.toString(name, options, indent + 1);
				})
				.join("\n");

			return `@media ${parts_string} {${inner_styles}\n${indent_string}}`;
		}

		static toString(
			style_name: string,
			options: MediaOption[],
			indent: number = 0
		) {
			let s: string[] = [];

			for (const m of options) {
				const { ...other_styles } = m.styles;
				const str = SparkleStyle.Media.createString(
					m.if,
					[[style_name, other_styles]],
					indent
				);

				s.push(str);
			}

			return s.join("🐱🐱🐱");
		}
	};

	static parseContents(data: Partial<Record<SparkleStyleNames, string>>) {
		return Object.entries(data).map(
			([name, value]) => `${camelToKebab(name)}: ${value}`
		);
	}

	static resolve(name: string, data: StyleOptions) {
		const formatted_styles = SparkleStyle.parseContents(data).join("; ");
		return `${name} { ${formatted_styles} }`;
	}

	static parseExtend(style_name: string, extend: SparkleExtendOption) {
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
			return SparkleStyle.resolve(style_name_out, value);
		});
	}

	static toString(
		style_name: string,
		data: SparkleStyleOptions,
		indent: number = 0
	) {
		const { extend, media: media_list, ...other_styles } = data;
		const indent_string = "\t".repeat(indent);
		const line_seperator = `\n${indent_string}`;
		let strings: string[] = [];
		strings.push(SparkleStyle.resolve(style_name, other_styles));

		if (media_list != undefined) {
			const k = SparkleStyle.Media.toString(
				style_name,
				media_list,
				indent
			);
			strings.push(k);
		}
		if (extend != undefined) {
			strings.push(...SparkleStyle.parseExtend(style_name, extend));
		}

		return (
			(indent > 0 ? line_seperator : "") +
			strings.join(" " + line_seperator)
		);
	}

	constructor(public name: string, public data: SparkleStyleOptions) {}

	toString() {
		return SparkleStyle.toString(this.name, this.data);
	}
}

class SparkleClass extends SparkleStyle {
	constructor(public classname: string, options: SparkleStyleOptions) {
		super(`.${classname}`, options);
	}

	getName() {
		return this.classname;
	}
}

class SparkleAnimation {
	static toString(name: string, options: AnimationOptions) {
		const formatted_styles = options.map(([position, data]) => {
			const dat = SparkleStyle.parseContents(data);

			let range = Array.isArray(position)
				? position.map(camelToKebab).join("; ")
				: camelToKebab(position);

			return `${range} { ${dat.join(";")} }`;
		});

		return `@keyframes ${name} { ${formatted_styles.join(" ")} }`;
	}
	constructor(public name: string, public options: AnimationOptions) {}

	toString() {
		return SparkleAnimation.toString(this.name, this.options);
	}
}

class SparkleDepot<Instance extends { name: string }, OptionType> {
	private counter = 0;
	private readonly indexes: Map<Instance, number> = new Map();
	public readonly list: Map<string, Instance> = new Map();

	constructor(
		public manager: SparkleGroup,
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
			case 1:
				this.insert(args[0]);
				break;
			case 2:
				this.insert(this.generator(args[0], args[1]));
				break;
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

class StyleManager extends SparkleDepot<SparkleStyle, SparkleStyleOptions> {
	constructor(manager: SparkleGroup) {
		super(manager, (name, options) => new SparkleStyle(name, options));
	}
}

class AnimationManager extends SparkleDepot<
	SparkleAnimation,
	AnimationOptions
> {
	constructor(manager: SparkleGroup) {
		super(manager, (name, options) => new SparkleAnimation(name, options));
	}
}

class SparkleGroup {
	public readonly styles = makeCallableClass(StyleManager, this);
	public readonly animations = makeCallableClass(AnimationManager, this);

	public readonly raw_chunks: string[] = [];

	public insert(...instances: (SparkleStyle | SparkleAnimation)[]): this {
		for (const instance of instances) {
			if (instance instanceof SparkleStyle) {
				this.styles.add(instance);
			} else if (instance instanceof SparkleAnimation) {
				this.animations.add(instance);
			}
		}
		return this;
	}

	public css(value: TemplateStringsArray) {
		this.raw_chunks.push(value[0].trim());
	}

	public getUsageCount() {
		function selectAndCount(e: SparkleStyle) {
			return document.querySelectorAll(e.name).length;
		}

		return Array.from(this.styles.list.values())
			.map(selectAndCount)
			.reduce((accumulator, current) => accumulator + current, 0);
	}

	public use(plugins: ((node: this) => void)[]): this {
		for (const plugin of plugins) {
			plugin(this);
		}

		return this;
	}

	public getChunks(): {
		styles: string[];
		animations: string[];
		raw: string[];
	} {
		const styles = Array.from(this.styles.list.values()).map((instance) =>
			instance.toString()
		);

		const animations = Array.from(this.animations.list.values()).map(
			(instance) => instance.toString()
		);

		return {
			styles,
			animations,
			raw: this.raw_chunks,
		};
	}
}

class Sparkle {
	public static Group = SparkleGroup;

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
		data: SparkleStyleOptions
	): SparkleStyle {
		return new SparkleStyle(name, data);
	}

	public static createClass(
		name: string,
		data: SparkleStyleOptions
	): SparkleClass {
		return new SparkleClass(name, data);
	}

	public static createAnimation(
		name: string,
		options: AnimationOptions
	): SparkleAnimation {
		return new SparkleAnimation(name, options);
	}

	public element: HTMLStyleElement = document.createElement("style");
	public readonly groups: Set<SparkleGroup> = new Set();

	public chunks: string[] = [];

	public attatched?: HTMLElement;

	constructor() {}

	public newGroup(): SparkleGroup {
		const group = new SparkleGroup();
		this.groups.add(group);
		return group;
	}

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

	public insert(...instances: SparkleGroup[]): this {
		for (const instance of instances) {
			this.groups.add(instance);
		}

		return this;
	}

	public build(): this {
		const chunks_content: {
			styles: string[];
			animations: string[];
			raw: string[];
		} = {
			styles: [],
			animations: [],
			raw: [],
		};

		for (const group of this.groups) {
			const chunks = group.getChunks();
			chunks_content.styles.push(...chunks.styles);
			chunks_content.animations.push(...chunks.animations);
			chunks_content.raw.push(...chunks.raw);
		}

		const styles_string: string = chunks_content.styles.join(" ");
		const animations_string: string = chunks_content.animations.join(" ");
		const raw_string: string = chunks_content.raw.join(" ");

		const result: string = [
			styles_string,
			animations_string,
			raw_string,
		].join(" ");
		this.element.innerHTML = result;
		return this;
	}

	public getUsageCount() {
		let count: number = 0;

		for (const group of this.groups) {
			count += group.getUsageCount();
		}

		return count;
	}

	public ref(run: (arg0: this) => void): this {
		run(this);
		return this;
	}
}

export {
	type SparkleStyleNames,
	type StyleOptions,
	type SparkleMediaQueryOptions,
	type SparkleStyleOptions,
	type AnimationPosition,
	type AnimationOptions,
	Sparkle,
	SparkleGroup,
	SparkleStyle,
	SparkleClass,
	SparkleAnimation,
};
