import type SlideView from './slideview';
import { type Confirm } from './slideview';
export declare const cTransform: (this: SlideView, confirm: Confirm, translate?: number) => void;
export declare const transform: (this: SlideView, translate: number, duration?: number) => void;
