/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:29:15
 * @Description: ******
 */

import type SlideView from './index';
import { type MergeActionItem } from './index';
import { setStyle, addClass, removeClass, getIconType } from './util';

export const confirmStyle = function (item: MergeActionItem, isConfirm: boolean = false) {
  const {
    wrapper,
    element,
    confirm = {}, // isConfirm为true,confirm必然存在
    ...rest
  } = item;
  let { text, icon, color, background, className } = rest;
  if (isConfirm) {
    // 如果icon不存在，则不存在该确认，如果icon存在，则取确认icon，若确认icon不存在，则仍然取icon
    icon = icon && (confirm.icon || icon);
    text = text && (confirm.text || text);
    color = color && (confirm.color || color);
    background = background && (confirm.background || background);
    className = className && (confirm.className || className);
  }
  setStyle(wrapper, {
    background: background || '',
    color: color || '',
  });
  addClass(
    removeClass(
      element,
      isConfirm ? rest.className || '' : confirm.className || rest.className || '',
    ),
    className || '',
  );
  if (icon) {
    const iconEl = element.firstElementChild as HTMLElement;
    const type = getIconType(icon);
    if (type === 'img') {
      (iconEl as HTMLImageElement).src = icon;
    } else if (type === 'i') {
      iconEl.className = icon;
    } else {
      iconEl.innerHTML = icon;
    }
  }
  if (text) {
    const textEl = element.lastElementChild as HTMLElement;
    textEl.innerText = text;
  }
};

export const confirmCancel = function (this: SlideView) {
  // 如果当前处于按钮确认状态，隐藏之前需要先取消
  if (this._confirming) {
    // 因为hide的时候会进行变换，所以不需要再cTransform
    const { index, direction } = this._confirming;
    const actions =
      direction === 'left' ? this.leftActions : direction === 'right' ? this.rightActions : null;
    if (actions && !actions.disable) {
      const item = actions.items[index];
      setStyle(item.element, {
        width: '',
      });
      confirmStyle(item);
    }
    this._confirming = null;
  }
};
