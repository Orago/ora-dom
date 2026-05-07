export declare class Fullscreen {
    static exitFullscreen(): void;
    static isFullscreen(element: HTMLElement): boolean;
    static enterFullscreen(element: HTMLElement): HTMLElement;
}
export declare class PictureApi {
    static createWindow(options?: {
        width?: number;
        height?: number;
    }): Promise<Window | undefined>;
    static createPictureWindow(options?: {
        width?: number;
        height?: number;
    }): Promise<Window | undefined>;
    static cloneWindowStyles(from: Window, to: Window): void;
}
