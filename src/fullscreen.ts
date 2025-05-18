export function enterFullscreen(element: HTMLElement) {
	if (element.requestFullscreen) {
		/* Default */
		element.requestFullscreen();
	}

	// else if (element.webkitRequestFullscreen) /* Safari  */
	// 	element.webkitRequestFullscreen();

	// else if (element.mozRequestFullscreen) /* Firefox */
	// 	element.mozRequestFullscreen();

	// else if (element.msRequestFullscreen) /* IE11 */
	// 	element.msRequestFullscreen();

	return element;
}

export function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	}

	// else if (document?.webkitExitFullscreen) /* Safari */
	// 	document.webkitExitFullscreen();

	// else if (document?.mozCancelFullScreen) /* Firefox */
	// 	document.mozCancelFullScreen();

	// else if (document?.msExitFullscreen) /* IE/Edge */
	// 	document.msExitFullscreen();
}

export function isElementFullscreen(element: HTMLElement) {
	return document.fullscreenElement === element;

	//||
	// document?.webkitFullscreenElement === element ||
	// document?.mozFullscreenElement === element ||
	// document?.msFullscreenElement === element
}
