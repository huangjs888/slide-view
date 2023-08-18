"use strict";

exports.__esModule = true;
exports.default = pointerMove;
var _damping = require("@huangjs888/damping");
var _transform = require("../transform");
var _overshoot = require("../overshoot");
var _confirm = require("../confirm");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 15:37:44
 * @Description: ******
 */

function pointerMove(e) {
  var pointers = e.pointers,
    currentTarget = e.currentTarget;
  // 找出变化（移动）的手指
  var pointer = null;
  for (var i = 0; i < pointers.length; i++) {
    var p = pointers[i];
    // 当前这个是主手指，并且这个手指在变化（移动）
    if (p.changed && "" + p.identifier === currentTarget.getAttribute('data-identifier')) {
      pointer = p;
      break;
    }
  }
  // 没找到主手指
  if (!pointer) {
    return;
  }
  var currentPoint = pointer.current;
  var leftActions = this.leftActions,
    rightActions = this.rightActions,
    friction = this.friction;
  if (!this._isMoving || !this._startPoint || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var currentX = currentPoint[0] - this._startPoint[0];
  var currentY = currentPoint[1] - this._startPoint[1];
  if (this._startAngle === 0) {
    // 只在第一次移动事件的时候进行计算
    // 根据xy的长短来判断移动角度与45度的关系
    this._startAngle = Math.abs(currentX) - Math.abs(currentY) <= 0 ? -1 : 1;
  }
  // 只有角度小于45度(_startAngle为1)，才会开始移动
  // 只会在第一次触发的时候判断，后续如果移动过程中角度变化，则不会判断，会继续往下走
  // 这个判断是因为手势里默认移动距离在3px以内不算移动（手势里是移动距离，这里扩大到x方向距离）
  if (this._startAngle !== 1 || Math.abs(currentX) <= 3) {
    return;
  }
  // 滑动距离
  var translate = 0;
  var duration = 0;
  var currentTranslate = this._startTranslate + currentX;
  var actions = currentTranslate > 0 ? leftActions : currentTranslate < 0 ? rightActions : null;
  if (actions && !actions.disable) {
    var overshoot = actions.overshoot,
      overshootEdgeSize = actions.overshootEdgeSize,
      overshootFreeSize = actions.overshootFreeSize,
      tWidth = actions.width;
    var factor = currentTranslate / Math.abs(currentTranslate);
    var oaSize = factor * tWidth;
    var otSize = factor * Math.min(this._width, Math.max(this._width - overshootFreeSize, tWidth));
    var oeSize = factor * Math.min(this._width * 0.5, Math.max(0, overshootEdgeSize));
    // 可以overshoot的情况处理
    if (overshoot) {
      if (Math.abs(currentTranslate) < Math.abs(otSize)) {
        // 如果手指从容器一半之外开始移动，只要手指移动到接近边缘，就可以overshoot
        var deltaSize = 0;
        var moveEdge = false;
        var currentOffset = currentPoint[0] - this._offset;
        var startOffset = this._startPoint[0] - this._offset - this._startOffset;
        var maxOffset = this._width * 0.5;
        if (currentTranslate < 0) {
          deltaSize = currentOffset - Math.abs(oeSize);
          moveEdge = startOffset > maxOffset && deltaSize < 0;
        } else {
          deltaSize = currentOffset - (this._width - Math.abs(oeSize));
          moveEdge = startOffset < maxOffset && deltaSize > 0;
        }
        if (moveEdge) {
          currentTranslate = otSize + deltaSize;
          // 此时要重置初始点和初始translate
          this._startPoint = currentPoint;
          this._startTranslate = currentTranslate;
        }
      }
      var timestamp = Date.now();
      // currentTranslate和otSize一定是同正或同负，直接比较数值大小，即currentTranslate超出otSize范围
      if (Math.abs(currentTranslate) >= Math.abs(otSize)) {
        if (!this._overshooting) {
          this._timestamp = timestamp;
          this._overshooting = true;
          _overshoot.overshootChange.apply(this, [actions]);
          var index = actions.items.length - 1;
          var item = actions.items[index];
          if (item.confirm) {
            (0, _confirm.confirmStyle)(item, true);
            this._confirming = {
              index: index,
              direction: factor > 0 ? 'left' : 'right'
            };
          }
        }
        translate = (0, _damping.performDamping)(currentTranslate - otSize, {
          expo: friction
        }) + otSize;
        duration = Math.max(0, this.duration - (timestamp - this._timestamp) / 1000);
      } else {
        if (this._overshooting) {
          this._timestamp = timestamp;
          this._overshooting = false;
          _overshoot.overshootChange.apply(this, [actions]);
          var _index = actions.items.length - 1;
          var _item = actions.items[_index];
          if (_item.confirm) {
            (0, _confirm.confirmStyle)(_item);
            this._confirming = null;
          }
        }
        translate = currentTranslate;
        duration = Math.max(0, this.duration / 2 - (timestamp - this._timestamp) / 1000);
      }
    } else {
      // 不能overshoot的情况，按钮显示超出总宽度，则进行弹性尺寸
      // currentTranslate和oaSize一定是同正或同负，直接比较数值大小，即currentTranslate超出oaSize范围
      if (Math.abs(currentTranslate) >= Math.abs(oaSize)) {
        translate = (0, _damping.performDamping)(currentTranslate - oaSize, {
          expo: friction
        }) + oaSize;
      } else {
        translate = currentTranslate;
      }
    }
    translate = Math.min(this._width, Math.max(-this._width, translate));
  } else {
    // 如果不存在或按钮被禁用，则不断更新初始点和初始translate
    this._startPoint = currentPoint;
    this._startTranslate = 0;
    translate = 0;
  }
  this._translate = translate;
  _transform.transform.apply(this, [translate, duration]);
  if (!this._overshooting) {
    _confirm.confirmCancel.apply(this, []);
  }
  return;
}