/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-07 13:48:11
 * @Description: ******
 */
export type IBaseEvent<O, E> = {
  currentTarget: O; // 事件绑定元素
  sourceEvent: E; // 源事件
  timeStamp: number; // 事件发生时间戳
};
type IHandler<E, T> = (this: any, event: E, type?: T) => void;

export default class EventTarget<
  O,
  K,
  T extends string,
  E extends IBaseEvent<O, K>,
> {
  events: {
    [key in T]?: Array<IHandler<E, T>>;
  } = {};
  constructor() {
    this.events = {};
  }
  once(type: T, handler: IHandler<E, T>) {
    const onceHandler = (...args: [E, T?]) => {
      handler.apply(this, args);
      this.off(type, onceHandler);
    };
    this.on(type, onceHandler);
  }
  on(type: T, handler: IHandler<E, T>) {
    const eventPool = this.events[type] || [];
    eventPool.push(handler);
    this.events[type] = eventPool;
  }
  off(type?: T, handler?: IHandler<E, T>) {
    if (!type) {
      this.events = {};
    } else if (handler) {
      const eventPool = this.events[type] || [];
      for (let i = eventPool.length; i >= 0; i--) {
        if (eventPool[i] === handler) {
          eventPool.splice(i, 1);
        }
      }
      this.events[type] = eventPool;
    } else {
      this.events[type] = [];
    }
  }
  trigger(type: T, event: E) {
    const eventPool = this.events[type] || [];
    for (let i = 0, len = eventPool.length; i < len; i++) {
      var handler = eventPool[i];
      if (typeof handler === 'function') {
        handler.apply(event.currentTarget, [event, type]);
      }
    }
  }
}
