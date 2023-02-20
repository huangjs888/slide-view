/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:06:08
 * @Description: ******
 */

export default class EventTarget<T extends string, E> {
  events: { [key in T]?: Array<(e: E) => void> } = {};
  constructor() {
    this.events = {};
  }
  once(type: T, handler: (e: E) => void) {
    const onceHandler = (ee: E) => {
      handler(ee);
      this.off(type, onceHandler);
    };
    this.on(type, onceHandler);
  }
  on(type: T, handler: (e: E) => void) {
    const pool = this.events[type] || [];
    pool.push(handler);
    this.events[type] = pool;
  }
  off(type?: T, handler?: (e: E) => void) {
    if (!type) {
      this.events = {};
    } else if (handler) {
      const pool = this.events[type] || [];
      const index = pool.findIndex((h) => h === handler);
      if (index !== -1) {
        pool.splice(index, 1);
      }
      this.events[type] = pool;
    } else {
      this.events[type] = [];
    }
  }
}
