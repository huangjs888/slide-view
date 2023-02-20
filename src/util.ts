/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:15:50
 * @Description: ******
 */

export function touchable(ele: HTMLElement) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}

export function rebounceSize(value: number) {
  return Math.pow(Math.abs(value || 1), 0.6) * (value > 0 ? 1 : -1);
}

export function addClass(ele: HTMLElement, className: string) {
  if (!ele) {
    return;
  }
  if (typeof className === 'string') {
    className.split(' ').forEach((c) => c && ele.classList.add(c));
  }
}

export function setStyle(
  ele: HTMLElement,
  css: { [key: string]: string | number | undefined },
) {
  if (!ele) {
    return;
  }
  return Object.keys(css).forEach((k: string) => {
    if (typeof css[k] === 'undefined') {
      return;
    }
    const key =
      k.indexOf('-') !== -1 ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
    const val = typeof css[k] === 'number' ? `${css[k]}px` : String(css[k]);
    ele.style.setProperty(key, val);
  });
}

export function onOnceTransitionEnd(
  ele: HTMLElement,
  transitionEnd: (e: Event) => void,
) {
  if (!ele) {
    return;
  }
  const transitionEndWrapper = (e: Event) => {
    transitionEnd(e);
    ele.removeEventListener('oTransitionEnd', transitionEndWrapper);
    ele.removeEventListener('mozTransitionEnd', transitionEndWrapper);
    ele.removeEventListener('webkitTransitionEnd', transitionEndWrapper);
    ele.removeEventListener('transitionend', transitionEndWrapper);
  };
  ele.addEventListener('oTransitionEnd', transitionEndWrapper);
  ele.addEventListener('mozTransitionEnd', transitionEndWrapper);
  ele.addEventListener('webkitTransitionEnd', transitionEndWrapper);
  ele.addEventListener('transitionend', transitionEndWrapper);
}

const styleId = 'hjs-slide-view-style';
export function styleInject(cssText: string) {
  let style = document.querySelector(`#${styleId}`);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(cssText));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(
      style,
    );
  }
}
