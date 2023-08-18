"use strict";

exports.__esModule = true;
exports.overshootChange = void 0;
var _util = require("./util");
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:08:44
 * @Description: ******
 */

var overshootChange = function overshootChange(actions) {
  if (actions && !actions.disable) {
    var item = actions.items[actions.items.length - 1];
    (0, _util.setStyle)(item.wrapper, {
      width: this._overshooting ? '100%' : ''
    });
  }
};
exports.overshootChange = overshootChange;