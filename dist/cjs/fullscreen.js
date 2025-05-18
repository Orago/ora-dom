"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElementFullscreen = exports.exitFullscreen = exports.enterFullscreen = void 0;
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
    return element;
}
exports.enterFullscreen = enterFullscreen;
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}
exports.exitFullscreen = exitFullscreen;
function isElementFullscreen(element) {
    return document.fullscreenElement === element;
}
exports.isElementFullscreen = isElementFullscreen;
