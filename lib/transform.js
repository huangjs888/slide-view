"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.transform = exports.cTransform = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _util = require("./util");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:19:55
 * @Description: ******
 */

var cTransform = function cTransform(confirm, translate) {
  var _this = this;
  if (translate === void 0) {
    translate = 0;
  }
  var contentEl = this.contentEl,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    duration = this.duration,
    timing = this.timing;
  if (!contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var transition = duration <= 0 ? '' : "transform " + duration + "s " + timing + " 0s";
  var index = confirm.index,
    direction = confirm.direction;
  // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translate等于0了，所以无需再判断
  var factor = this._translate === 0 ? 0 : this._translate / Math.abs(this._translate);
  var aTransform = function aTransform(_ref) {
    var style = _ref.style,
      items = _ref.items;
    var delta = 0;
    if (style === 'drawer') {
      delta = -_this._translate;
    }
    // 前面已有按钮的占比距离
    var transformTotal = 0;
    for (var i = items.length - 1; i >= 0; i--) {
      var _items$i = items[i],
        wrapper = _items$i.wrapper,
        width = _items$i.width,
        gap = _items$i.gap;
      if (items.length === 1) {
        // 如果是仅有一个按钮，确认的时候设置2倍变化
        (0, _util.setStyle)(contentEl, {
          transform: "translate3d(" + (translate !== 0 ? translate : _this._translate) + "px, 0, 0)",
          transition: transition
        });
      }
      if (i === index) {
        var transformx = 0;
        if (translate !== 0) {
          transformx = translate;
        } else {
          transformx = (width + gap[1] + transformTotal) * factor;
        }
        (0, _util.setStyle)(wrapper, {
          transform: "translate3d(" + (transformx + delta) + "px, 0, 0)",
          transition: transition
        });
      } else if (i > index) {
        var _transformx = 0;
        if (translate === 0) {
          _transformx = (width + gap[1] + transformTotal) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        (0, _util.setStyle)(wrapper, {
          transform: "translate3d(" + (_transformx + delta) + "px, 0, 0)",
          transition: transition
        });
      }
      transformTotal += width + gap[0] + gap[1];
    }
  };
  if (direction === 'left' && leftActions && !leftActions.disable) {
    aTransform(leftActions);
  }
  if (direction === 'right' && rightActions && !rightActions.disable) {
    aTransform(rightActions);
  }
};
exports.cTransform = cTransform;
var transform = function transform(translate, duration) {
  var _this2 = this;
  if (duration === void 0) {
    duration = this.duration;
  }
  var leftEl = this.leftEl,
    rightEl = this.rightEl,
    contentEl = this.contentEl,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    timing = this.timing;
  if (!leftEl || !rightEl || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var factor = 0;
  var transition = duration <= 0 ? '' : "transform " + duration + "s " + timing + " 0s";
  var wTransition = duration <= 0 ? '' : "width " + duration + "s " + timing + " 0s, transform " + duration + "s " + timing + " 0s";
  var aTransform = function aTransform(_ref2) {
    var style = _ref2.style,
      items = _ref2.items,
      element = _ref2.element,
      tWidth = _ref2.width,
      tGap = _ref2.gap;
    var styleObj = {};
    var xMove = translate;
    var delta = 0;
    if (style === 'drawer') {
      (0, _util.setStyle)(element, {
        width: Math.max(Math.abs(translate), tWidth),
        transform: "translate3d(" + translate + "px, 0, 0)",
        transition: wTransition
      });
      xMove = factor * Math.max(tWidth, Math.abs(translate));
      delta = -translate;
    }
    // 前面已有按钮的占比距离
    var transformTotal = 0;
    var len = items.length - 1;
    for (var i = len; i >= 0; i--) {
      var _items$i2 = items[i],
        wrapper = _items$i2.wrapper,
        width = _items$i2.width,
        gap = _items$i2.gap,
        fixedGap = _items$i2.fixedGap;
      // 当前按钮需要滑出的占比距离
      var transformw = width / (tWidth - tGap) * (xMove - factor * tGap);
      var transformb = transformw + factor * gap[1];
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      var transformx = transformb + transformTotal;
      if (fixedGap && wrapper.style.width !== '100%') {
        // 只有width不为100%时才设置具体宽度，因为overshoot的时候需要设置100%
        styleObj = {
          width: Math.max(Math.abs(transformw), width),
          transition: wTransition
        };
      }
      // 左边或右边的最后一个按钮
      (0, _util.setStyle)(wrapper, (0, _extends2.default)({
        transform: "translate3d(" + ((i === len && _this2._overshooting ? translate : transformx) + delta) + "px, 0, 0)",
        transition: transition
      }, styleObj));
      // 累计已滑出按钮的占比距离
      transformTotal += transformb + factor * gap[0];
    }
  };
  // move事件发生，放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(function () {
    (0, _util.setStyle)(contentEl, {
      transform: "translate3d(" + translate + "px, 0, 0)",
      transition: transition
    });
    // 这里是左右都进行变换，还是说根据translate的正负来判断只变换某一边的呢（因为另一边处于隐藏状态无需变换耗能）？
    // 答案是都要进行变换，因为存在一种情况，即滑动太快，left的translate还未走到0（没有完全收起），下一把就right了。
    if (leftActions && !leftActions.disable) {
      factor = 1;
      aTransform(leftActions);
    }
    if (rightActions && !rightActions.disable) {
      factor = -1;
      aTransform(rightActions);
    }
  });
};
exports.transform = transform;