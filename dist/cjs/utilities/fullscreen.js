"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictureApi = exports.Fullscreen = void 0;
class Fullscreen {
    static exitFullscreen() {
        if (document.exitFullscreen) {
            /* Default */ document.exitFullscreen();
        }
        // else if (document?.webkitExitFullscreen) /* Safari */
        // 	document.webkitExitFullscreen();
        // else if (document?.mozCancelFullScreen) /* Firefox */
        // 	document.mozCancelFullScreen();
        // else if (document?.msExitFullscreen) /* IE/Edge */
        // 	document.msExitFullscreen();
    }
    static isFullscreen(element) {
        return (document.fullscreenElement === element //||
        // document?.webkitFullscreenElement === element ||
        // document?.mozFullscreenElement === element ||
        // document?.msFullscreenElement === element
        );
    }
    static enterFullscreen(element) {
        if (element.requestFullscreen) {
            /* Default */ element.requestFullscreen();
        }
        // else if (element.webkitRequestFullscreen) /* Safari  */
        // 	element.webkitRequestFullscreen();
        // else if (element.mozRequestFullscreen) /* Firefox */
        // 	element.mozRequestFullscreen();
        // else if (element.msRequestFullscreen) /* IE11 */
        // 	element.msRequestFullscreen();
        return element;
    }
}
exports.Fullscreen = Fullscreen;
class PictureApi {
    static createWindow(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let sub_window = window.open("", "Test", "popup");
            if (sub_window != undefined) {
                if ((options === null || options === void 0 ? void 0 : options.width) != undefined && options.height != undefined) {
                    sub_window.resizeTo(options.width, options.height);
                }
            }
            return sub_window !== null && sub_window !== void 0 ? sub_window : undefined;
        });
    }
    static createPictureWindow(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const dpip = window.documentPictureInPicture;
            // Early return if there's already a Picture-in-Picture window open
            if (dpip == undefined) {
                return this.createWindow(options);
            }
            // Open a Picture-in-Picture window.
            const pip_window = yield dpip.requestWindow({
                width: options === null || options === void 0 ? void 0 : options.width,
                height: options === null || options === void 0 ? void 0 : options.height,
            });
            return pip_window;
        });
    }
    static cloneWindowStyles(from, to) {
        Array.from(from.document.styleSheets).forEach((styleSheet) => {
            try {
                const css_rules = Array.from(styleSheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("");
                const style = from.document.createElement("style");
                style.textContent = css_rules;
                to.document.head.appendChild(style);
            }
            catch (e) {
                const link = from.document.createElement("link");
                link.rel = "stylesheet";
                link.type = styleSheet.type;
                link.media = styleSheet.media;
                link.href = styleSheet.href;
                to.document.head.appendChild(link);
            }
        });
    }
}
exports.PictureApi = PictureApi;
