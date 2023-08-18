/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 15:16:50
 * @Description: ******
 */

import { revokeDamping } from '@huangjs888/damping';
export default function pointerStart(e) {
  const {
    pointers,
    currentTarget
  } = e;
  // data-identifier存在，表示是已经有指点放上去了
  if (currentTarget.getAttribute('data-identifier')) {
    return;
  }
  // 设置第一个为主手指
  const pointer = pointers[0];
  currentTarget.setAttribute('data-identifier', `${pointer.identifier}`);
  const point = pointer.current;
  const {
    leftActions,
    rightActions,
    friction
  } = this;
  if ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  this._isMoving = true;
  this._timestamp = 0;
  this._startAngle = 0;
  // 初始偏移量
  this._startOffset = this._translate;
  // 初始点
  this._startPoint = point;
  // 计算初始taranslate
  const actions = this._translate > 0 ? leftActions : this._translate < 0 ? rightActions : null;
  let startTranslate = 0;
  if (actions && !actions.disable) {
    const {
      overshoot,
      overshootFreeSize,
      width: tWidth
    } = actions;
    // 弹性尺寸临界点
    const criticalTranslate = (overshoot ? Math.min(this._width, Math.max(this._width - overshootFreeSize, tWidth)) : tWidth) * this._translate / Math.abs(this._translate);
    if (Math.abs(this._translate) <= Math.abs(criticalTranslate)) {
      startTranslate = this._translate;
    } else {
      // 恢复_translate的弹性尺寸部分
      startTranslate = revokeDamping(this._translate - criticalTranslate, {
        expo: friction
      }) + criticalTranslate;
    }
  }
  this._startTranslate = startTranslate;
}