interface AnimationMethods {
	onFinish?: Function;
	onCancel?: Function;
	onRemove?: Function;
}

export type StyleDeclaration = Partial<Record<keyof CSSStyleDeclaration, string | number>>

export type StyleDeclarationWithProps = StyleDeclaration & {
	props?: {
		[propName: string]: string | number
	};
};

export interface DomAnimationOptions {
	save?: boolean;
	onFinish?: ((this: Animation, ev?: Event) => any);
	onCancel?: ((this: Animation, ev?: Event) => any);
	onRemove?: ((this: Animation, ev?: Event) => any);
	animationReference?: (param0: Animation) => void
}