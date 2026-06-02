const VOID_EVENT: () => void = () => {};
export const ReservedEvents = {
	// "dom-append": VOID_EVENT,
	// "dom-remove": VOID_EVENT,
	connected: VOID_EVENT,
	disconnected: VOID_EVENT,
} satisfies Record<string, () => void>;
export const VNODE_FLAG = (name: string) => `__vnode_${name}`;
