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
    styles: StyleOptions & {
        extend?: SparkleExtendOption;
    };
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
declare class SparkleStyle {
    name: string;
    data: SparkleStyleOptions;
    static Media: {
        new (): {};
        createString(options: SparkleMediaQueryOptions, styles: [name: string, options: Partial<Record<SparkleStyleNames, string>> & {
            extend?: SparkleExtendOption | undefined;
        }][], indent?: number): string;
        toString(style_name: string, options: MediaOption[], indent?: number): string;
    };
    static parseContents(data: Partial<Record<SparkleStyleNames, string>>): string[];
    static resolve(name: string, data: StyleOptions): string;
    static parseExtend(style_name: string, extend: SparkleExtendOption): string[];
    static toString(style_name: string, data: SparkleStyleOptions, indent?: number): string;
    constructor(name: string, data: SparkleStyleOptions);
    toString(): string;
}
declare class SparkleClass extends SparkleStyle {
    classname: string;
    constructor(classname: string, options: SparkleStyleOptions);
    getName(): string;
}
declare class SparkleAnimation {
    name: string;
    options: AnimationOptions;
    static toString(name: string, options: AnimationOptions): string;
    constructor(name: string, options: AnimationOptions);
    toString(): string;
}
declare class SparkleDepot<Instance extends {
    name: string;
}, OptionType> {
    manager: SparkleGroup;
    generator: (name: string, options: OptionType) => Instance;
    private counter;
    private readonly indexes;
    readonly list: Map<string, Instance>;
    constructor(manager: SparkleGroup, generator: (name: string, options: OptionType) => Instance);
    call(run: (arg0: this) => void): this["manager"];
    has(name: string): boolean;
    insert(instance: Instance): void;
    add(name: string, style: OptionType): this;
    add(instance: Instance): this;
    remove(input: string): boolean;
    remove(input: Instance): boolean;
}
declare class StyleManager extends SparkleDepot<SparkleStyle, SparkleStyleOptions> {
    constructor(manager: SparkleGroup);
}
declare class AnimationManager extends SparkleDepot<SparkleAnimation, AnimationOptions> {
    constructor(manager: SparkleGroup);
}
declare class SparkleGroup {
    readonly styles: ((run: (arg0: StyleManager) => void) => SparkleGroup) & StyleManager;
    readonly animations: ((run: (arg0: AnimationManager) => void) => SparkleGroup) & AnimationManager;
    readonly raw_chunks: string[];
    insert(...instances: (SparkleStyle | SparkleAnimation)[]): this;
    css(value: TemplateStringsArray): void;
    getUsageCount(): number;
    use(plugins: ((node: this) => void)[]): this;
    getChunks(): {
        styles: string[];
        animations: string[];
        raw: string[];
    };
}
declare class Sparkle {
    static Group: typeof SparkleGroup;
    static readonly ExtendStyle: {
        new (): {};
        classname(name: string): string;
    };
    static createPluginStyle(callback: (manager: StyleManager) => void): (manager: StyleManager) => void;
    static createPluginAnimation(callback: (manager: StyleManager) => void): (manager: StyleManager) => void;
    static createStyle(name: string, data: SparkleStyleOptions): SparkleStyle;
    static createClass(name: string, data: SparkleStyleOptions): SparkleClass;
    static createAnimation(name: string, options: AnimationOptions): SparkleAnimation;
    element: HTMLStyleElement;
    readonly groups: Set<SparkleGroup>;
    chunks: string[];
    attatched?: HTMLElement;
    constructor();
    newGroup(): SparkleGroup;
    /**
     * inserts stylesheet into the dom onto element then stores reference
     */
    attach(element?: HTMLElement): this;
    /**
     * removes stylesheet from the DOM
     */
    detach(): this;
    insert(...instances: SparkleGroup[]): this;
    build(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}
export { type SparkleStyleNames, type StyleOptions, type SparkleMediaQueryOptions, type SparkleStyleOptions, type AnimationPosition, type AnimationOptions, Sparkle, SparkleGroup, SparkleStyle, SparkleClass, SparkleAnimation, };
