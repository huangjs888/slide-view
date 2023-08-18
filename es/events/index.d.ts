import Gesture from '@huangjs888/gesture';
import type SlideView from '../index';
export default function bindGesture(this: SlideView, element: HTMLElement): Gesture;
export declare function onOnceTransitionEnd(ele: HTMLElement, transitionEnd: (e: TransitionEvent) => void, propertyName?: string): HTMLElement;
