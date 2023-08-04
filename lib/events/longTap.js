"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = longTap;
var _util = require("../util");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:50:35
 * @Description: ******
 */

function longTap(e) {
  var contentEl = this.contentEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && t !== contentEl;
  });
  // 触发内容双按压事件
  if (contentEl && target === contentEl) {
    // 收起时候则触发长按事件，未收起则收起
    if (_translate === 0) {
      this.emit('longPress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
}