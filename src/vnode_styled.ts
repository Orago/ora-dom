import type { VN_Extractable } from "./interfaces";
import { JCSS } from "./jss";
import { VNode } from "./vnode";

export class StyledVNode extends VNode {
	constructor(type: keyof HTMLElementTagNameMap, private instance: JCSS) {
		super(type);

		this.instance = instance;
		this.instance.insert();
	}

	public appendTo(
		obj: VN_Extractable | false,
		direction?: "append" | "prepend"
	): this {
		super.appendTo(obj, direction);
		this.instance.insert();
		return this;
	}

	public remove(): this {
		super.remove();

		if (this.instance.getUsageCount() === 0) {
			this.instance.remove();
		}

		return this;
	}
}
