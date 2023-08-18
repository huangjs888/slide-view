export declare function getIconType(url: string): "img" | "span" | "i";
export declare function findTarget(event: any, condition: (t: HTMLElement) => boolean): any;
export declare const getMarginSize: (element: HTMLElement) => number;
export declare function addClass(ele: HTMLElement, className: string): HTMLElement;
export declare function removeClass(ele: HTMLElement, className: string): HTMLElement;
export declare function cssInject(cssText: string): void;
export declare function setStyle(ele: HTMLElement, css: {
    [key: string]: string | number | undefined;
}): HTMLElement;
