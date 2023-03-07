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
 * @LastEditTime: 2023-03-07 13:48:11
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
      var onceHandler = function onceHandler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        handler.apply(_this, args);
        _this.off(type, onceHandler);
      };
      this.on(type, onceHandler);
    }
  }, {
    key: "on",
    value: function on(type, handler) {
      var eventPool = this.events[type] || [];
      eventPool.push(handler);
      this.events[type] = eventPool;
    }
  }, {
    key: "off",
    value: function off(type, handler) {
      if (!type) {
        this.events = {};
      } else if (handler) {
        var eventPool = this.events[type] || [];
        for (var i = eventPool.length; i >= 0; i--) {
          if (eventPool[i] === handler) {
            eventPool.splice(i, 1);
          }
        }
        this.events[type] = eventPool;
      } else {
        this.events[type] = [];
      }
    }
  }, {
    key: "trigger",
    value: function trigger(type, event) {
      var eventPool = this.events[type] || [];
      for (var i = 0, len = eventPool.length; i < len; i++) {
        var handler = eventPool[i];
        if (typeof handler === 'function') {
          handler.apply(event.currentTarget, [event, type]);
        }
      }
    }
  }]);
  return EventTarget;
}();
exports.default = EventTarget;