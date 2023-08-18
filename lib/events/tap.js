"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = tap;
var _buttonPress = _interopRequireDefault(require("./buttonPress"));
var _util = require("../util");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:13:31
 * @Description: ******
 */

function tap(e) {
  var contentEl = this.contentEl,
    leftEl = this.leftEl,
    rightEl = this.rightEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && t !== contentEl && t !== leftEl && t !== rightEl;
  });
  // 触发内容元素按压事件
  if (contentEl && target === contentEl) {
    // 没有使用this._direction判断，是因为该值变化是要动画结束后变化，this._translate变化是动画执行前
    // 使用this._translate判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._direction正好相反
    // 收起时候则触发按压事件，未收起则收起
    if (_translate === 0) {
      this.emit('press', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
  // 触发左边按钮按压事件
  else if (target === leftEl) {
    _buttonPress.default.apply(this, [e, 'left']);
  }
  // 触发右边按钮按压事件
  else if (target === rightEl) {
    _buttonPress.default.apply(this, [e, 'right']);
  }
}