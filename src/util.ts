/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 13:50:19
 * @Description: ******
 */

export function addClass(ele: HTMLElement, className: string) {
  if (ele && typeof className === 'string') {
    className.split(' ').forEach((c) => c && ele.classList.add(c));
  }
  return ele;
}

export function removeClass(ele: HTMLElement, className: string) {
  if (ele && typeof className === 'string') {
    className.split(' ').forEach((c) => c && ele.classList.remove(c));
  }
  return ele;
}

export const getMarginSize = function getMarginSize(element: HTMLElement) {
  let val = 0;
  if (element) {
    const computed = window.getComputedStyle(element, null);
    if (computed) {
      val = parseFloat(computed.marginLeft) + parseFloat(computed.marginRight);
    } else {
      val =
        parseFloat(element.style.marginLeft) +
        parseFloat(element.style.marginRight);
    }
    if (Number.isNaN(val)) {
      val = 0;
    }
  }
  return val;
};

export function getIconType(url: string) {
  if (url) {
    if (
      url.match(/\.(jpe?g|png|gif|bmp|ico|svg|webp)$/) ||
      url.match(/^(data:image\/)/)
    ) {
      return 'img';
    } else if (url.match(/^<svg(.+)?>.+<\/svg>$/)) {
      return 'span';
    }
  }
  return 'i';
}

const styleId = 'hjs-slide-view-style';
export function cssInject(cssText: string) {
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

const autoPxReg =
  /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
export function setStyle(
  ele: HTMLElement,
  css: { [key: string]: string | number | undefined },
) {
  if (ele) {
    Object.keys(css).forEach((k: string) => {
      if (typeof css[k] === 'undefined') {
        return;
      }
      const key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      const val =
        typeof css[k] === 'number' &&
        /^[a-z]/.test(key) &&
        autoPxReg.test(`-${key}`)
          ? `${css[k]}px`
          : String(css[k]);
      ele.style.setProperty(key, val);
    });
  }
  return ele;
}

export function findTarget(event: any, condition: (t: HTMLElement) => boolean) {
  let target = (
    event instanceof MouseEvent ? event.target : event.sourceEvent.target
  ) as HTMLElement;
  while (condition(target)) {
    target = target.parentNode as HTMLElement;
  }
  return target;
}
