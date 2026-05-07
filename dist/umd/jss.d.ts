export type JSSStyleNames = keyof CSSStyleDeclaration | `--${string}`;
export type StyleOptions = Partial<Record<JSSStyleNames, string>>;
export type JCSSOptions = StyleOptions & {
    extend?: Record<`:${string}` | string, StyleOptions>;
};
export declare class JssStyle {
    static parseContents(data: Partial<Record<JSSStyleNames, string>>): string[];
    data: JCSSOptions;
    constructor(data: JssClass["data"]);
    protected resolve(name: string, data: StyleOptions): string;
    toString(name: string): string;
}
export declare class JssClass extends JssStyle {
    static parseContents(data: Partial<Record<JSSStyleNames, string>>): string[];
    name: string;
    constructor(name: JssClass["name"], data: JssClass["data"]);
    protected resolve(name: string, data: StyleOptions): string;
    toString(): string;
}
type AnimationPosition = `${number}%` | "from" | "to";
export declare class JssAnimation {
    name: string;
    data: [
        position: AnimationPosition | AnimationPosition[],
        contents: Partial<Record<JSSStyleNames, string>>
    ][];
    constructor(name: JssAnimation["name"], data: JssAnimation["data"]);
    toString(): string;
}
declare class JCSSStyleManager {
    manager: JCSS;
    private counter;
    private readonly indexes;
    readonly list: Map<JssClass["name"], JssClass>;
    constructor(manager: JCSS);
    call(run: (arg0: this) => void): this["manager"];
    has(name: JssClass["name"]): boolean;
    inject(instance: JssClass): void;
    add(name: JssClass["name"], style: JssClass["data"]): this;
    remove(instance: JssClass): boolean;
    removeByName(name: JssClass["name"]): boolean;
}
declare class JCSSAnimationManager {
    manager: JCSS;
    private counter;
    private readonly indexes;
    readonly list: Map<JssAnimation["name"], JssAnimation>;
    constructor(manager: JCSS);
    call(run: (arg0: this) => void): this["manager"];
    has(name: JssAnimation["name"]): boolean;
    inject(instance: JssAnimation): void;
    add(name: JssAnimation["name"], style: JssAnimation["data"]): this;
    remove(instance: JssAnimation): boolean;
    removeByName(name: JssAnimation["name"]): boolean;
}
export declare class JCSS {
    element: HTMLStyleElement;
    style: ((run: (arg0: JCSSStyleManager) => void) => JCSS) & JCSSStyleManager;
    animation: ((run: (arg0: JCSSAnimationManager) => void) => JCSS) & JCSSAnimationManager;
    inserted_state: boolean;
    insert(): this;
    remove(): this;
    /**
     * @deprecated
     */
    rebuild(): this;
    build(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}
export {};
