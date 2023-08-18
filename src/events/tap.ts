/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:13:31
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import buttonPress from './buttonPress';
import type SlideView from '../index';
import { findTarget } from '../util';

export default function tap(this: SlideView, e: GEvent) {
  const { contentEl, leftEl, rightEl, _translate } = this;
  const { sourceEvent, currentTarget } = e;
  const target = findTarget(
    sourceEvent,
    (t) => t !== currentTarget && t !== contentEl && t !== leftEl && t !== rightEl,
  );
  // 触发内容元素按压事件
  if (contentEl && target === contentEl) {
    // 没有使用this._direction判断，是因为该值变化是要动画结束后变化，this._translate变化是动画执行前
    // 使用this._translate判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._direction正好相反
    // 收起时候则触发按压事件，未收起则收起
    if (_translate === 0) {
      this.emit('press', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e,
      });
    } else {
      this.hide();
    }
  }
  // 触发左边按钮按压事件
  else if (target === leftEl) {
    buttonPress.apply(this, [e, 'left']);
  }
  // 触发右边按钮按压事件
  else if (target === rightEl) {
    buttonPress.apply(this, [e, 'right']);
  }
}
