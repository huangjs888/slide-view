/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-06 17:20:57
 * @Description: ******
 */

export function isTouchable(ele: HTMLElement) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}

export function getDistance([x0, y0]: number[], [x1, y1]: number[]) {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

export function getVelocity(deltaTime: number, distance: number) {
  return distance / deltaTime || 0;
}

export function getAngle([x0, y0]: number[], [x1, y1]: number[]) {
  return (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
}

export function getCenter([x0, y0]: number[], [x1, y1]: number[]) {
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

export function getDirection([x0, y0]: number[], [x1, y1]: number[]) {
  const x = x0 - x1;
  const y = y0 - y1;
  if (x === y) {
    return 'None';
  }
  return Math.abs(x) >= Math.abs(y)
    ? x0 - x1 > 0
      ? 'Left'
      : 'Right'
    : y0 - y1 > 0
    ? 'Up'
    : 'Down';
}

export function rebounceSize(value: number) {
  return Math.pow(Math.abs(value || 1), 0.6) * (value > 0 ? 1 : -1);
}

export function addClass(ele: HTMLElement, className: string) {
  if (ele && typeof className === 'string') {
    className.split(' ').forEach((c) => c && ele.classList.add(c));
  }
  return ele;
}

export function setStyle(
  ele: HTMLElement,
  css: { [key: string]: string | number | undefined },
) {
  if (ele) {
    Object.keys(css).forEach((k: string) => {
      if (typeof css[k] === 'undefined') {
        return;
      }
      const key =
        k.indexOf('-') !== -1 ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
      const val =
        typeof css[k] === 'number' && key !== 'z-index' && key !== 'opacity'
          ? `${css[k]}px`
          : String(css[k]);
      ele.style.setProperty(key, val);
    });
  }
  return ele;
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
