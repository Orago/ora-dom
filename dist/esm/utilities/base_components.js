const VOID_EVENT = () => { };
export const ReservedEvents = {
    // "dom-append": VOID_EVENT,
    // "dom-remove": VOID_EVENT,
    connected: VOID_EVENT,
    disconnected: VOID_EVENT,
};
export const VNODE_FLAG = (name) => `__vnode_${name}`;
