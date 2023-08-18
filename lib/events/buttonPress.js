"use strict";

exports.__esModule = true;
exports.default = buttonPress;
var _index = require("./index");
var _transform = require("../transform");
var _overshoot = require("../overshoot");
var _confirm = require("../confirm");
var _util = require("../util");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:10:02
 * @Description: ******
 */

function buttonPress(event, direction) {
  var _this = this;
  var element = this.element,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    rebounce = this.rebounce;
  if (this._translate === 0 || !element || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var sourceEvent = event.sourceEvent,
    currentTarget = event.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && !t.getAttribute('data-index');
  });
  var index = +(target.getAttribute('data-index') || -1);
  var actions = direction === 'left' ? leftActions : rightActions;
  if (index < 0 || !actions || actions.disable) {
    return;
  }
  var elWidth = this._width;
  var factor = this._translate / Math.abs(this._translate);
  var confirm = {
    index: index,
    direction: direction
  };
  var item = actions.items[index];
  var overshoot = index === actions.items.length - 1 && actions.overshoot;
  var eventType = 'buttonPress';
  if (this._confirming && this._confirming.index === index && this._confirming.direction === direction) {
    if (overshoot) {
      (0, _confirm.confirmStyle)(item);
      this._confirming = null;
    } else {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (item.collapse) {
        this.hide();
      } else {
        // 取消确认
        (0, _util.setStyle)(item.element, {
          width: ''
        });
        _transform.cTransform.apply(this, [confirm]);
        (0, _confirm.confirmStyle)(item);
        this._confirming = null;
      }
    }
  } else {
    if (overshoot) {
      if (!this._overshooting) {
        this._overshooting = true;
        var translate = factor * elWidth;
        this._translate = translate;
        _transform.transform.apply(this, [translate]);
        _overshoot.overshootChange.apply(this, [actions]);
      }
      if (item.confirm) {
        this._confirming = confirm;
        (0, _confirm.confirmStyle)(item, true);
        eventType = 'buttonConfirm';
      }
    } else {
      if (item.confirm) {
        // 如果是仅有一个按钮，确认的时候宽度设置2倍变化，但是不能超过最大宽度
        var _translate = this._translate;
        if (actions.items.length === 1) {
          _translate = Math.min(Math.abs(2 * _translate), elWidth) * factor;
        }
        // 设置回弹效果，第一个按钮没有
        if (rebounce > 0 && index !== 0 /*  &&
                                        parseFloat(window.getComputedStyle(item.wrapper, null).width) ===
                                        elWidth */) {
          (0, _index.onOnceTransitionEnd)(item.wrapper, function () {
            // 该事件执行时确保当前还处于确认状态，否则不能再执行
            if (_this._confirming && _this._confirming.index === confirm.index && _this._confirming.direction === confirm.direction) {
              _transform.cTransform.apply(_this, [confirm, _translate]);
            }
          });
          _transform.cTransform.apply(this, [confirm, _translate + rebounce * _translate / Math.abs(_translate)]);
        } else {
          _transform.cTransform.apply(this, [confirm, _translate]);
        }
        (0, _util.setStyle)(item.wrapper, {
          width: ''
        });
        (0, _util.setStyle)(item.element, {
          width: Math.abs(_translate)
        });
        this._confirming = confirm;
        (0, _confirm.confirmStyle)(item, true);
        eventType = 'buttonConfirm';
      } else {
        // 无需确认的点击（如果collapse，就点击后隐藏按钮，否则不做任何处理）
        if (item.collapse) {
          this.hide();
        }
      }
    }
  }
  this.emit(eventType, {
    index: index,
    data: item.data,
    currentTarget: target,
    timestamp: Date.now(),
    sourceEvent: event
  });
}