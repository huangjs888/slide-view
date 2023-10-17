/*
 * @Author: Huangjs
 * @Date: 2023-10-13 09:23:15
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-13 09:31:12
 * @Description: ******
 */

import { type IGestureEvent } from '@huangjs888/gesture';
import type SlideView from '../slideview';
import { findTarget } from '../util';

export default function longTap(this: SlideView, e: IGestureEvent) {
  const { element, contentEl, _translate } = this;
  const { sourceEvent } = e;
  const target = findTarget(sourceEvent, (t) => t !== element && t !== contentEl);
  // 触发内容双按压事件
  if (contentEl && target === contentEl) {
    // 收起时候则触发长按事件，未收起则收起
    if (_translate === 0) {
      this.emit('longPress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e,
      });
    } else {
      this.hide();
    }
  }
}
