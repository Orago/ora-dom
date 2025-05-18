type Dec = keyof CSSStyleDeclaration | `--${string}`;
declare class JssClass {
    static parseContents(data: Partial<Record<Dec, string>>): string[];
    name: string;
    data: Partial<Record<Dec, string>>;
    constructor(name: JssClass["name"], data: JssClass["data"]);
    toString(): string;
}
type AnimationPosition = `${number}%` | "from" | "to";
declare class JssAnimation {
    name: string;
    data: [
        position: AnimationPosition | AnimationPosition[],
        contents: Partial<Record<Dec, string>>
    ][];
    constructor(name: JssAnimation["name"], data: JssAnimation["data"]);
    toString(): string;
}
declare class JCSSClassManager {
    manager: JCSS;
    private counter;
    private readonly indexes;
    readonly list: Map<JssClass["name"], JssClass>;
    constructor(manager: JCSS);
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
    has(name: JssAnimation["name"]): boolean;
    inject(instance: JssAnimation): void;
    add(name: JssAnimation["name"], style: JssAnimation["data"]): this;
    remove(instance: JssAnimation): boolean;
    removeByName(name: JssAnimation["name"]): boolean;
}
export declare class JCSS {
    element: HTMLStyleElement;
    styles: JCSSClassManager;
    animations: JCSSAnimationManager;
    inserted_state: boolean;
    insert(): this;
    remove(): this;
    rebuild(): this;
    getUsageCount(): number;
    ref(run: (arg0: this) => void): this;
}
export {};
