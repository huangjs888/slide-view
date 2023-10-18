/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-18 11:00:19
 * @Description: ******
 */

export function debounce(func: () => void, wait = 0) {
  // 缓存一个定时器id
  let timer: number = 0;
  return (...args: any) => {
    // 频繁每次调用，则清空定时器，忽略实际函数，然后开启新的计时器
    if (timer) clearTimeout(timer);
    // wait时间内没有再调用，则执行实际函数
    timer = +setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
}

export function getIconType(url: string) {
  if (url) {
    if (url.match(/\.(jpe?g|png|gif|bmp|ico|svg|webp)$/) || url.match(/^(data:image\/)/)) {
      return 'img';
    } else if (url.match(/^<svg(.+)?>.+<\/svg>$/)) {
      return 'span';
    }
  }
  return 'i';
}

export function findTarget(event: any, condition: (t: HTMLElement) => boolean) {
  let target = event.target;
  while (condition(target)) {
    target = target.parentNode;
  }
  return target;
}

export const getMarginSize = function getMarginSize(element: HTMLElement) {
  let val = 0;
  if (element) {
    const computed = window.getComputedStyle(element, null);
    if (computed) {
      val = parseFloat(computed.marginLeft) + parseFloat(computed.marginRight);
    } else {
      val = parseFloat(element.style.marginLeft) + parseFloat(element.style.marginRight);
    }
    if (Number.isNaN(val)) {
      val = 0;
    }
  }
  return val;
};
