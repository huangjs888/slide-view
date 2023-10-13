/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 17:24:27
 * @Description: ******
 */

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
