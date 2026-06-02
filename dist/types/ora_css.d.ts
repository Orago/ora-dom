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
    styles: StyleOptions & {
        extend?: OraCssExtendOption;
    };
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
export declare class OraCssStyle {
    name: string;
    data: OraCssStyleOptions;
    static Media: {
        new (): {};
        createString(options: OraCssMediaQueryOptions, styles: [name: string, options: Partial<Record<OraCssStyleNames, string>> & {
            extend?: OraCssExtendOption | undefined;
        }][], indent?: number): string;
        toString(style_name: string, options: OraCssMediaOption[], indent?: number): string;
    };
    static parseContents(data: Partial<Record<OraCssStyleNames, string>>): string[];
    static resolve(name: string, data: StyleOptions): string;
    static parseExtend(style_name: string, extend: OraCssExtendOption): string[];
    static toString(style_name: string, data: OraCssStyleOptions, indent?: number): string;
    constructor(name: string, data: OraCssStyleOptions);
    toString(): string;
}
export declare class OraCssClass extends OraCssStyle {
    classname: string;
    constructor(classname: string, options: OraCssStyleOptions);
    getName(): string;
}
export declare class OraCssAnimation {
    name: string;
    options: OraCssAnimationOptions;
    static toString(name: string, options: OraCssAnimationOptions): string;
    constructor(name: string, options: OraCssAnimationOptions);
    toString(): string;
}
declare class OraCssDepot<Instance extends {
    name: string;
}, OptionType> {
    manager: OraCss;
    generator: (name: string, options: OptionType) => Instance;
    private counter;
    private readonly indexes;
    readonly list: Map<string, Instance>;
    constructor(manager: OraCss, generator: (name: string, options: OptionType) => Instance);
    call(run: (arg0: this) => void): this["manager"];
    has(name: string): boolean;
    insert(instance: Instance): void;
    add(name: string, style: OptionType): this;
    add(instance: Instance): this;
    remove(input: string): boolean;
    remove(input: Instance): boolean;
}
declare class StyleManager extends OraCssDepot<OraCssStyle, OraCssStyleOptions> {
    constructor(manager: OraCss);
}
declare class AnimationManager extends OraCssDepot<OraCssAnimation, OraCssAnimationOptions> {
    constructor(manager: OraCss);
}
export declare class OraCss {
    static readonly ExtendStyle: {
        new (): {};
        classname(name: string): string;
    };
    static createPluginStyle(callback: (manager: StyleManager) => void): (manager: StyleManager) => void;
    static createPluginAnimation(callback: (manager: StyleManager) => void): (manager: StyleManager) => void;
    static createStyle(name: string, data: OraCssStyleOptions): OraCssStyle;
    static createClass(name: string, data: OraCssStyleOptions): OraCssClass;
    static createAnimation(name: string, options: OraCssAnimationOptions): OraCssAnimation;
    element: HTMLStyleElement;
    readonly styles: ((run: (arg0: StyleManager) => void) => OraCss) & StyleManager;
    readonly animations: ((run: (arg0: AnimationManager) => void) => OraCss) & AnimationManager;
    attatched?: HTMLElement;
    /**
     * inserts stylesheet into the dom onto element then stores reference
     */
    attach(element?: HTMLElement): this;
    /**
     * removes stylesheet from the DOM
     */
    detach(): this;
    insert(...instances: (OraCssStyle | OraCssAnimation)[]): this;
    build(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}
export {};
