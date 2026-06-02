"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNODE_FLAG = exports.ReservedEvents = void 0;
const VOID_EVENT = () => { };
exports.ReservedEvents = {
    // "dom-append": VOID_EVENT,
    // "dom-remove": VOID_EVENT,
    connected: VOID_EVENT,
    disconnected: VOID_EVENT,
};
const VNODE_FLAG = (name) => `__vnode_${name}`;
exports.VNODE_FLAG = VNODE_FLAG;
