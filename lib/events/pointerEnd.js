"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pointerEnd;
var _transform = require("../transform");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 15:17:58
 * @Description: ******
 */

function pointerEnd(e) {
  var leavePointers = e.leavePointers,
    currentTarget = e.currentTarget;
  // 从抬起的手指中查找
  var pointer = null;
  for (var i = 0; i < leavePointers.length; i++) {
    var p = leavePointers[i];
    if ("".concat(p.identifier) === currentTarget.getAttribute('data-identifier')) {
      pointer = p;
      break;
    }
  }
  // 表示抬起的手指不是主手指
  if (!pointer) {
    return;
  }
  currentTarget.setAttribute('data-identifier', '');
  var currentPoint = pointer.current;
  var leftActions = this.leftActions,
    rightActions = this.rightActions;
  if (!this._isMoving || !this._startPoint || this._startAngle !== 1 || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  this._isMoving = false;
  var startPoint = this._startPoint;
  var delta = currentPoint[0] - startPoint[0];
  // 滑动距离为0（表示本身就是隐藏状态）或没有任何滑动（只是点了一下）不做任何操作
  // 这个判断是因为手势里默认移动距离在3px以内不算移动（手势里是移动距离，这里扩大到x方向距离）
  if (this._translate === 0 || Math.abs(delta) <= 3) {
    return;
  }
  var actions = this._translate > 0 ? leftActions : this._translate < 0 ? rightActions : null;
  if (actions && !actions.disable) {
    // 进行完全覆盖滑出事件
    if (this._overshooting) {
      var index = actions.items.length - 1;
      var item = actions.items[index];
      var translate = this._translate * this._width / Math.abs(this._translate);
      this._translate = translate;
      _transform.transform.apply(this, [translate]);
      this.emit(item.confirm ? 'buttonConfirm' : 'buttonPress', {
        index: index,
        data: item.data,
        currentTarget: item.wrapper,
        timestamp: Date.now(),
        sourceEvent: e
      });
      return;
    }
    // 展开时，滑出的距离不足滑出阈值则不展开
    // 微信是只要往反方向滑就关闭，并且滑出之后，如果继续有弹性滑出，弹性滑出不足阈值也会关闭
    /* if (
      (this._translate > 0 && delta < 0) ||
      (this._translate < 0 && delta > 0) ||
      Math.abs(delta) < actions.threshold
    ) {
      this.hide();
      return;
    } */
    // 苹果是只有反方向滑到阈值之内才会关闭，其他不关闭
    /* if (Math.abs(this._translate) < actions.threshold) {
      this.hide();
      return;
    } */
    // 只要往反方向滑就关闭，其他不关闭
    if (this._translate > 0 && delta < 0 || this._translate < 0 && delta > 0 || Math.abs(this._translate) < actions.threshold) {
      this.hide();
      return;
    }
  }
  // 其它情况均为展示按钮
  this.show(this._translate > 0 ? 'left' : 'right');
}