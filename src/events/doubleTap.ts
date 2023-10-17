/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-13 09:32:18
 * @Description: ******
 */

import { type IGestureEvent } from '@huangjs888/gesture';
import type SlideView from '../slideview';
import { findTarget } from '../util';

export default function doubleTap(this: SlideView, e: IGestureEvent) {
  const { element, contentEl, _translate } = this;
  const { sourceEvent } = e;
  const target = findTarget(sourceEvent, (t) => t !== element && t !== contentEl);
  // 触发内容双按压事件
  if (contentEl && target === contentEl) {
    // 收起时候则触发双按事件，未收起则收起
    if (_translate === 0) {
      this.emit('doublePress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e,
      });
    } else {
      this.hide();
    }
  }
}
