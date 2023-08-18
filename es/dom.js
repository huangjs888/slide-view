/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:16:12
 * @Description: ******
 */

import { addClass, cssInject } from './util';
import css from './css';
export default function generateEl(container, className) {
  let tempContainer;
  try {
    if (typeof container === 'string') {
      tempContainer = document.querySelector(container);
    } else {
      tempContainer = container;
    }
  } catch (e) {
    tempContainer = null;
  }
  if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
    throw new Error('Please pass in a valid container element...');
  }
  cssInject(css);
  const viewElement = addClass(document.createElement('div'), `hjs-slideview ${className || ''}`);
  const leftElement = addClass(document.createElement('div'), 'hjs-slideview__left');
  viewElement.appendChild(leftElement);
  const rightElement = addClass(document.createElement('div'), 'hjs-slideview__right');
  viewElement.appendChild(rightElement);
  const contentElement = addClass(document.createElement('div'), 'hjs-slideview__content');
  viewElement.appendChild(contentElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(viewElement);
  return [viewElement, contentElement, leftElement, rightElement];
}