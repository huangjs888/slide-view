/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:50:29
 * @Description: ******
 */

import { findTarget } from '../util';
export default function doubleTap(e) {
  const {
    contentEl,
    _translate
  } = this;
  const {
    sourceEvent,
    currentTarget
  } = e;
  const target = findTarget(sourceEvent, t => t !== currentTarget && t !== contentEl);
  // 触发内容双按压事件
  if (contentEl && target === contentEl) {
    // 收起时候则触发双按事件，未收起则收起
    if (_translate === 0) {
      this.emit('doublePress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
}