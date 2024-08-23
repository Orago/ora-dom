"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElementFullscreen = exports.exitFullscreen = exports.enterFullscreen = void 0;
function enterFullscreen(element) {
    if (element.requestFullscreen) /* Default */
        element.requestFullscreen();
    // else if (element.webkitRequestFullscreen) /* Safari  */
    // 	element.webkitRequestFullscreen(); 
    // else if (element.mozRequestFullscreen) /* Firefox */
    // 	element.mozRequestFullscreen();
    // else if (element.msRequestFullscreen) /* IE11 */
    // 	element.msRequestFullscreen();
    return element;
}
exports.enterFullscreen = enterFullscreen;
function exitFullscreen() {
    if (document.exitFullscreen) /* Default */
        document.exitFullscreen();
    // else if (document?.webkitExitFullscreen) /* Safari */
    // 	document.webkitExitFullscreen();
    // else if (document?.mozCancelFullScreen) /* Firefox */
    // 	document.mozCancelFullScreen();
    // else if (document?.msExitFullscreen) /* IE/Edge */
    // 	document.msExitFullscreen();
}
exports.exitFullscreen = exitFullscreen;
function isElementFullscreen(element) {
    return (document.fullscreenElement === element //||
    // document?.webkitFullscreenElement === element ||
    // document?.mozFullscreenElement === element ||
    // document?.msFullscreenElement === element
    );
}
exports.isElementFullscreen = isElementFullscreen;
