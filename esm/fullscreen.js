export function enterFullscreen(element) {
    if (element.requestFullscreen)
        element.requestFullscreen();
    return element;
}
export function exitFullscreen() {
    if (document.exitFullscreen)
        document.exitFullscreen();
}
export function isElementFullscreen(element) {
    return (document.fullscreenElement === element);
}
