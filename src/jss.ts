function camelToKebab(str: string): string {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

type Dec = keyof CSSStyleDeclaration | `--${string}`;

class JssClass {
	static parseContents(data: Partial<Record<Dec, string>>) {
		return Object.entries(data).map(
			([name, value]) => `${camelToKebab(name)}: ${value}`
		);
	}
	name: string;
	data: Partial<Record<Dec, string>>;

	constructor(name: JssClass["name"], data: JssClass["data"]) {
		this.name = name;
		this.data = data;
	}

	toString() {
		const formatted_styles = JssClass.parseContents(this.data);

		return `${this.name} { ${formatted_styles.join("; ")} }`;
	}
}

type AnimationPosition = `${number}%` | "from" | "to";

class JssAnimation {
	name: string;

	data: [
		position: AnimationPosition | AnimationPosition[],
		contents: Partial<Record<Dec, string>>
	][];

	constructor(name: JssAnimation["name"], data: JssAnimation["data"]) {
		this.name = name;
		this.data = data;
	}

	toString() {
		const formatted_styles = this.data.map(([position, data]) => {
			const dat = JssClass.parseContents(data);
			let range = Array.isArray(position)
				? position.map(camelToKebab).join(", ")
				: camelToKebab(position);

			return `${range} { ${dat} }`;
		});

		return `@keyframes ${this.name} { ${formatted_styles.join(" ")} }`;
	}
}

class JCSSClassManager {
	private counter = 0;
	private readonly indexes: Map<JssClass, number> = new Map();

	public readonly list: Map<JssClass["name"], JssClass> = new Map();

	constructor(public manager: JCSS) {
		this.manager = manager;
	}

	public has(name: JssClass["name"]) {
		return this.list.has(name);
	}

	public inject(instance: JssClass) {
		const index = this.counter++;

		this.list.set(instance.name, instance);
		this.indexes.set(instance, index);
	}

	public add(name: JssClass["name"], style: JssClass["data"]): this {
		this.inject(new JssClass(name, style));
		// this.element.sheet?.insertRule(cssClass.toString(), index);
		return this;
	}

	public remove(instance: JssClass) {
		const index = this.indexes.get(instance);

		if (index == null) {
			return false;
		} else {
			this.list.delete(instance.name);
			this.indexes.delete(instance);
			return true;
		}
	}

	public removeByName(name: JssClass["name"]): boolean {
		const found = this.list.get(name);

		if (found == null) {
			return false;
		} else {
			return this.remove(found);
		}
	}
}

class JCSSAnimationManager {
	private counter = 0;
	private readonly indexes: Map<JssAnimation, number> = new Map();

	public readonly list: Map<JssAnimation["name"], JssAnimation> = new Map();

	constructor(public manager: JCSS) {
		this.manager = manager;
	}

	public has(name: JssAnimation["name"]) {
		return this.list.has(name);
	}

	public inject(instance: JssAnimation) {
		const index = this.counter++;

		this.list.set(instance.name, instance);
		this.indexes.set(instance, index);
	}

	public add(name: JssAnimation["name"], style: JssAnimation["data"]): this {
		this.inject(new JssAnimation(name, style));
		// this.element.sheet?.insertRule(cssClass.toString(), index);
		return this;
	}

	public remove(instance: JssAnimation) {
		const index = this.indexes.get(instance);

		if (index == null) {
			return false;
		} else {
			this.list.delete(instance.name);
			this.indexes.delete(instance);
			return true;
		}
	}

	public removeByName(name: JssAnimation["name"]): boolean {
		const found = this.list.get(name);

		if (found == null) {
			return false;
		} else {
			return this.remove(found);
		}
	}
}

export class JCSS {
	element: HTMLStyleElement = document.createElement("style");
	styles = new JCSSClassManager(this);
	animations = new JCSSAnimationManager(this);

	inserted_state: boolean = false;

	insert() {
		if (this.inserted_state == false) {
			document.head.appendChild(this.element);
			this.inserted_state = document.head.contains(this.element);
		}

		return this;
	}

	remove() {
		this.element.remove();
		this.inserted_state = document.head.contains(this.element);

		return this;
	}

	rebuild(): this {
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

	getUsageCount() {
		function selectAndCount(e: JssClass) {
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
