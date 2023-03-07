"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _event = _interopRequireDefault(require("./event"));
var _util = require("./util");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var fixOption = function fixOption(value, defaultValue, minVal) {
  return typeof value !== 'number' || value < minVal ? defaultValue : value;
};
function touchstarted(event) {
  var _this = this;
  var touches = event.touches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  // 循环保存放在屏幕上的手指，这里只会保存最多两个，忽略超过三个的手指（只对单指和双指情形处理）
  for (var i = 0, len = touches.length; i < len; ++i) {
    var t = touches[i];
    var p = [t.pageX, t.pageY];
    var touch = [p, p, t.identifier];
    if (!this._touch0) {
      this._touch0 = touch;
    } else if (!this._touch1 && touch[2] !== this._touch0[2]) {
      this._touch1 = touch;
    }
  }
  // 每次进入时先阻止所有单指事件
  this._preventTap = true;
  this._swipeTimeStamp = 0;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 双指start
  if (this._touch1 && this._touch0) {
    this.trigger('gestureStart', {
      currentTarget: this.element,
      point: [this._touch0[0], this._touch1[0]],
      timeStamp: Date.now(),
      sourceEvent: event
    });
  }
  // 单指start
  else if (this._touch0) {
    this._preventTap = false;
    this._swipeTimeStamp = event.timeStamp;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(function () {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      _this._preventTap = true;
      _this._swipeTimeStamp = 0;
      _this._preventSingleTap = true;
      _this._preventDoubleTap = true;
      _this._longTapTimer = null;
      _this.trigger('longTap', {
        currentTarget: _this.element,
        point: _this._touch0 ? [_this._touch0[0]] : [],
        timeStamp: Date.now(),
        sourceEvent: event,
        waitTime: _this.longTapInterval
      });
    }, this.longTapInterval);
    if (this._singleTapTimer && this._touchFirst && (0, _util.getDistance)(this._touchFirst, this._touch0[0]) < this.doubleTapDistance) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指，或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      clearTimeout(this._singleTapTimer);
      this._singleTapTimer = null;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
    } else {
      this._touchFirst = this._touch0[0];
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.trigger('touchStart', {
    currentTarget: this.element,
    point: this._touch1 ? [this._touch0[0], this._touch1[1]] : [this._touch0[0]],
    timeStamp: Date.now(),
    sourceEvent: event
  });
}
function touchmoved(event) {
  var touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  // 循环更新手指
  for (var i = 0, len = touches.length; i < len; ++i) {
    var t = touches[i];
    var p = [t.pageX, t.pageY];
    if (this._touch0 && this._touch0[2] === t.identifier) {
      this._touch0[1] = p;
    } else if (this._touch1 && this._touch1[2] === t.identifier) {
      this._touch1[1] = p;
    }
  }
  // 手指移动至少要有一个手指移动超过touchMoveDistance才会触发移动事件
  if (this._touch0 && (0, _util.getDistance)(this._touch0[0], this._touch0[1]) >= this.touchMoveDistance || this._touch1 && (0, _util.getDistance)(this._touch1[0], this._touch1[1]) >= this.touchMoveDistance) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    if (this._longTapTimer) {
      clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (this._touch1 && this._touch0) {
      // 只有双指滑动时才会触发下面事件
      var distance1 = (0, _util.getDistance)(this._touch0[1], this._touch1[1]);
      var distance0 = (0, _util.getDistance)(this._touch0[0], this._touch1[0]);
      if (distance1 !== 0 && distance0 !== 0) {
        this.trigger('pinch', {
          currentTarget: this.element,
          point: [this._touch0[0], this._touch1[1]],
          timeStamp: Date.now(),
          sourceEvent: event,
          scale: distance1 / distance0 // 可以直接设置css3里transform的scale
        });
      }

      var angle1 = (0, _util.getAngle)(this._touch0[1], this._touch1[1]);
      var angle0 = (0, _util.getAngle)(this._touch0[0], this._touch1[0]);
      this.trigger('rotate', {
        currentTarget: this.element,
        point: [this._touch0[0], this._touch1[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
        angle: angle1 + angle0 // 加和减效果一样，可以直接设置css3里transform的rotate
      });

      var center1 = (0, _util.getCenter)(this._touch0[1], this._touch1[1]);
      var center0 = (0, _util.getCenter)(this._touch0[0], this._touch1[0]);
      this.trigger('multiPan', {
        currentTarget: this.element,
        point: [this._touch0[0], this._touch1[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
        deltaX: center1[0] - center0[0],
        deltaY: center1[1] - center0[1]
      });
      this.trigger('gestureMove', {
        currentTarget: this.element,
        point: [this._touch0[0], this._touch1[1]],
        timeStamp: Date.now(),
        sourceEvent: event
      });
    }
    // 单指移动
    else if (this._touch0) {
      // 触发单指平移事件
      var deltaX = this._touch0[1][0] - this._touch0[0][0];
      var deltaY = this._touch0[1][1] - this._touch0[0][1];
      this.trigger('pan', {
        currentTarget: this.element,
        point: [this._touch0[0]],
        timeStamp: Date.now(),
        sourceEvent: event,
        deltaX: deltaX,
        deltaY: deltaY
      });
    }
    // 无指无移动
    else {
      return;
    }
    this.trigger('touchMove', {
      currentTarget: this.element,
      point: this._touch1 ? [this._touch0[0], this._touch1[1]] : [this._touch0[0]],
      timeStamp: Date.now(),
      sourceEvent: event
    });
  }
}
function touchended(event) {
  var _this2 = this;
  var touches = event.changedTouches;
  if (!touches) {
    return;
  }
  event.stopImmediatePropagation();
  // 临时保存本次
  var touch = null;
  // 循环删除已经拿开的手指
  for (var i = 0, len = touches.length; i < len; ++i) {
    var t = touches[i];
    if (this._touch0 && this._touch0[2] === t.identifier) {
      touch = this._touch0;
      this._touch0 = null;
    } else if (this._touch1 && this._touch1[2] === t.identifier) {
      this._touch1 = null;
    }
  }
  // 双指变单指
  if (this._touch1 && !this._touch0) {
    this._touch0 = this._touch1;
    this._touch1 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 仍然存在至少一根手指
  if (this._touch0) {
    // 只剩下一根在上面了
    if (!this._touch1) {
      // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
      this._touch0[0] = this._touch0[1];
      // 同时可以触发一次start事件
      this.trigger('touchStart', {
        currentTarget: this.element,
        point: [this._touch0[0]],
        timeStamp: Date.now(),
        sourceEvent: event
      });
    }
    this.trigger('gestureEnd', {
      currentTarget: this.element,
      point: [this._touch0[0]],
      timeStamp: Date.now(),
      sourceEvent: event
    });
  }
  // 全部拿开（双指同时抬起，最后一指抬起，仅仅一指抬起）
  else {
    if (!this._preventTap) {
      this.trigger('tap', {
        currentTarget: this.element,
        point: !touch ? [] : [touch[1]],
        timeStamp: Date.now(),
        sourceEvent: event
      });
    }
    if (this._swipeTimeStamp > 0 && touch) {
      var velocity = (0, _util.getVelocity)(event.timeStamp - this._swipeTimeStamp, (0, _util.getDistance)(touch[0], touch[1]));
      // 滑动距离超过swipeDistance并且滑动速率大于swipeVelocity，才触发swipe
      if (velocity >= this.swipeVelocity && (Math.abs(touch[1][0] - touch[0][0]) >= this.swipeDistance || Math.abs(touch[1][1] - touch[0][1]) >= this.swipeDistance)) {
        var direction = (0, _util.getDirection)(touch[0], touch[1]);
        this.trigger('swipe', {
          currentTarget: this.element,
          point: [touch[1]],
          timeStamp: Date.now(),
          sourceEvent: event,
          direction: direction,
          velocity: velocity
        });
      }
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(function () {
        _this2._singleTapTimer = null;
        _this2.trigger('singleTap', {
          currentTarget: _this2.element,
          point: !touch ? [] : [touch[1]],
          timeStamp: Date.now(),
          sourceEvent: event,
          delayTime: _this2.doubleTapInterval
        });
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      this.trigger('doubleTap', {
        currentTarget: this.element,
        point: !touch ? [] : [touch[1]],
        timeStamp: Date.now(),
        sourceEvent: event,
        intervalTime: this.doubleTapInterval
      });
    }
  }
  this.trigger('touchEnd', {
    currentTarget: this.element,
    point: [],
    timeStamp: Date.now(),
    sourceEvent: event
  });
}
function touchcanceled(event) {
  this.trigger('touchCancel', {
    currentTarget: this.element,
    point: [],
    timeStamp: Date.now(),
    sourceEvent: event
  });
  touchended.apply(this, [event]);
}
function scrollcanceled() {
  if (this._singleTapTimer) {
    clearTimeout(this._singleTapTimer);
    this._singleTapTimer = null;
  }
  if (this._longTapTimer) {
    clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  this._touchFirst = null;
  this._touch0 = null;
  this._touch1 = null;
  this._preventTap = true;
  this._swipeTimeStamp = 0;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
}
var Gesture = /*#__PURE__*/function (_EventTarget) {
  (0, _inherits2.default)(Gesture, _EventTarget);
  var _super = _createSuper(Gesture);
  function Gesture(element, options) {
    var _this3;
    (0, _classCallCheck2.default)(this, Gesture);
    _this3 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "longTapInterval", 750);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "doubleTapInterval", 250);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "doubleTapDistance", 10);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "touchMoveDistance", 3);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "swipeDistance", 30);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "swipeVelocity", 0.3);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_singleTapTimer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_longTapTimer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_preventTap", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_swipeTimeStamp", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_preventSingleTap", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_preventDoubleTap", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_touchFirst", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_touch0", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_touch1", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_destory", null);
    var tempElement;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    _this3.element = tempElement;
    var _ref = options || {},
      longTapInterval = _ref.longTapInterval,
      doubleTapInterval = _ref.doubleTapInterval,
      doubleTapDistance = _ref.doubleTapDistance,
      touchMoveDistance = _ref.touchMoveDistance,
      swipeDistance = _ref.swipeDistance,
      swipeVelocity = _ref.swipeVelocity;
    _this3.longTapInterval = fixOption(longTapInterval, 750, 500);
    _this3.doubleTapInterval = fixOption(doubleTapInterval, 250, 200);
    _this3.doubleTapDistance = fixOption(doubleTapDistance, 10, 1);
    _this3.touchMoveDistance = fixOption(touchMoveDistance, 3, 0);
    _this3.swipeDistance = fixOption(swipeDistance, 30, 0);
    _this3.swipeVelocity = fixOption(swipeVelocity, 0.3, 0.01);
    // 注册触摸事件
    if ((0, _util.isTouchable)(_this3.element)) {
      var started = touchstarted.bind((0, _assertThisInitialized2.default)(_this3));
      var moved = touchmoved.bind((0, _assertThisInitialized2.default)(_this3));
      var ended = touchended.bind((0, _assertThisInitialized2.default)(_this3));
      var canceled = touchcanceled.bind((0, _assertThisInitialized2.default)(_this3));
      _this3.element.addEventListener('touchstart', started, false);
      _this3.element.addEventListener('touchmove', moved, false);
      _this3.element.addEventListener('touchend', ended, false);
      _this3.element.addEventListener('touchcancel', canceled, false);
      var scrolled = scrollcanceled.bind((0, _assertThisInitialized2.default)(_this3));
      window.addEventListener('scroll', scrolled);
      _this3._destory = function () {
        _this3.element.removeEventListener('touchstart', started);
        _this3.element.removeEventListener('touchmove', moved);
        _this3.element.removeEventListener('touchend', ended);
        _this3.element.removeEventListener('touchcancel', canceled);
        window.removeEventListener('scroll', scrolled);
      };
    }
    return _this3;
  }
  (0, _createClass2.default)(Gesture, [{
    key: "done",
    value: function done() {
      return !!this._destory;
    }
  }, {
    key: "destory",
    value: function destory() {
      // 解除所有事件
      (0, _get2.default)((0, _getPrototypeOf2.default)(Gesture.prototype), "off", this).call(this);
      scrollcanceled.apply(this);
      // 解除手势事件
      if (this._destory) {
        this._destory();
        this._destory = null;
      }
    }
  }]);
  return Gesture;
}(_event.default);
var _default = Gesture;
exports.default = _default;