export declare function debounce(func: () => void, wait?: number): (...args: any) => void;
export declare function getIconType(url: string): "img" | "span" | "i";
export declare function findTarget(event: any, condition: (t: HTMLElement) => boolean): any;
export declare const getMarginSize: (element: HTMLElement) => number;
