import { Emitter } from "@orago/lib";
type ObservedCallback = () => void;
export declare class ObserverTracking {
    private static inDom;
    static handle(element: HTMLElement): void;
    private static getEvents;
    private static weak_events;
    private static tracked_in_dom;
    list: Set<HTMLElement>;
    observer: MutationObserver;
    events: Emitter<{
        append: ObservedCallback;
        remove: ObservedCallback;
        any: () => void;
    }, true>;
    constructor();
    private cleanupElement;
    on(element: HTMLElement, event: "append" | "remove", callback: ObservedCallback): this;
    off(element: HTMLElement, event: "append" | "remove", callback?: ObservedCallback): this;
    once(element: HTMLElement, event: "append" | "remove", callback: ObservedCallback): this;
}
export {};
