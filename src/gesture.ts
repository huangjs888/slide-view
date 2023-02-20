/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:13:05
 * @Description: ******
 */

import { touchable } from './util';

function touchstarted(
  element: HTMLElement,
  event: TouchEvent,
  handler: GestureEventHandler,
) {
  event.stopImmediatePropagation();
  // 表示是已经有一个手指放上去了
  if (element.getAttribute('data-touch-identifier')) {
    return;
  }
  const touch = event.touches.item(0);
  if (!touch) {
    return;
  }
  // 设置主手指
  element.setAttribute('data-touch-identifier', touch.identifier.toString());
  handler.start &&
    handler.start({
      type: 'touch',
      point: [touch.pageX, touch.pageY],
      sourceEvent: event,
    });
}

function touchmoved(
  element: HTMLElement,
  event: TouchEvent,
  handler: GestureEventHandler,
) {
  event.preventDefault();
  event.stopImmediatePropagation();
  let changedTouch = null;
  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches.item(i);
    if (
      touch &&
      touch.identifier ===
        +(element.getAttribute('data-touch-identifier') || -1)
    ) {
      changedTouch = touch;
      break;
    }
  }
  // 表示移动的手指不是主手指
  if (!changedTouch) {
    return;
  }
  handler.move &&
    handler.move({
      type: 'touch',
      point: [changedTouch.pageX, changedTouch.pageY],
      sourceEvent: event,
    });
}

function touchended(
  element: HTMLElement,
  event: TouchEvent,
  handler: GestureEventHandler,
) {
  event.stopImmediatePropagation();
  let changedTouch = null;
  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches.item(i);
    if (
      touch &&
      touch.identifier ===
        +(element.getAttribute('data-touch-identifier') || -1)
    ) {
      changedTouch = touch;
      break;
    }
  }
  // 表示抬起的手指不是主手指
  if (!changedTouch) {
    return;
  }
  handler.end &&
    handler.end({
      type: 'touch',
      point: [changedTouch.pageX, changedTouch.pageY],
      sourceEvent: event,
    });
  // 没有手指在上面了
  element.setAttribute('data-touch-identifier', '');
  if (event.touches.length) {
    // 当主手指抬起来了，但是还有其他手指在上面，就把第二个手指作为主手指
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }
    // 设置主手指
    element.setAttribute('data-touch-identifier', touch.identifier.toString());
    handler.start &&
      handler.start({
        type: 'touch',
        point: [touch.pageX, touch.pageY],
        sourceEvent: event,
      });
  }
}

function mousedowned(
  element: HTMLElement,
  event: MouseEvent,
  handler: GestureEventHandler,
) {
  event.stopImmediatePropagation();
  document.addEventListener('mousemove', mousemoved);
  document.addEventListener('mouseup', mouseupped);
  if ('onselectstart' in document) {
    document.addEventListener('dragstart', dragstarted, {
      capture: true,
      passive: false,
    });
    document.addEventListener('selectstart', dragstarted, {
      capture: true,
      passive: false,
    });
  }
  const x0 = event.clientX;
  const y0 = event.clientY;
  handler.start &&
    handler.start({
      type: 'mouse',
      point: [event.pageX, event.pageY],
      sourceEvent: event,
    });

  function dragstarted(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function mousemoved(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    if (dx * dx + dy * dy < 3) {
      return;
    }
    handler.move &&
      handler.move({
        type: 'mouse',
        point: [e.pageX, e.pageY],
        sourceEvent: e,
      });
  }

  function mouseupped(e: MouseEvent) {
    e.stopImmediatePropagation();
    document.removeEventListener('mousemove', mousemoved);
    document.removeEventListener('mouseup', mouseupped);
    if ('onselectstart' in document) {
      document.removeEventListener('dragstart', dragstarted);
      document.removeEventListener('selectstart', dragstarted);
    }
    handler.end &&
      handler.end({
        type: 'mouse',
        point: [e.pageX, e.pageY],
        sourceEvent: e,
      });
  }
}

export type GestureEvent = {
  type: 'mouse' | 'touch';
  point: number[];
  sourceEvent: TouchEvent | MouseEvent;
};

export type GestureEventHandler = {
  start?: (e: GestureEvent) => void;
  move?: (e: GestureEvent) => void;
  end?: (e: GestureEvent) => void;
};

export type IGesture = {
  element: HTMLElement;
  handler: GestureEventHandler;
  destory: () => void;
};

export default function Gesture(
  ele: HTMLElement,
  handler?: GestureEventHandler,
) {
  if (!ele || !(ele instanceof HTMLElement)) {
    throw new Error('Binding events require HTMLElement...');
  }
  const h = handler || {};
  const ts = (e: TouchEvent) => touchstarted(ele, e, h);
  const tm = (e: TouchEvent) => touchmoved(ele, e, h);
  const te = (e: TouchEvent) => touchended(ele, e, h);
  const md = (e: MouseEvent) => mousedowned(ele, e, h);
  if (touchable(ele)) {
    ele.addEventListener('touchstart', ts);
    ele.addEventListener('touchmove', tm);
    ele.addEventListener('touchend', te);
    ele.addEventListener('touchcancel', te);
  } else {
    ele.addEventListener('mousedown', md);
  }
  return {
    element: ele,
    handler: h,
    destory: () => {
      if (touchable(ele)) {
        ele.removeEventListener('touchstart', ts);
        ele.removeEventListener('touchmove', tm);
        ele.removeEventListener('touchend', te);
        ele.removeEventListener('touchcancel', te);
      } else {
        ele.removeEventListener('mousedown', md);
      }
    },
  };
}
