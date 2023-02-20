"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:06:08
 * @Description: ******
 */
var EventTarget = /*#__PURE__*/function () {
  function EventTarget() {
    (0, _classCallCheck2.default)(this, EventTarget);
    (0, _defineProperty2.default)(this, "events", {});
    this.events = {};
  }
  (0, _createClass2.default)(EventTarget, [{
    key: "once",
    value: function once(type, handler) {
      var _this = this;
      var onceHandler = function onceHandler(ee) {
        handler(ee);
        _this.off(type, onceHandler);
      };
      this.on(type, onceHandler);
    }
  }, {
    key: "on",
    value: function on(type, handler) {
      var pool = this.events[type] || [];
      pool.push(handler);
      this.events[type] = pool;
    }
  }, {
    key: "off",
    value: function off(type, handler) {
      if (!type) {
        this.events = {};
      } else if (handler) {
        var pool = this.events[type] || [];
        var index = pool.findIndex(function (h) {
          return h === handler;
        });
        if (index !== -1) {
          pool.splice(index, 1);
        }
        this.events[type] = pool;
      } else {
        this.events[type] = [];
      }
    }
  }]);
  return EventTarget;
}();
exports.default = EventTarget;