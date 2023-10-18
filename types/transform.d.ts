import type SlideView from './slideview';
import { type IConfirm } from './slideview';
export declare const cTransform: (this: SlideView, confirm: IConfirm, translate?: number) => void;
export declare const transform: (this: SlideView, translate: number, duration?: number) => void;
