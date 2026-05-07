interface DocumentPictureInPictureOptions {
	width?: number;
	height?: number;
	disallowReturnToOpener?: boolean;
	preferInitialWindowPlacement?: boolean;
}

interface DocumentPictureInPicture extends EventTarget {
	window: Window | null;
	onenter?: (this: DocumentPictureInPicture, ev: Event) => unknown;
	requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>;
}

interface WindowExt {
	readonly documentPictureInPicture?: DocumentPictureInPicture;
}

export class Fullscreen {
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
	static isFullscreen(element: HTMLElement) {
		return (
			document.fullscreenElement === element //||
			// document?.webkitFullscreenElement === element ||
			// document?.mozFullscreenElement === element ||
			// document?.msFullscreenElement === element
		);
	}
	static enterFullscreen(element: HTMLElement) {
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

export class PictureApi {
	static async createWindow(options?: {
		width?: number;
		height?: number;
	}): Promise<Window | undefined> {
		let sub_window = window.open("", "Test", "popup");

		if (sub_window != undefined) {
			if (options?.width != undefined && options.height != undefined) {
				sub_window.resizeTo(options.width, options.height);
			}
		}

		return sub_window ?? undefined;
	}

	static async createPictureWindow(options?: {
		width?: number;
		height?: number;
	}): Promise<Window | undefined> {
		const dpip = (window as WindowExt).documentPictureInPicture;

		// Early return if there's already a Picture-in-Picture window open
		if (dpip == undefined) {
			return this.createWindow(options);
		}

		// Open a Picture-in-Picture window.
		const pip_window = await dpip.requestWindow({
			width: options?.width,
			height: options?.height,
		});

		return pip_window;
	}

	static cloneWindowStyles(from: Window, to: Window): void {
		Array.from(from.document.styleSheets).forEach((styleSheet) => {
			try {
				const css_rules = Array.from(styleSheet.cssRules)
					.map((rule) => rule.cssText)
					.join("");
				const style = from.document.createElement("style");

				style.textContent = css_rules;
				to.document.head.appendChild(style);
			} catch (e) {
				const link = from.document.createElement("link");

				link.rel = "stylesheet";
				link.type = styleSheet.type;
				(link as any).media = styleSheet.media;
				(link as any).href = styleSheet.href;
				to.document.head.appendChild(link);
			}
		});
	}
}
