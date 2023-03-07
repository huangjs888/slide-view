/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-07 13:43:03
 * @Description: ******
 */
import Gesture, { type GestureEvent } from './gesture';

function started(
  element: HTMLElement,
  event: GestureEvent,
  start: AgentHandler,
) {
  const e = event.sourceEvent as TouchEvent;
  // 表示是已经有一个手指放上去了
  if (element.getAttribute('data-touch-identifier')) {
    return;
  }
  const touch = e.touches[0];
  if (!touch) {
    return;
  }
  // 设置主手指
  element.setAttribute('data-touch-identifier', touch.identifier.toString());
  start({
    type: 'touch',
    currentTarget: element,
    point: [touch.pageX, touch.pageY],
    sourceEvent: event,
  });
}

function moved(element: HTMLElement, event: GestureEvent, move: AgentHandler) {
  const e = event.sourceEvent as TouchEvent;
  let changedTouch = null;
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches.item(i);
    if (
      touch &&
      touch.identifier.toString() ===
        element.getAttribute('data-touch-identifier')
    ) {
      changedTouch = touch;
      break;
    }
  }
  // 表示移动的手指不是主手指
  if (!changedTouch) {
    return;
  }
  move({
    type: 'touch',
    currentTarget: element,
    point: [changedTouch.pageX, changedTouch.pageY],
    sourceEvent: event,
  });
}

function ended(element: HTMLElement, event: GestureEvent, end: AgentHandler) {
  const e = event.sourceEvent as TouchEvent;
  let changedTouch = null;
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches.item(i);
    if (
      touch &&
      touch.identifier.toString() ===
        element.getAttribute('data-touch-identifier')
    ) {
      changedTouch = touch;
      break;
    }
  }
  // 表示抬起的手指不是主手指
  if (!changedTouch) {
    return;
  }
  // 没有手指在上面了
  element.setAttribute('data-touch-identifier', '');
  end({
    type: 'touch',
    currentTarget: element,
    point: [changedTouch.pageX, changedTouch.pageY],
    sourceEvent: event,
  });
}

function touched(
  element: HTMLElement,
  event: GestureEvent,
  touch: AgentHandler,
) {
  touch({
    type: 'touch',
    point: event.point[0],
    currentTarget: element,
    sourceEvent: event,
  });
}

function mousedowned(
  element: HTMLElement,
  event: MouseEvent,
  { start, move, end }: AgentEventHandler,
) {
  event.preventDefault();
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
  start &&
    start({
      type: 'mouse',
      point: [event.pageX, event.pageY],
      currentTarget: element,
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
    if (dx * dx + dy * dy >= 3 * 3) {
      move &&
        move({
          type: 'mouse',
          point: [e.pageX, e.pageY],
          currentTarget: element,
          sourceEvent: e,
        });
    }
  }

  function mouseupped(e: MouseEvent) {
    e.stopImmediatePropagation();
    document.removeEventListener('mousemove', mousemoved);
    document.removeEventListener('mouseup', mouseupped);
    if ('onselectstart' in document) {
      document.removeEventListener('dragstart', dragstarted);
      document.removeEventListener('selectstart', dragstarted);
    }
    end &&
      end({
        type: 'mouse',
        point: [e.pageX, e.pageY],
        currentTarget: element,
        sourceEvent: e,
      });
  }
}

function moused(element: HTMLElement, event: MouseEvent, mouse: AgentHandler) {
  event.preventDefault();
  mouse({
    type: 'mouse',
    point: [event.pageX, event.pageY],
    currentTarget: element,
    sourceEvent: event,
  });
}

export type AgentEvent = {
  type: 'mouse' | 'touch';
  point: number[];
  currentTarget: HTMLElement;
  sourceEvent: GestureEvent | MouseEvent;
};

type AgentHandler = (e: AgentEvent) => void;

type AgentEventHandler = {
  start?: AgentHandler;
  move?: AgentHandler;
  end?: AgentHandler;
  press?: AgentHandler;
  longPress?: AgentHandler;
  doublePress?: AgentHandler;
};

export type IAgent = {
  element: HTMLElement;
  destory: () => void;
};

export default function agent(ele: HTMLElement, handler: AgentEventHandler) {
  if (!ele || !(ele instanceof HTMLElement)) {
    throw new Error('Binding events require HTMLElement...');
  }
  let destory = () => {};
  const { start, move, end, press, longPress, doublePress } = handler;
  const gesture = new Gesture(ele);
  if (gesture.done()) {
    start &&
      gesture.on('touchStart', (e: GestureEvent) => started(ele, e, start));
    move && gesture.on('touchMove', (e: GestureEvent) => moved(ele, e, move));
    end && gesture.on('touchEnd', (e: GestureEvent) => ended(ele, e, end));
    press && gesture.on('tap', (e: GestureEvent) => touched(ele, e, press));
    longPress &&
      gesture.on('longTap', (e: GestureEvent) => touched(ele, e, longPress));
    doublePress &&
      gesture.on('doubleTap', (e: GestureEvent) =>
        touched(ele, e, doublePress),
      );
    destory = () => {
      gesture.destory();
    };
  } else {
    let mousedown: ((e: MouseEvent) => void) | null = null;
    if (start || move || end) {
      mousedown = (e: MouseEvent) => mousedowned(ele, e, { start, move, end });
      ele.addEventListener('mousedown', mousedown);
    }
    let click: ((e: MouseEvent) => void) | null = null;
    if (press) {
      click = (e: MouseEvent) => moused(ele, e, press);
      ele.addEventListener('click', click);
    }
    let rightclick: ((e: MouseEvent) => void) | null = null;
    if (longPress) {
      rightclick = (e: MouseEvent) => moused(ele, e, longPress);
      ele.addEventListener('contextmenu', rightclick);
    }
    let dblclick: ((e: MouseEvent) => void) | null = null;
    if (doublePress) {
      dblclick = (e: MouseEvent) => moused(ele, e, doublePress);
      ele.addEventListener('dblclick', dblclick);
    }
    destory = () => {
      mousedown && ele.removeEventListener('mousedown', mousedown);
      click && ele.removeEventListener('click', click);
      dblclick && ele.removeEventListener('dblclick', dblclick);
      rightclick && ele.removeEventListener('contextmenu', rightclick);
    };
  }
  return {
    element: ele,
    destory,
  };
}

export function onOnceTransitionEnd(
  ele: HTMLElement,
  transitionEnd: (e: TransitionEvent) => void,
) {
  if (!ele) {
    return;
  }
  const transitionEndWrapper = (e: TransitionEvent) => {
    transitionEnd(e);
    ele.removeEventListener('transitionend', transitionEndWrapper);
  };
  ele.addEventListener('transitionend', transitionEndWrapper);
}
