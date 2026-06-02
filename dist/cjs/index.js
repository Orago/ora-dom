"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experimental = exports.qsAll = exports.qs = exports.ProxyNode = exports.newNode = exports.generateProxyNode = exports.default = exports.JssAnimation = exports.JssStyle = exports.JssClass = exports.JCSS = exports.OC_Animation = exports.OraCssClass = exports.OraCssStyle = exports.OraCss = exports.OragoCss = exports.ObserverTracking = exports.JCSSTracker = exports.Picture = exports.Fullscreen = exports.VNodeEventGroup = exports.StateTracking = exports.StyledVNode = exports.VNFragment = exports.vn = exports.VNode = void 0;
var vnode_js_1 = require("./vnode.js");
Object.defineProperty(exports, "VNode", { enumerable: true, get: function () { return vnode_js_1.VNode; } });
var vnode_functional_js_1 = require("./vnode_functional.js");
Object.defineProperty(exports, "vn", { enumerable: true, get: function () { return vnode_functional_js_1.vn; } });
Object.defineProperty(exports, "VNFragment", { enumerable: true, get: function () { return vnode_functional_js_1.VNFragment; } });
var vnode_styled_js_1 = require("./vnode_styled.js");
Object.defineProperty(exports, "StyledVNode", { enumerable: true, get: function () { return vnode_styled_js_1.StyledVNode; } });
var vnode_tracking_js_1 = require("./utilities/vnode_tracking.js");
Object.defineProperty(exports, "StateTracking", { enumerable: true, get: function () { return vnode_tracking_js_1.StateTracking; } });
var events_js_1 = require("./utilities/events.js");
Object.defineProperty(exports, "VNodeEventGroup", { enumerable: true, get: function () { return events_js_1.VNodeEventGroup; } });
var fullscreen_js_1 = require("./utilities/fullscreen.js");
Object.defineProperty(exports, "Fullscreen", { enumerable: true, get: function () { return fullscreen_js_1.Fullscreen; } });
Object.defineProperty(exports, "Picture", { enumerable: true, get: function () { return fullscreen_js_1.PictureApi; } });
var vnode_styled_js_2 = require("./vnode_styled.js");
Object.defineProperty(exports, "JCSSTracker", { enumerable: true, get: function () { return vnode_styled_js_2.JCSSTracker; } });
var dom_observer_js_1 = require("./dom_observer.js");
Object.defineProperty(exports, "ObserverTracking", { enumerable: true, get: function () { return dom_observer_js_1.ObserverTracking; } });
exports.OragoCss = __importStar(require("./ora_css.js"));
var ora_css_js_1 = require("./ora_css.js");
Object.defineProperty(exports, "OraCss", { enumerable: true, get: function () { return ora_css_js_1.OraCss; } });
Object.defineProperty(exports, "OraCssStyle", { enumerable: true, get: function () { return ora_css_js_1.OraCssStyle; } });
Object.defineProperty(exports, "OraCssClass", { enumerable: true, get: function () { return ora_css_js_1.OraCssStyle; } });
Object.defineProperty(exports, "OC_Animation", { enumerable: true, get: function () { return ora_css_js_1.OraCssAnimation; } });
// legacy
/** @deprecated */
Object.defineProperty(exports, "JCSS", { enumerable: true, get: function () { return ora_css_js_1.OraCss; } });
/** @deprecated */
Object.defineProperty(exports, "JssClass", { enumerable: true, get: function () { return ora_css_js_1.OraCssStyle; } });
/** @deprecated */
Object.defineProperty(exports, "JssStyle", { enumerable: true, get: function () { return ora_css_js_1.OraCssStyle; } });
/** @deprecated */
Object.defineProperty(exports, "JssAnimation", { enumerable: true, get: function () { return ora_css_js_1.OraCssAnimation; } });
var proxynode_js_1 = require("./proxynode.js");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(proxynode_js_1).default; } });
Object.defineProperty(exports, "generateProxyNode", { enumerable: true, get: function () { return proxynode_js_1.generateProxyNode; } });
Object.defineProperty(exports, "newNode", { enumerable: true, get: function () { return proxynode_js_1.newNode; } });
Object.defineProperty(exports, "ProxyNode", { enumerable: true, get: function () { return proxynode_js_1.ProxyNode; } });
Object.defineProperty(exports, "qs", { enumerable: true, get: function () { return proxynode_js_1.qs; } });
Object.defineProperty(exports, "qsAll", { enumerable: true, get: function () { return proxynode_js_1.qsAll; } });
exports.Experimental = __importStar(require("./experimental.js"));
