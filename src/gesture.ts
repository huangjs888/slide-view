/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-07 13:33:36
 * @Description: ******
 */
import EventTarget, { type IBaseEvent } from './event';
import {
  isTouchable,
  getDirection,
  getDistance,
  getAngle,
  getCenter,
  getVelocity,
} from './util';

const fixOption = (
  value: number | undefined,
  defaultValue: number,
  minVal: number,
) => (typeof value !== 'number' || value < minVal ? defaultValue : value);

function touchstarted(this: Gesture, event: TouchEvent) {
  const touches = event.touches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  // 循环保存放在屏幕上的手指，这里只会保存最多两个，忽略超过三个的手指（只对单指和双指情形处理）
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    const p: [number, number] = [t.pageX, t.pageY];
    const touch: [[number, number], [number, number], number] = [
      p,
      p,
      t.identifier,
    ];
    if (!this._touch0) {
      this._touch0 = touch;
    } else if (!this._touch1 && touch[2] !== this._touch0[2]) {
      this._touch1 = touch;
    }
  }
  // 每次进入时先阻止所有单指事件
  this._preventTap = true;
  this._swipeTimeStamp = 0;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 双指start
  if (this._touch1 && this._touch0) {
    this.trigger('gestureStart', {
      currentTarget: this.element,
      point: [this._touch0[0], this._touch1[0]],
      timeStamp: Date.now(),
      sourceEvent: event,
    });
  }
  // 单指start
  else if (this._touch0) {
    this._preventTap = false;
    this._swipeTimeStamp = event.timeStamp;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(() => {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      this._preventTap = true;
      this._swipeTimeStamp = 0;
      this._preventSingleTap = true;
      this._preventDoubleTap = true;
      this._longTapTimer = null;
      this.trigger('longTap', {
        currentTarget: this.element,
        point: this._touch0 ? [this._touch0[0]] : [],
        timeStamp: Date.now(),
        sourceEvent: event,
        waitTime: this.longTapInterval,
      });
    }, this.longTapInterval);
    if (
      this._singleTapTimer &&
      this._touchFirst &&
      getDistance(this._touchFirst, this._touch0[0]) < this.doubleTapDistance
    ) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指，或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      clearTimeout(this._singleTapTimer);
      this._singleTapTimer = null;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
    } else {
      this._touchFirst = this._touch0[0];
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.trigger('touchStart', {
    currentTarget: this.element,
    point: this._touch1
      ? [this._touch0[0], this._touch1[1]]
      : [this._touch0[0]],
    timeStamp: Date.now(),
    sourceEvent: event,
  });
}

function touchmoved(this: Gesture, event: TouchEvent) {
  const touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  // 循环更新手指
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    const p: [number, number] = [t.pageX, t.pageY];
    if (this._touch0 && this._touch0[2] === t.identifier) {
      this._touch0[1] = p;
    } else if (this._touch1 && this._touch1[2] === t.identifier) {
      this._touch1[1] = p;
    }
  }
  // 手指移动至少要有一个手指移动超过touchMoveDistance才会触发移动事件
  if (
    (this._touch0 &&
      getDistance(this._touch0[0], this._touch0[1]) >=
        this.touchMoveDistance) ||
    (this._touch1 &&
      getDistance(this._touch1[0], this._touch1[1]) >= this.touchMoveDistance)
  ) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    if (this._longTapTimer) {
      clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (this._touch1 && this._touch0) {
      // 只有双指滑动时才会触发下面事件
      const distance1 = getDistance(this._touch0[1], this._touch1[1]);
      const distance0 = getDistance(this._touch0[0], this._touch1[0]);
      if (distance1 !== 0 && distance0 !== 0) {
        this.trigger('pinch', {
          currentTarget: this.element,
          point: [this._touch0[0], this._touch1[1]],
          timeStamp: Date.now(),
          sourceEvent: event,
          scale: distance1 / distance0, // 可以直接设置css3里transform的scale
        });
      }
      const angle1 = getAngle(this._touch0[1], this._touch1[1]);
      const angle0 = getAngle(this._touch0[0], this._touch1[0]);
      this.trigger('rotate', {
        currentTarget: this.element,
        point: [this._touch0[0], this._touch1[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
        angle: angle1 + angle0, // 加和减效果一样，可以直接设置css3里transform的rotate
      });
      const center1 = getCenter(this._touch0[1], this._touch1[1]);
      const center0 = getCenter(this._touch0[0], this._touch1[0]);
      this.trigger('multiPan', {
        currentTarget: this.element,
        point: [this._touch0[0], this._touch1[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
        deltaX: center1[0] - center0[0],
        deltaY: center1[1] - center0[1],
      });
      this.trigger('gestureMove', {
        currentTarget: this.element,
        point: [this._touch0[0], this._touch1[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
      });
    }
    // 单指移动
    else if (this._touch0) {
      // 触发单指平移事件
      const deltaX = this._touch0[1][0] - this._touch0[0][0];
      const deltaY = this._touch0[1][1] - this._touch0[0][1];
      this.trigger('pan', {
        currentTarget: this.element,
        point: [this._touch0[0]],
        timeStamp: Date.now(),
        sourceEvent: event,
        deltaX,
        deltaY,
      });
    }
    // 无指无移动
    else {
      return;
    }
    this.trigger('touchMove', {
      currentTarget: this.element,
      point: this._touch1
        ? [this._touch0[0], this._touch1[1]]
        : [this._touch0[0]],
      timeStamp: Date.now(),
      sourceEvent: event,
    });
  }
}

function touchended(this: Gesture, event: TouchEvent) {
  const touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.stopImmediatePropagation();
  // 临时保存本次
  let touch: [[number, number], [number, number], number] | null = null;
  // 循环删除已经拿开的手指
  for (let i = 0, len = touches.length; i < len; ++i) {
    const t = touches[i];
    if (this._touch0 && this._touch0[2] === t.identifier) {
      touch = this._touch0;
      this._touch0 = null;
    } else if (this._touch1 && this._touch1[2] === t.identifier) {
      this._touch1 = null;
    }
  }
  // 双指变单指
  if (this._touch1 && !this._touch0) {
    this._touch0 = this._touch1;
    this._touch1 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 仍然存在至少一根手指
  if (this._touch0) {
    // 只剩下一根在上面了
    if (!this._touch1) {
      // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
      this._touch0[0] = this._touch0[1];
      // 同时可以触发一次start事件
      this.trigger('touchStart', {
        currentTarget: this.element,
        point: [this._touch0[0]],
        timeStamp: Date.now(),
        sourceEvent: event,
      });
    }
    this.trigger('gestureEnd', {
      currentTarget: this.element,
      point: [this._touch0[0]],
      timeStamp: Date.now(),
      sourceEvent: event,
    });
  }
  // 全部拿开（双指同时抬起，最后一指抬起，仅仅一指抬起）
  else {
    if (!this._preventTap) {
      this.trigger('tap', {
        currentTarget: this.element,
        point: !touch ? [] : [touch[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
      });
    }
    if (this._swipeTimeStamp > 0 && touch) {
      const velocity = getVelocity(
        event.timeStamp - this._swipeTimeStamp,
        getDistance(touch[0], touch[1]),
      );
      // 滑动距离超过swipeDistance并且滑动速率大于swipeVelocity，才触发swipe
      if (
        velocity >= this.swipeVelocity &&
        (Math.abs(touch[1][0] - touch[0][0]) >= this.swipeDistance ||
          Math.abs(touch[1][1] - touch[0][1]) >= this.swipeDistance)
      ) {
        const direction = getDirection(touch[0], touch[1]);
        this.trigger('swipe', {
          currentTarget: this.element,
          point: [touch[1]],
          timeStamp: Date.now(),
          sourceEvent: event,
          direction,
          velocity,
        });
      }
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(() => {
        this._singleTapTimer = null;
        this.trigger('singleTap', {
          currentTarget: this.element,
          point: !touch ? [] : [touch[1]],
          timeStamp: Date.now(),
          sourceEvent: event,
          delayTime: this.doubleTapInterval,
        });
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      this.trigger('doubleTap', {
        currentTarget: this.element,
        point: !touch ? [] : [touch[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
        intervalTime: this.doubleTapInterval,
      });
    }
  }
  this.trigger('touchEnd', {
    currentTarget: this.element,
    point: [],
    timeStamp: Date.now(),
    sourceEvent: event,
  });
}

function touchcanceled(this: Gesture, event: TouchEvent) {
  this.trigger('touchCancel', {
    currentTarget: this.element,
    point: [],
    timeStamp: Date.now(),
    sourceEvent: event,
  });
  touchended.apply(this, [event]);
}

function scrollcanceled(this: Gesture) {
  if (this._singleTapTimer) {
    clearTimeout(this._singleTapTimer);
    this._singleTapTimer = null;
  }
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  this._touchFirst = null;
  this._touch0 = null;
  this._touch1 = null;
  this._preventTap = true;
  this._swipeTimeStamp = 0;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
}

class Gesture extends EventTarget<
  HTMLElement,
  TouchEvent,
  GestureEventType,
  GestureEvent
> {
  element: HTMLElement;
  longTapInterval: number = 750;
  doubleTapInterval: number = 250;
  doubleTapDistance: number = 10;
  touchMoveDistance: number = 3;
  swipeDistance: number = 30;
  swipeVelocity: number = 0.3;
  _singleTapTimer: number | null = null;
  _longTapTimer: number | null = null;
  _preventTap: boolean = true;
  _swipeTimeStamp: number = 0;
  _preventSingleTap: boolean = true;
  _preventDoubleTap: boolean = true;
  _touchFirst: [number, number] | null = null;
  _touch0: [[number, number], [number, number], number] | null = null;
  _touch1: [[number, number], [number, number], number] | null = null;
  _destory: (() => void) | null = null;
  constructor(element: HTMLElement | string, options?: GestureOptions) {
    super();
    let tempElement: HTMLElement | null;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    this.element = tempElement;
    const {
      longTapInterval,
      doubleTapInterval,
      doubleTapDistance,
      touchMoveDistance,
      swipeDistance,
      swipeVelocity,
    } = options || {};
    this.longTapInterval = fixOption(longTapInterval, 750, 500);
    this.doubleTapInterval = fixOption(doubleTapInterval, 250, 200);
    this.doubleTapDistance = fixOption(doubleTapDistance, 10, 1);
    this.touchMoveDistance = fixOption(touchMoveDistance, 3, 0);
    this.swipeDistance = fixOption(swipeDistance, 30, 0);
    this.swipeVelocity = fixOption(swipeVelocity, 0.3, 0.01);
    // 注册触摸事件
    if (isTouchable(this.element)) {
      const started = touchstarted.bind(this);
      const moved = touchmoved.bind(this);
      const ended = touchended.bind(this);
      const canceled = touchcanceled.bind(this);
      this.element.addEventListener('touchstart', started, false);
      this.element.addEventListener('touchmove', moved, false);
      this.element.addEventListener('touchend', ended, false);
      this.element.addEventListener('touchcancel', canceled, false);
      const scrolled = scrollcanceled.bind(this);
      window.addEventListener('scroll', scrolled);
      this._destory = () => {
        this.element.removeEventListener('touchstart', started);
        this.element.removeEventListener('touchmove', moved);
        this.element.removeEventListener('touchend', ended);
        this.element.removeEventListener('touchcancel', canceled);
        window.removeEventListener('scroll', scrolled);
      };
    }
  }
  done() {
    return !!this._destory;
  }
  destory() {
    // 解除所有事件
    super.off();
    scrollcanceled.apply(this);
    // 解除手势事件
    if (this._destory) {
      this._destory();
      this._destory = null;
    }
  }
}

export type GestureEventType =
  | 'pinch' // 双指放大缩小
  | 'rotate' // 双指旋转
  | 'multiPan' // 双指平移
  | 'pan' // 单指平移
  | 'swipe' // 单指快速滑动
  | 'tap' // 单指轻点（快，双击时会触发）
  | 'singleTap' // 单指点击（有延迟，双击时不触发）
  | 'longTap' // 单指长按
  | 'doubleTap' // 单指双击
  | 'touchStart' // 触摸开始
  | 'touchMove' // 触摸移动
  | 'touchEnd' // 触摸抬起
  | 'touchCancel' // 触摸取消
  | 'gestureStart' // 双（多）指开始
  | 'gestureMove' // 双（多）指移动
  | 'gestureEnd'; // 双（多）指结束

export type GestureEvent = {
  point: [number, number][]; // 当前手指点坐标[pageX,pageY]
  scale?: number; // 缩放比例
  angle?: number; // 旋转角度
  deltaX?: number; // x方向移动最终距离
  deltaY?: number; // y方向移动最终距离
  direction?: string; // 滑动方向
  velocity?: number; // 滑动速率
  waitTime?: number; // 长按等待时间
  delayTime?: number; // 点击延迟时间
  intervalTime?: number; // 双击间隔时间
} & IBaseEvent<HTMLElement, TouchEvent>;

export type GestureOptions = {
  longTapInterval?: number; // 设置长按等待时间阈值，单位ms
  doubleTapInterval?: number; // 设置双击时间间隔，单位ms
  doubleTapDistance?: number; // 双击两次点击的位置距离触发阈值
  touchMoveDistance?: number; // 移动阈值，超过这个值才算移动
  swipeDistance?: number; // 滑动阈值，超过这个值才触发滑动
  swipeVelocity?: number; // 滑动速率，超过这个值可触发滑动，设置小一点
};

export default Gesture;
