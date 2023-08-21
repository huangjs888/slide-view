(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SlideView"] = factory();
	else
		root["SlideView"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@huangjs888/damping/es/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@huangjs888/damping/es/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   performDamping: function() { return /* binding */ performDamping; },
/* harmony export */   revokeDamping: function() { return /* binding */ revokeDamping; }
/* harmony export */ });
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 14:59:57
 * @Description: ******
 */

function damping(value, max, expo, revoke) {
  if (revoke === void 0) {
    revoke = false;
  }
  if (value < 1 || max < 1 ||
  // 反算的时候value必须小于max
  revoke && value > max || expo <= 0 || expo > 1) {
    return value;
  }
  if (revoke) {
    return Math.pow((max - 1) * value / (max - value), 1 / expo);
  }
  return max / (1 + (max - 1) / Math.pow(value, expo));
}
// 阻尼值
function performDamping(value, option) {
  if (option === void 0) {
    option = {};
  }
  if (value === 0) {
    return 0;
  }
  var _option = option,
    _option$max = _option.max,
    max = _option$max === void 0 ? 9999 : _option$max,
    _option$mode = _option.mode,
    mode = _option$mode === void 0 ? 0 : _option$mode,
    _option$expo = _option.expo,
    expo = _option$expo === void 0 ? 0.88 : _option$expo;
  var _value = Math.abs(value);
  if (_value < 1) {
    if (mode === 1) {
      // 倒数模式
      _value = 1 / damping(1 / _value, max, expo);
    } else {
      // 加1模式
      _value = damping(_value + 1, max, expo) - 1;
    }
  } else {
    _value = damping(_value, max, expo);
  }
  return _value * (value > 0 ? 1 : -1);
}
// 阻尼原值
function revokeDamping(value, option) {
  if (option === void 0) {
    option = {};
  }
  if (value === 0) {
    return 0;
  }
  var _option2 = option,
    _option2$max = _option2.max,
    max = _option2$max === void 0 ? 9999 : _option2$max,
    _option2$mode = _option2.mode,
    mode = _option2$mode === void 0 ? 0 : _option2$mode,
    _option2$expo = _option2.expo,
    expo = _option2$expo === void 0 ? 0.88 : _option2$expo;
  var _value = Math.abs(value);
  if (_value < 1) {
    if (mode === 1) {
      // 倒数模式
      _value = 1 / damping(1 / _value, max, expo, true);
    } else {
      // 加1模式
      _value = damping(_value + 1, max, expo, true) - 1;
    }
  } else {
    _value = damping(_value, max, expo, true);
  }
  return _value * (value > 0 ? 1 : -1);
}

/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/event.js":
/*!******************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/event.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ EventTarget; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/splice */ "./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0__);

/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 11:33:48
 * @Description: ******
 */
var EventTarget = /*#__PURE__*/function () {
  function EventTarget() {
    this.events = {};
    this.events = {};
  }
  var _proto = EventTarget.prototype;
  _proto.one = function one(type, handler, single) {
    var _this = this;
    var onceHandler = typeof handler === 'function' ? function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 该事件只执行一次，执行完就解除事件
      handler.apply(null, args);
      _this.off(type, onceHandler, single);
    } : handler;
    this.on(type, onceHandler, single);
  };
  _proto.on = function on(type, handler, single) {
    var events = this.events[type] || {
      pool: [],
      single: -1
    };
    if (typeof handler === 'function') {
      if (single) {
        // 该事件只能注册一次，每次注册都会替换上次注册的，类似于dom属性事件赋值注册比如element.onclick = ()=>{}
        if (events.single === -1) {
          // 记录该单独事件在所有事件的位置
          events.single = events.pool.push(handler) - 1;
        } else {
          events.pool[events.single] = handler;
        }
      } else {
        // 该事件可以注册多次，执行时，会遍历全部事件全部执行，类似于dom的addEventListener
        // 注册进去之前会检查是否有相同的处理程序，如果有，则不再添加（独立程序不参与）
        var unregistered = true;
        for (var i = 0, len = events.pool.length; i < len; i++) {
          if (events.pool[i] === handler && i !== events.single) {
            unregistered = false;
            break;
          }
        }
        if (unregistered) {
          events.pool.push(handler);
        }
      }
    } else if (single && events.single !== -1) {
      var _context;
      // 需要把独立事件删除，相当于解绑独立事件
      _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default()(_context = events.pool).call(_context, events.single, 1);
      events.single = -1;
    }
    this.events[type] = events;
  };
  _proto.off = function off(type, handler, single) {
    if (typeof type === 'undefined') {
      // 没有type则删除全部事件
      this.events = {};
    } else if (typeof handler === 'undefined') {
      // 删除type下的所有事件
      delete this.events[type];
    } else if (single) {
      var events = this.events[type];
      if (events && events.single !== -1) {
        var _context2;
        // 删除独立程序事件
        _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default()(_context2 = events.pool).call(_context2, events.single, 1);
        events.single = -1;
      }
    } else {
      var _events = this.events[type];
      if (_events) {
        // 检查并删除事件池内事件
        for (var i = _events.pool.length - 1; i >= 0; i--) {
          if (_events.pool[i] === handler && i !== _events.single) {
            var _context3;
            _babel_runtime_corejs3_core_js_instance_splice__WEBPACK_IMPORTED_MODULE_0___default()(_context3 = _events.pool).call(_context3, i, 1);
            // 因为相同事件只会有一个，所以删除后不需要再检查了
            break;
          }
        }
      }
    }
  };
  _proto.emit = function emit(type, event) {
    var events = this.events[type];
    if (events) {
      // 循环执行事件池里的事件
      for (var i = 0, len = events.pool.length; i < len; i++) {
        var handler = events.pool[i];
        if (typeof handler === 'function') {
          var immediatePropagation = handler.apply(null, [event, type]);
          // 返回值为false，则阻止后于该事件注册的同类型事件触发
          if (immediatePropagation === false) {
            break;
          }
        }
      }
    }
  };
  return EventTarget;
}();


/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/gesture.js":
/*!********************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/gesture.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/assertThisInitialized */ "./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/inheritsLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./node_modules/@huangjs888/gesture/es/event.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./node_modules/@huangjs888/gesture/es/util.js");


/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 15:13:10
 * @Description: ******
 */



function started(event) {
  var _this = this;
  var _getEventPoints = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEventPoints)(event, true),
    points = _getEventPoints.points,
    isFirst = _getEventPoints.isFirst;
  if (!points) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  // 表示第一次放入手指（点）
  if (isFirst) {
    // 第一次点击，如果存在wheel没执行，需要执行掉
    if (this._wheelTimerEnd) {
      window.clearTimeout(this._wheelTimerEnd.timer);
      this._wheelTimerEnd.wheelEnd();
      this._wheelTimerEnd = null;
    }
    this._pointer0 = null;
    this._pointer1 = null;
  } else {
    if (this._pointer0) {
      this._pointer0.changed = false;
    }
    if (this._pointer1) {
      this._pointer1.changed = false;
    }
  }
  // 如果当前事件元素之外的屏幕上有手指（点），此时在事件元素上放一个手指（点），points会包含该手指（点）
  // 循环保存放在屏幕上的手指（点），这里只会保存最多两个，忽略超过三个的手指（点）（只对单指和双指情形处理）
  for (var i = 0, len = points.length; i < len; ++i) {
    var t = points[i];
    var p = [t.pageX, t.pageY];
    var pointer = {
      start: p,
      previous: p,
      current: p,
      identifier: t.identifier,
      changed: true
    };
    if (!this._pointer0) {
      this._pointer0 = pointer;
    } else if (!this._pointer1 && this._pointer0.identifier !== t.identifier) {
      this._pointer1 = pointer;
    }
  }
  // 每次进入时先阻止所有单指事件
  this._preventTap = true;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
  this._swipePoints = null;
  this._rotateAngle = 0;
  if (this._longTapTimer) {
    window.clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 双指start
  var pointer0 = this._pointer0;
  var pointer1 = this._pointer1;
  if (pointer1 && pointer0) {
    this._firstPointer = null;
    newEvent.pointers = [pointer0, pointer1];
    newEvent.getPoint = function () {
      return (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.current, pointer1.current);
    };
    this.emit('gestureStart', newEvent);
  }
  // 单指start
  else if (pointer0) {
    newEvent.pointers = [pointer0];
    newEvent.getPoint = function () {
      return pointer0.current;
    };
    this._preventTap = false;
    // 设置一个长按定时器
    this._longTapTimer = window.setTimeout(function () {
      // 当前点击一旦长按超过longTapInterval则触发longTap，则松开后不会再触发所有单指事件
      _this._preventTap = true;
      _this._preventSingleTap = true;
      _this._preventDoubleTap = true;
      _this._longTapTimer = null;
      _this._firstPointer = null;
      newEvent.waitTime = _this.longTapInterval;
      _this.emit('longTap', newEvent);
    }, this.longTapInterval);
    var firstPointer = this._firstPointer;
    var singleTapTimer = this._singleTapTimer;
    if (singleTapTimer && firstPointer && (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(firstPointer.current, pointer0.current) < this.doubleTapDistance) {
      // 1，只要连续两次点击时间在doubleTapInterval之内，距离在doubleTapDistance内，无论第二次作何操作，都不会触发第一次的singleTap，但第一次的tap会触发
      // 2，如果满足第一条时，第二次的点击有多根手指（点），或者长按触发longTap，则不会再触发doubleTap，第二次的tap，singleTap也不会触发
      window.clearTimeout(singleTapTimer);
      this._singleTapTimer = null;
      this._preventSingleTap = true;
      this._preventDoubleTap = false;
      newEvent.getPoint = function () {
        return firstPointer.current;
      };
    } else {
      this._firstPointer = pointer0;
      // 表示是第一次点击或该次点击距离上一次点击时间超过doubleTapInterval，距离超过doubleTapDistance
      this._preventSingleTap = false;
      this._preventDoubleTap = true;
    }
  }
  // 无指没有start
  else {
    return;
  }
  this.emit('pointerStart', newEvent);
}
function moved(event) {
  var _getEventPoints2 = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEventPoints)(event),
    points = _getEventPoints2.points;
  if (!points) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  if (this._pointer0) {
    this._pointer0.changed = false;
  }
  if (this._pointer1) {
    this._pointer1.changed = false;
  }
  // 循环更新手指（点）
  for (var i = 0, len = points.length; i < len; ++i) {
    var t = points[i];
    var p = [t.pageX, t.pageY];
    if (this._pointer0 && this._pointer0.identifier === t.identifier) {
      this._pointer0.changed = true;
      this._pointer0.previous = this._pointer0.current;
      this._pointer0.current = p;
    } else if (this._pointer1 && this._pointer1.identifier === t.identifier) {
      this._pointer1.changed = true;
      this._pointer1.previous = this._pointer1.current;
      this._pointer1.current = p;
    }
  }
  // 手指（点）移动至少要有一个手指（点）移动超过touchMoveDistance才会触发移动事件

  var pointer0 = this._pointer0;
  var pointer1 = this._pointer1;
  if (pointer0 && (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(pointer0.start, pointer0.current) > this.touchMoveDistance || pointer1 && (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(pointer1.start, pointer1.current) > this.touchMoveDistance) {
    // 一旦移动，则阻止所有单指点击相关事件（除了swipe）
    this._preventTap = true;
    this._preventSingleTap = true;
    this._preventDoubleTap = true;
    this._firstPointer = null;
    if (this._longTapTimer) {
      window.clearTimeout(this._longTapTimer);
      this._longTapTimer = null;
    }
    // 双指移动情况
    if (pointer1 && pointer0) {
      newEvent.pointers = [pointer0, pointer1];
      var start0 = pointer0.start,
        previous0 = pointer0.previous,
        current0 = pointer0.current;
      var start1 = pointer1.start,
        previous1 = pointer1.previous,
        current1 = pointer1.current;
      // 双指平移
      var eCenter = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(current0, current1);
      var mCenter = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(previous0, previous1);
      var sCenter = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(start0, start1);
      newEvent.getPoint = function (whichOne) {
        return whichOne === 'start' ? sCenter : whichOne === 'previous' ? mCenter : eCenter;
      };
      newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(mCenter, eCenter);
      newEvent.moveDirection = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(sCenter, eCenter);
      newEvent.deltaX = eCenter[0] - mCenter[0];
      newEvent.moveX = eCenter[0] - sCenter[0];
      newEvent.deltaY = eCenter[1] - mCenter[1];
      newEvent.moveY = eCenter[1] - sCenter[1];
      // 只有双指滑动时才会触发下面事件
      var eDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(current0, current1);
      var mDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(previous0, previous1);
      var sDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(start0, start1);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        // 双指缩放
        newEvent.scale = eDistance / mDistance;
        newEvent.moveScale = eDistance / sDistance;
      }
      var eAngle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getAngle)(current0, current1);
      var mAngle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getAngle)(previous0, previous1);
      // const sAngle = getAngle(start0, start1);
      // 这里计算的三个angle均是向量（第一个参数为起点，第二个为终点）与x正半轴之间的夹角
      // 方向朝向y轴正半轴的为正值[0,180]，朝向y轴负半轴的为负值[-180,0]
      // 注意，这里坐标轴是页面坐标，x轴向右正方向，y轴向下正方向，原点在左上角
      var angle = eAngle - mAngle;
      if (angle < -180) {
        // 此种情况属于顺时针转动时mAngle突然由正变为负值（比如由178度顺时针旋转4度都-178度）
        // 这种情况，因为eAngle和mAngle是两次相邻的移动事件，间隔角度很小（4度）而不会是很大的（-356度）
        angle += 360;
      } else if (angle > 180) {
        // 和上面相反逆时针转动（比如由-178逆时针旋转4度到178）
        angle -= 360;
      }
      // 双指旋转本次和上一次的角度，正值顺时针，负值逆时针
      newEvent.angle = angle;
      // 双指旋转起点到终点的总旋转角度，正值顺时针，负值逆时针
      // 这里不能直接使用eAngle-sAngle，否则顺逆时针分不清，需要通过angle累加
      this._rotateAngle += angle;
      newEvent.moveAngle = this._rotateAngle;
      this.emit('rotate', newEvent);
      if (sDistance > 0 && eDistance > 0 && mDistance > 0) {
        this.emit('scale', newEvent);
      }
      this.emit('multiPan', newEvent);
      this.emit('gestureMove', newEvent);
    }
    // 单指移动
    else if (pointer0) {
      newEvent.pointers = [pointer0];
      var start = pointer0.start,
        previous = pointer0.previous,
        current = pointer0.current;
      newEvent.getPoint = function (whichOne) {
        return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
      };
      newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(previous, current);
      newEvent.moveDirection = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(start, current);
      newEvent.deltaX = current[0] - previous[0];
      newEvent.moveX = current[0] - start[0];
      newEvent.deltaY = current[1] - previous[1];
      newEvent.moveY = current[1] - start[1];
      var _timestamp = Date.now();
      // 第一次移动this._swipePoints为null
      var _swipePoints = this._swipePoints || [[], []];
      var _duration = _timestamp - ((_swipePoints[1][0] ? _swipePoints[1][0].timestamp : 0) || 0);
      // 当前时间与本阶段初始时间之差大于计入swipe的时间(swipeDuration)，则本阶段过时，下阶段开启
      if (_duration > this.swipeDuration) {
        // 将本阶段作为上一阶段，开启下一阶段作为本阶段
        _swipePoints[0] = _swipePoints[1];
        _swipePoints[1] = [];
      }
      // 将当前移动点和时间存入本阶段
      _swipePoints[1].push({
        point: current,
        timestamp: _timestamp
      });
      this._swipePoints = _swipePoints;
      // 触发单指平移事件
      this.emit('pan', newEvent);
    }
    // 无指无移动
    else {
      return;
    }
    this.emit('pointerMove', newEvent);
  }
}
function ended(event) {
  var _this2 = this;
  var _getEventPoints3 = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getEventPoints)(event),
    points = _getEventPoints3.points;
  if (!points) {
    return;
  }
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  // 临时保存当前手指（点）
  var pointer0 = null;
  var pointer1 = null;
  if (this._pointer0) {
    this._pointer0.changed = false;
  }
  if (this._pointer1) {
    this._pointer1.changed = false;
  }
  // 循环删除已经拿开的手指（点）
  for (var i = 0, len = points.length; i < len; ++i) {
    var t = points[i];
    if (this._pointer0 && this._pointer0.identifier === t.identifier) {
      this._pointer0.changed = true;
      pointer0 = this._pointer0;
      this._pointer0 = null;
    } else if (this._pointer1 && this._pointer1.identifier === t.identifier) {
      this._pointer1.changed = true;
      pointer1 = this._pointer1;
      this._pointer1 = null;
    }
  }
  // 双指变单指
  if (this._pointer1 && !this._pointer0) {
    this._pointer0 = this._pointer1;
    this._pointer1 = null;
    pointer1 = pointer0;
    pointer0 = null;
  }
  // 松开时清除longTapTimer（一旦松开就不存在长按，当然有可能已经发生过了）
  if (this._longTapTimer) {
    window.clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  // 仍然存在至少一根手指（点）
  if (this._pointer0) {
    newEvent.pointers = [this._pointer0];
    if (this._pointer1) {
      // 剩余两指
      newEvent.pointers.push(this._pointer1);
    } else if (pointer1) {
      // 剩余一指
      newEvent.leavePointers = [pointer1];
    }
    var start = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(this._pointer0.start, this._pointer1 ? this._pointer1.start : pointer1 ? pointer1.start : []);
    var previous = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(this._pointer0.previous, this._pointer1 ? this._pointer1.previous : pointer1 ? pointer1.previous : []);
    var current = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(this._pointer0.current, this._pointer1 ? this._pointer1.current : pointer1 ? pointer1.current : []);
    newEvent.getPoint = function (whichOne) {
      return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    };
    this.emit('gestureEnd', newEvent);
  }
  // 全部拿开
  else if (pointer0) {
    // 多指的最后一指抬起，仅仅一指抬起
    newEvent.leavePointers = [pointer0];
    if (pointer1) {
      // 双指同时抬起
      newEvent.leavePointers.push(pointer1);
    }
    var _start = pointer1 ? (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.start, pointer1.start) : pointer0.start;
    var _previous = pointer1 ? (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.previous, pointer1.previous) : pointer0.previous;
    var _current = pointer1 ? (0,_util__WEBPACK_IMPORTED_MODULE_3__.getCenter)(pointer0.current, pointer1.current) : pointer0.current;
    newEvent.getPoint = function (whichOne) {
      return whichOne === 'start' ? _start : whichOne === 'previous' ? _previous : _current;
    };
    if (!this._preventTap) {
      this.emit('tap', newEvent);
    }
    if (!this._preventSingleTap) {
      // 等待doubleTapInterval，如果时间内没有点击第二次，则触发
      this._singleTapTimer = window.setTimeout(function () {
        _this2._singleTapTimer = null;
        newEvent.delayTime = _this2.doubleTapInterval;
        _this2.emit('singleTap', newEvent);
      }, this.doubleTapInterval);
    }
    if (!this._preventDoubleTap) {
      // 双击点使用第一次的点
      var firstPointer = this._firstPointer;
      if (firstPointer) {
        newEvent.getPoint = function () {
          return firstPointer.current;
        };
      }
      newEvent.intervalTime = this.doubleTapInterval;
      this.emit('doubleTap', newEvent);
    }
    // this._swipePoints存在表示开始了swipe行为
    if (this._swipePoints) {
      var _this$_swipePoints = this._swipePoints,
        prev = _this$_swipePoints[0],
        next = _this$_swipePoints[1];
      // 最后一次移动的点即为swipe终点
      var endPos = next[next.length - 1];
      // 最后一次移动点的时间减去手指（点）抬起的时间，此间隔时间需小于等待时间raiseDuration，否则视为停止swipe
      if (Date.now() - endPos.timestamp <= this.raiseDuration) {
        // 找到计入swipe的时间(swipeDuration)内的swipe起点
        var startPos = next[0];
        for (var _i = prev.length - 1; _i >= 0; _i--) {
          if (endPos.timestamp - prev[_i].timestamp <= this.swipeDuration) {
            startPos = prev[_i];
          } else {
            break;
          }
        }
        // 根据swipe起点和终点的距离差与时间差算出swipe抬起时速率
        var velocity = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getVelocity)(endPos.timestamp - startPos.timestamp, (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDistance)(startPos.point, endPos.point));
        // swipe速率需要大于swipeVelocity，否则忽略不计，不视为swipe
        if (velocity > this.swipeVelocity) {
          // 滑动方向与x夹角
          var angle = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getAngle)(startPos.point, endPos.point);
          // 惯性的方向
          newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(startPos.point, endPos.point);
          newEvent.angle = angle;
          newEvent.velocity = velocity;
          // 给出按照velocity速度滑动，当速度减到0时的计算函数：
          // 当给出时间t，即在t时间内速度减到0，求出滑动的距离：
          // 当给出减速度a，即在减速度a的作用下，速度减到0，求出滑动的距离，和消耗的时间：
          // 减速度某个时间的位移：s = v0 * t - (a * t * t) / 2
          // 减速度某个时间的速度：v = v0 - a * t
          // s为滑动距离，v末速度为0，v0初速度为velocity
          newEvent.swipeComputed = function (factor, _velocity) {
            if (_velocity === void 0) {
              _velocity = velocity;
            }
            // 因子大于1可以认为传入的是时间毫秒数
            var duration = 0;
            var deceleration = 0;
            var distance = 0;
            if (factor > 1) {
              duration = factor;
              deceleration = _velocity / duration;
              distance = _velocity * duration / 2;
            }
            // 因子小于1可以认为传入的是减速度（减速如果大于1一般太大了，不符合使用场景）
            else if (factor > 0) {
              deceleration = factor;
              duration = _velocity / deceleration;
              distance = _velocity * _velocity / (2 * deceleration);
            }
            var _getVector = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getVector)(distance, angle),
              stretchX = _getVector[0],
              stretchY = _getVector[1];
            return {
              duration: duration,
              // swipe速率减到0花费的时间
              stretchX: stretchX,
              // x方向swipe惯性距离（抬起后，继续移动的距离）
              stretchY: stretchY,
              // y方向swipe惯性距离（抬起后，继续移动的距离）
              deceleration: deceleration // swipe速率减到0的减速度
            };
          };

          this.emit('swipe', newEvent);
        }
      }
    }
  }
  this.emit('pointerEnd', newEvent);
  /* // 只剩下一根在上面了，以下事件交给用户自行放在pointerEnd事件里自行判断
  if (this._pointer0 && !this._pointer1) {
    // 双指抬起，只剩下一指，此时就认为该点是移动的起点（否则会把双指移动的起点作为起点，移动时会出现跳跃）
    this._pointer0.start = this._pointer0.previous = this._pointer0.current;
    // 同时可以触发一次start事件
    newEvent.pointers = [this._pointer0];
    newEvent.pointer = this._pointer0;
    this.emit('pointerStart', newEvent);
  } */
}

function canceled(event) {
  event.stopImmediatePropagation();
  this.emit('pointerCancel', {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  });
  ended.apply(this, [event]);
}
function scrolled() {
  if (this._singleTapTimer) {
    window.clearTimeout(this._singleTapTimer);
    this._singleTapTimer = null;
  }
  if (this._longTapTimer) {
    window.clearTimeout(this._longTapTimer);
    this._longTapTimer = null;
  }
  if (this._wheelTimerEnd) {
    window.clearTimeout(this._wheelTimerEnd.timer);
    this._wheelTimerEnd = null;
  }
  this._firstPointer = null;
  this._pointer0 = null;
  this._pointer1 = null;
  this._preventTap = true;
  this._swipePoints = null;
  this._preventSingleTap = true;
  this._preventDoubleTap = true;
}
function downed(event) {
  var that = this;
  window.addEventListener('mousemove', mousemoved);
  window.addEventListener('mouseup', mouseupped);
  window.addEventListener('blur', blured);
  window.addEventListener('dragstart', dragstarted, {
    capture: true,
    passive: false
  });
  if ('onselectstart' in window.document.documentElement) {
    window.addEventListener('selectstart', dragstarted, {
      capture: true,
      passive: false
    });
  }
  function unbind() {
    window.removeEventListener('mousemove', mousemoved);
    window.removeEventListener('mouseup', mouseupped);
    window.removeEventListener('blur', blured);
    window.removeEventListener('dragstart', dragstarted);
    if ('onselectstart' in window.document.documentElement) {
      window.removeEventListener('selectstart', dragstarted);
    }
  }
  function blured(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    unbind();
  }
  function dragstarted(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function mousemoved(e) {
    if (event.button === 0) {
      moved.apply(that, [e]);
    } else {
      e.preventDefault();
      e.stopImmediatePropagation();
      var newEvent = {
        currentTarget: that.element,
        sourceEvent: event,
        timestamp: Date.now(),
        pointers: [],
        leavePointers: [],
        getPoint: function getPoint() {
          return [0, 0];
        }
      };
      var point = [e.pageX, e.pageY];
      if (that._pointer0) {
        that._pointer0.previous = that._pointer0.current;
        that._pointer0.current = point;
        newEvent.pointers = [that._pointer0];
        var _that$_pointer = that._pointer0,
          start = _that$_pointer.start,
          previous = _that$_pointer.previous,
          current = _that$_pointer.current;
        newEvent.getPoint = function (whichOne) {
          return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
        };
        newEvent.direction = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(previous, current);
        newEvent.moveDirection = (0,_util__WEBPACK_IMPORTED_MODULE_3__.getDirection)(start, current);
        newEvent.deltaX = current[0] - previous[0];
        newEvent.moveX = current[0] - start[0];
        newEvent.deltaY = current[1] - previous[1];
        newEvent.moveY = current[1] - start[1];
        // 根据移动距离计算：1度 = 4px; 正值顺时针，负值逆时针
        newEvent.angle = newEvent.deltaX / 4;
        newEvent.moveAngle = newEvent.moveX / 4;
        that.emit('rotate', newEvent);
      }
    }
  }
  function mouseupped(e) {
    unbind();
    if (event.button === 0) {
      ended.apply(that, [e]);
    } else {
      e.stopImmediatePropagation();
      var newEvent = {
        currentTarget: that.element,
        sourceEvent: event,
        timestamp: Date.now(),
        pointers: [],
        leavePointers: [],
        getPoint: function getPoint() {
          return [0, 0];
        }
      };
      var point = [e.pageX, e.pageY];
      if (that._pointer0) {
        var pointer0 = that._pointer0;
        that._pointer0 = null;
        pointer0.previous = pointer0.current;
        pointer0.current = point;
        newEvent.leavePointers = [pointer0];
        var start = pointer0.start,
          previous = pointer0.previous,
          current = pointer0.current;
        newEvent.getPoint = function (whichOne) {
          return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
        };
      }
      newEvent.angle = 0 / 0;
      that.emit('rotate', newEvent);
    }
  }
  if (event.button === 0) {
    started.apply(that, [event]);
  } else {
    event.preventDefault();
    event.stopImmediatePropagation();
    // 如果存在wheel没执行，需要执行掉
    if (that._wheelTimerEnd) {
      window.clearTimeout(that._wheelTimerEnd.timer);
      that._wheelTimerEnd.wheelEnd();
      that._wheelTimerEnd = null;
    }
    var point = [event.pageX, event.pageY];
    that._pointer0 = {
      start: point,
      previous: point,
      current: point,
      identifier: -1,
      changed: true
    };
  }
}
function wheeled(event) {
  var _this3 = this;
  event.preventDefault();
  event.stopImmediatePropagation();
  var newEvent = {
    currentTarget: this.element,
    sourceEvent: event,
    timestamp: Date.now(),
    pointers: [],
    leavePointers: [],
    getPoint: function getPoint() {
      return [0, 0];
    }
  };
  var point = [event.pageX, event.pageY];
  if (this._wheelTimerEnd) {
    if (this._pointer0) {
      this._pointer0.previous = this._pointer0.current;
      this._pointer0.current = point;
    }
    window.clearTimeout(this._wheelTimerEnd.timer);
    // wheelRoll
  } else {
    this._pointer0 = {
      start: point,
      previous: point,
      current: point,
      identifier: -1,
      changed: true
    };
    // wheelstart
  }

  var wheelEnd = function wheelEnd() {
    _this3._pointer0 = null;
    _this3._wheelTimerEnd = null;
    newEvent.timestamp = Date.now();
    // 表示滚轮结束，不参与计算
    newEvent.scale = 0 / 0;
    _this3.emit('scale', newEvent);
    // wheelEnd
  };

  this._wheelTimerEnd = {
    wheelEnd: wheelEnd,
    timer: window.setTimeout(wheelEnd, this.wheelDelay),
    scale: this._wheelTimerEnd ? this._wheelTimerEnd.scale : 1
  };
  if (this._pointer0) {
    newEvent.pointers = [this._pointer0];
    var _this$_pointer = this._pointer0,
      start = _this$_pointer.start,
      previous = _this$_pointer.previous,
      current = _this$_pointer.current;
    newEvent.getPoint = function (whichOne) {
      return whichOne === 'start' ? start : whichOne === 'previous' ? previous : current;
    };
    var scale = Math.pow(2, -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002));
    this._wheelTimerEnd.scale *= scale;
    newEvent.moveScale = this._wheelTimerEnd.scale;
    newEvent.scale = scale;
    this.emit('scale', newEvent);
  }
}
var Gesture = /*#__PURE__*/function (_EventTarget) {
  (0,_babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(Gesture, _EventTarget);
  function Gesture(element, options) {
    var _this4;
    _this4 = _EventTarget.call(this) || this;
    _this4._rotateAngle = 0;
    _this4._singleTapTimer = null;
    _this4._longTapTimer = null;
    _this4._wheelTimerEnd = null;
    _this4._preventTap = true;
    _this4._swipePoints = null;
    _this4._preventSingleTap = true;
    _this4._preventDoubleTap = true;
    _this4._firstPointer = null;
    _this4._pointer0 = null;
    _this4._pointer1 = null;
    _this4._destory = null;
    var tempElement;
    if (typeof element === 'string') {
      tempElement = document.querySelector(element);
    } else {
      tempElement = element;
    }
    if (!tempElement || !(tempElement instanceof HTMLElement)) {
      throw new Error('Please pass in a valid element...');
    }
    _this4.element = tempElement;
    var _ref = options || {},
      wheelDelay = _ref.wheelDelay,
      longTapInterval = _ref.longTapInterval,
      doubleTapInterval = _ref.doubleTapInterval,
      doubleTapDistance = _ref.doubleTapDistance,
      touchMoveDistance = _ref.touchMoveDistance,
      swipeVelocity = _ref.swipeVelocity,
      swipeDuration = _ref.swipeDuration,
      raiseDuration = _ref.raiseDuration;
    _this4.wheelDelay = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(wheelDelay, 350, 1);
    _this4.longTapInterval = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(longTapInterval, 750, 1);
    _this4.doubleTapInterval = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(doubleTapInterval, 250, 1);
    _this4.doubleTapDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(doubleTapDistance, 30, 1);
    _this4.touchMoveDistance = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(touchMoveDistance, 3, 0);
    _this4.swipeVelocity = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(swipeVelocity, 0.3, 0);
    _this4.swipeDuration = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(swipeDuration, 100, 1);
    _this4.raiseDuration = (0,_util__WEBPACK_IMPORTED_MODULE_3__.fixOption)(raiseDuration, 100, 1);
    // 注册触摸事件
    var tmscrolled = scrolled.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
    if ((0,_util__WEBPACK_IMPORTED_MODULE_3__.isTouchable)(_this4.element)) {
      var touchstarted = started.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      var touchmoved = moved.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      var touchended = ended.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      var touchcanceled = canceled.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      _this4.element.addEventListener('touchstart', touchstarted, false);
      _this4.element.addEventListener('touchmove', touchmoved, false);
      _this4.element.addEventListener('touchend', touchended, false);
      _this4.element.addEventListener('touchcancel', touchcanceled, false);
      window.addEventListener('scroll', tmscrolled);
      _this4._destory = function () {
        _this4.element.removeEventListener('touchstart', touchstarted);
        _this4.element.removeEventListener('touchmove', touchmoved);
        _this4.element.removeEventListener('touchend', touchended);
        _this4.element.removeEventListener('touchcancel', touchcanceled);
        window.removeEventListener('scroll', tmscrolled);
      };
    } else {
      // 注册触摸事件
      var mousedowned = downed.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      _this4.element.addEventListener('mousedown', mousedowned, false);
      var mousewheeled = wheeled.bind((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_0__["default"])(_this4));
      _this4.element.addEventListener('wheel', mousewheeled, false);
      window.addEventListener('scroll', tmscrolled);
      _this4._destory = function () {
        _this4.element.removeEventListener('mousedown', mousedowned);
        _this4.element.removeEventListener('wheel', mousewheeled);
        window.removeEventListener('scroll', tmscrolled);
      };
    }
    return _this4;
  }
  var _proto = Gesture.prototype;
  _proto.isTouch = function isTouch() {
    return (0,_util__WEBPACK_IMPORTED_MODULE_3__.isTouchable)(this.element);
  };
  _proto.destory = function destory() {
    // 解除所有事件
    _EventTarget.prototype.off.call(this);
    scrolled.apply(this);
    // 解除手势事件
    if (this._destory) {
      this._destory();
      this._destory = null;
    }
  };
  return Gesture;
}(_event__WEBPACK_IMPORTED_MODULE_2__["default"]); // 双（多）指结束
/**
 * swipe思路:
 * 根据移动停止前swipeDuration时间内移动的距离和时间算出速度，
 * 速度大于swipeVelocity，并且移动停止后到手指（点）抬起时间间隔小于raiseDuration即为swipe
 * 移动停止就是最后一次触发move事件
 * 0. start 清空_swipePoints
 * 1. move 每swipeDuration时间内所移动的点分为一组，只保留上一次swipeDuration时间组和这一次swipeDuration时间组，存储在_swipePoints内
 * 2. end 松开手时, 在_swipePoints内找到起终点，根据起终点距离和时间差算出速度，然后算出其他值
 */
/* harmony default export */ __webpack_exports__["default"] = (Gesture);

/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventTarget: function() { return /* reexport safe */ _event__WEBPACK_IMPORTED_MODULE_0__["default"]; }
/* harmony export */ });
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event */ "./node_modules/@huangjs888/gesture/es/event.js");
/* harmony import */ var _gesture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gesture */ "./node_modules/@huangjs888/gesture/es/gesture.js");
/*
 * @Author: Huangjs
 * @Date: 2023-07-26 16:28:53
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 10:50:40
 * @Description: ******
 */





/* harmony default export */ __webpack_exports__["default"] = (_gesture__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./node_modules/@huangjs888/gesture/es/util.js":
/*!*****************************************************!*\
  !*** ./node_modules/@huangjs888/gesture/es/util.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fixOption: function() { return /* binding */ fixOption; },
/* harmony export */   getAngle: function() { return /* binding */ getAngle; },
/* harmony export */   getCenter: function() { return /* binding */ getCenter; },
/* harmony export */   getDirection: function() { return /* binding */ getDirection; },
/* harmony export */   getDistance: function() { return /* binding */ getDistance; },
/* harmony export */   getEventPoints: function() { return /* binding */ getEventPoints; },
/* harmony export */   getVector: function() { return /* binding */ getVector; },
/* harmony export */   getVelocity: function() { return /* binding */ getVelocity; },
/* harmony export */   isTouchable: function() { return /* binding */ isTouchable; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/filter */ "./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0__);

/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-16 17:23:53
 * @Description: ******
 */

var isCurrentTarget = function isCurrentTarget(target, currentTarget) {
  var _target = target;
  while (_target && _target !== currentTarget) {
    _target = _target.parentNode;
  }
  return !!_target;
};
function fixOption(value, defaultValue, minVal) {
  return typeof value !== 'number' || value < minVal ? defaultValue : value;
}
function isTouchable(ele) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}
function getEventPoints(event, started) {
  if (started === void 0) {
    started = false;
  }
  if (event instanceof TouchEvent) {
    if (started) {
      var touches = _babel_runtime_corejs3_core_js_instance_filter__WEBPACK_IMPORTED_MODULE_0___default()(Array.prototype).call(event.touches, function (t) {
        return isCurrentTarget(t.target, event.currentTarget);
      });
      return {
        points: touches,
        isFirst: event.changedTouches.length === touches.length
      };
    }
    return {
      points: event.changedTouches
    };
  }
  return {
    points: [{
      pageX: event.pageX,
      pageY: event.pageY,
      identifier: -1
    }],
    isFirst: started
  };
}
function getDistance(_ref, _ref2) {
  var x0 = _ref[0],
    y0 = _ref[1];
  var x1 = _ref2[0],
    y1 = _ref2[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }
  return 0;
}
function getAngle(_ref3, _ref4) {
  var x0 = _ref3[0],
    y0 = _ref3[1];
  var x1 = _ref4[0],
    y1 = _ref4[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    return Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  }
  return 0;
}
function getCenter(_ref5, _ref6) {
  var x0 = _ref5[0],
    y0 = _ref5[1];
  var x1 = _ref6[0],
    y1 = _ref6[1];
  var ok0 = typeof x0 === 'number' && typeof y0 === 'number';
  var ok1 = typeof x1 === 'number' && typeof y1 === 'number';
  return !ok0 && !ok1 ? [0, 0] : ok0 && !ok1 ? [x0, y0] : !ok0 && ok1 ? [x1, y1] : [(x0 + x1) / 2, (y0 + y1) / 2];
}
function getDirection(_ref7, _ref8) {
  var x0 = _ref7[0],
    y0 = _ref7[1];
  var x1 = _ref8[0],
    y1 = _ref8[1];
  if (typeof x0 === 'number' && typeof x1 === 'number' && typeof y0 === 'number' && typeof y1 === 'number') {
    var x = x0 - x1;
    var y = y0 - y1;
    if (x !== y) {
      return Math.abs(x) >= Math.abs(y) ? x0 - x1 > 0 ? 'Left' : 'Right' : y0 - y1 > 0 ? 'Up' : 'Down';
    }
  }
  return 'None';
}
function getVelocity(deltaTime, distance) {
  if (typeof distance !== 'number' || distance === 0 || typeof deltaTime !== 'number' || deltaTime === 0) {
    return 0;
  }
  return distance / deltaTime;
}

//根据数值，与水平夹角，计算x和y的分量值
function getVector(value, angle) {
  if (typeof value !== 'number' || typeof angle !== 'number') {
    return [0, 0];
  }
  var rad = angle * Math.PI / 180;
  return [value * Math.cos(rad), value * Math.sin(rad)];
}

/***/ }),

/***/ "./src/confirm.ts":
/*!************************!*\
  !*** ./src/confirm.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   confirmCancel: function() { return /* binding */ confirmCancel; },
/* harmony export */   confirmStyle: function() { return /* binding */ confirmStyle; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.ts");

var _excluded = ["wrapper", "element", "confirm"];
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:29:15
 * @Description: ******
 */


var confirmStyle = function confirmStyle(item, isConfirm) {
  if (isConfirm === void 0) {
    isConfirm = false;
  }
  var wrapper = item.wrapper,
    element = item.element,
    _item$confirm = item.confirm,
    confirm = _item$confirm === void 0 ? {} : _item$confirm,
    rest = (0,_babel_runtime_corejs3_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(item, _excluded);
  var text = rest.text,
    icon = rest.icon,
    color = rest.color,
    background = rest.background,
    className = rest.className;
  if (isConfirm) {
    // 如果icon不存在，则不存在该确认，如果icon存在，则取确认icon，若确认icon不存在，则仍然取icon
    icon = icon && (confirm.icon || icon);
    text = text && (confirm.text || text);
    color = color && (confirm.color || color);
    background = background && (confirm.background || background);
    className = className && (confirm.className || className);
  }
  (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(wrapper, {
    background: background || '',
    color: color || ''
  });
  (0,_util__WEBPACK_IMPORTED_MODULE_1__.addClass)((0,_util__WEBPACK_IMPORTED_MODULE_1__.removeClass)(element, isConfirm ? rest.className || '' : confirm.className || rest.className || ''), className || '');
  if (icon) {
    var iconEl = element.firstElementChild;
    var type = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getIconType)(icon);
    if (type === 'img') {
      iconEl.src = icon;
    } else if (type === 'i') {
      iconEl.className = icon;
    } else {
      iconEl.innerHTML = icon;
    }
  }
  if (text) {
    var textEl = element.lastElementChild;
    textEl.innerText = text;
  }
};
var confirmCancel = function confirmCancel() {
  // 如果当前处于按钮确认状态，隐藏之前需要先取消
  if (this._confirming) {
    // 因为hide的时候会进行变换，所以不需要再cTransform
    var _this$_confirming = this._confirming,
      index = _this$_confirming.index,
      direction = _this$_confirming.direction;
    var actions = direction === 'left' ? this.leftActions : direction === 'right' ? this.rightActions : null;
    if (actions && !actions.disable) {
      var item = actions.items[index];
      (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(item.element, {
        width: ''
      });
      confirmStyle(item);
    }
    this._confirming = null;
  }
};

/***/ }),

/***/ "./src/css.ts":
/*!********************!*\
  !*** ./src/css.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-11 10:32:41
 * @Description: ******
 */
/* harmony default export */ __webpack_exports__["default"] = ("\n.hjs-slideview {\n  position: relative;\n  overflow: hidden;\n}\n.hjs-slideview__content {\n  position: relative;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__left,\n.hjs-slideview__right,\n.hjs-slideview__actions,\n.hjs-slideview__action__wrapper {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__left {\n  right: 100%;\n  left: auto;\n  justify-content: flex-end;\n}\n.hjs-slideview__left .hjs-slideview__action__wrapper {\n  right: 0;\n  left: auto;\n  justify-content: flex-end;\n}\n.hjs-slideview__right {\n  right: auto;\n  left: 100%;\n  justify-content: flex-start;\n}\n.hjs-slideview__right .hjs-slideview__action__wrapper {\n  right: auto;\n  left: 0;\n  justify-content: flex-start;\n}\n.hjs-slideview__action {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  max-width: 100%;\n  height: 100%;\n  padding: 0 20px;\n  cursor: pointer;\n}\n.hjs-slideview__action__icon {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  text-align: center;\n}\n.hjs-slideview__action__text {\n  width: 100%;\n  overflow: hidden;\n  white-space: nowrap;\n  text-align: center;\n  text-overflow: ellipsis;\n}\n");

/***/ }),

/***/ "./src/dom.ts":
/*!********************!*\
  !*** ./src/dom.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ generateEl; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css */ "./src/css.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:16:12
 * @Description: ******
 */



function generateEl(container, className) {
  var tempContainer;
  try {
    if (typeof container === 'string') {
      tempContainer = document.querySelector(container);
    } else {
      tempContainer = container;
    }
  } catch (e) {
    tempContainer = null;
  }
  if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
    throw new Error('Please pass in a valid container element...');
  }
  (0,_util__WEBPACK_IMPORTED_MODULE_0__.cssInject)(_css__WEBPACK_IMPORTED_MODULE_1__["default"]);
  var viewElement = (0,_util__WEBPACK_IMPORTED_MODULE_0__.addClass)(document.createElement('div'), "hjs-slideview " + (className || ''));
  var leftElement = (0,_util__WEBPACK_IMPORTED_MODULE_0__.addClass)(document.createElement('div'), 'hjs-slideview__left');
  viewElement.appendChild(leftElement);
  var rightElement = (0,_util__WEBPACK_IMPORTED_MODULE_0__.addClass)(document.createElement('div'), 'hjs-slideview__right');
  viewElement.appendChild(rightElement);
  var contentElement = (0,_util__WEBPACK_IMPORTED_MODULE_0__.addClass)(document.createElement('div'), 'hjs-slideview__content');
  viewElement.appendChild(contentElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(viewElement);
  return [viewElement, contentElement, leftElement, rightElement];
}

/***/ }),

/***/ "./src/events/buttonPress.ts":
/*!***********************************!*\
  !*** ./src/events/buttonPress.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ buttonPress; }
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/events/index.ts");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../transform */ "./src/transform.ts");
/* harmony import */ var _overshoot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../overshoot */ "./src/overshoot.ts");
/* harmony import */ var _confirm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../confirm */ "./src/confirm.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util */ "./src/util.ts");
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
  var target = (0,_util__WEBPACK_IMPORTED_MODULE_4__.findTarget)(sourceEvent, function (t) {
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
      (0,_confirm__WEBPACK_IMPORTED_MODULE_3__.confirmStyle)(item);
      this._confirming = null;
    } else {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (item.collapse) {
        this.hide();
      } else {
        // 取消确认
        (0,_util__WEBPACK_IMPORTED_MODULE_4__.setStyle)(item.element, {
          width: ''
        });
        _transform__WEBPACK_IMPORTED_MODULE_1__.cTransform.apply(this, [confirm]);
        (0,_confirm__WEBPACK_IMPORTED_MODULE_3__.confirmStyle)(item);
        this._confirming = null;
      }
    }
  } else {
    if (overshoot) {
      if (!this._overshooting) {
        this._overshooting = true;
        var translate = factor * elWidth;
        this._translate = translate;
        _transform__WEBPACK_IMPORTED_MODULE_1__.transform.apply(this, [translate]);
        _overshoot__WEBPACK_IMPORTED_MODULE_2__.overshootChange.apply(this, [actions]);
      }
      if (item.confirm) {
        this._confirming = confirm;
        (0,_confirm__WEBPACK_IMPORTED_MODULE_3__.confirmStyle)(item, true);
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
          (0,_index__WEBPACK_IMPORTED_MODULE_0__.onOnceTransitionEnd)(item.wrapper, function () {
            // 该事件执行时确保当前还处于确认状态，否则不能再执行
            if (_this._confirming && _this._confirming.index === confirm.index && _this._confirming.direction === confirm.direction) {
              _transform__WEBPACK_IMPORTED_MODULE_1__.cTransform.apply(_this, [confirm, _translate]);
            }
          });
          _transform__WEBPACK_IMPORTED_MODULE_1__.cTransform.apply(this, [confirm, _translate + rebounce * _translate / Math.abs(_translate)]);
        } else {
          _transform__WEBPACK_IMPORTED_MODULE_1__.cTransform.apply(this, [confirm, _translate]);
        }
        (0,_util__WEBPACK_IMPORTED_MODULE_4__.setStyle)(item.wrapper, {
          width: ''
        });
        (0,_util__WEBPACK_IMPORTED_MODULE_4__.setStyle)(item.element, {
          width: Math.abs(_translate)
        });
        this._confirming = confirm;
        (0,_confirm__WEBPACK_IMPORTED_MODULE_3__.confirmStyle)(item, true);
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

/***/ }),

/***/ "./src/events/doubleTap.ts":
/*!*********************************!*\
  !*** ./src/events/doubleTap.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ doubleTap; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:50:29
 * @Description: ******
 */


function doubleTap(e) {
  var contentEl = this.contentEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = (0,_util__WEBPACK_IMPORTED_MODULE_0__.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && t !== contentEl;
  });
  // 触发内容双按压事件
  if (contentEl && target === contentEl) {
    // 收起时候则触发双按事件，未收起则收起
    if (_translate === 0) {
      this.emit('doublePress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
}

/***/ }),

/***/ "./src/events/index.ts":
/*!*****************************!*\
  !*** ./src/events/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ bindGesture; },
/* harmony export */   onOnceTransitionEnd: function() { return /* binding */ onOnceTransitionEnd; }
/* harmony export */ });
/* harmony import */ var _huangjs888_gesture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @huangjs888/gesture */ "./node_modules/@huangjs888/gesture/es/index.js");
/* harmony import */ var _longTap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./longTap */ "./src/events/longTap.ts");
/* harmony import */ var _tap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tap */ "./src/events/tap.ts");
/* harmony import */ var _doubleTap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./doubleTap */ "./src/events/doubleTap.ts");
/* harmony import */ var _pointerStart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pointerStart */ "./src/events/pointerStart.ts");
/* harmony import */ var _pointerMove__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pointerMove */ "./src/events/pointerMove.ts");
/* harmony import */ var _pointerEnd__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pointerEnd */ "./src/events/pointerEnd.ts");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 14:42:44
 * @Description: ******
 */








function bindGesture(element) {
  // 绑定手势
  var gesture = new _huangjs888_gesture__WEBPACK_IMPORTED_MODULE_0__["default"](element);
  gesture.on('pointerStart', _pointerStart__WEBPACK_IMPORTED_MODULE_4__["default"].bind(this));
  gesture.on('pointerMove', _pointerMove__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this));
  gesture.on('pointerEnd', _pointerEnd__WEBPACK_IMPORTED_MODULE_6__["default"].bind(this));
  gesture.on('tap', _tap__WEBPACK_IMPORTED_MODULE_2__["default"].bind(this));
  gesture.on('longTap', _longTap__WEBPACK_IMPORTED_MODULE_1__["default"].bind(this));
  gesture.on('doubleTap', _doubleTap__WEBPACK_IMPORTED_MODULE_3__["default"].bind(this));
  return gesture;
}

/*
  1、如果在一个事件循环内多次设置transition，只会执行性最后一次，前面的会忽略。如果在多次串联（不同的事件循环内）设置transition时，如果属性和值都无任何变化，则后续的设置会忽略，如果不一样，除了第一次，后续的transition会保留上次动画最后一帧（下次动画也从该帧开始）的结果与新设置的动画值比较，相同则不执行动画，不同则执行动画（且从），而不是每次动画都与初始节点比较，初始节点执行。

  2、delay这个参数注意：正值，等待delay秒之后，从初始开始执行动画，到结束，花费duration时间。负值，无等待立马执行，从中间某节点开始执行动画，到结束位置，花费duration去掉delay负数的时间。其中中间某节点就是如果按照正常执行时用掉delay时间所应该到达的节点处。

  3、如果在一个固定时间内需要不停的改变transition属性值，直到时间用完变成无transition，此时可以在每次动画时算出与第一次动画开始时的时间差，然后用这个固定时间减去时间差，设置在当前动画的duration上，直到为0时去掉transition即可（这样做动画会连贯丝滑）。

  4、一些属性可以设置百分比或者不设置值（'','none','auto'）等，而不是具体的数值的时候，此时设置transition，并不会发生动画（比如宽度从auto到100px是瞬间到达），可以在设置transition之前先设一个具体值，比如0或1，但是，这里注意，需要把设置transition的语句放在下一个事件循环（比如setTimeout）内，但最好的是放在requestAnimationFrame，或者在语句之前调用一次布局信息（比如获取宽度值），其实就是强迫浏览器重绘：浏览器通常还会在两种情况下会产生样式变更事件，一是满足屏幕刷新频率（requestAnimationFrame），二是当 JS 脚本需要获取最新的样式布局信息时。这种情况也适用于对隐藏的元素进行动画，动画后再隐藏，可以监听transitionend，在事件内隐藏。
  https://blog.csdn.net/weixin_45189747/article/details/97790805
  http://aihongxin.com/6652.html

  5、 实现串联动画：使用animation，定义好需要的动画，想怎么玩怎么玩，缺点是无法动态设置值，如果需要动态设置值，只能用js动态添加、修改css3的@keyframes。使用transition，监听transitionend，在事件内再执行新动画，缺点是动画复杂，事件串联复杂，并且要做好判断，绑定、解绑，防止事件重复执行，或者无法串联执行，另外cancel后不会再执行。使用transitionend注意以下几点：
  https://zhuanlan.zhihu.com/p/481680437

  1、如果监听元素有多个属性都有transition，transitionend会在多个属性完成后多次触发。
  解决方法：通过注册时提供实际监控的属性值与事件触发时e.propertyName比较来控制执行哪个。

  2、如果监听元素的children也有transition，transitionend也会在children的transition完成后处触发。
  解决方法：可以通过判断e.target === element或e.currentTarget来判断是不是当前监听元素。

  3、快速连续触发设置transition事件，可以在动画未执行完触发的transitioncancel事件内解绑上一次的transitionend，保证只有当前这次的transitionend可运行，同时当前transitionend执行后也解绑当前的保证只会执行一次。
  但是存在一种概率较低的情况：过渡动画刚执行完毕（即不会触发transitioncancel），本次transitionend还没来得及触发执行（因为transitionend触发和最后一帧动画结束并不是同一事件循环），此时设置transition的方法抢先执行进来设置过渡动画，这个时候上一次的transitionend事件是无法被清掉的。
  解决方法：在每次注册transitionend时把之前已绑定transitionend事件全部清掉，同时当前transitionend执行后解绑。可以通过元素属性事件注册，而不使用addEventListener，即element.ontransitionend = ()=>{}，因为这种注册方式，永远都是替换掉上一次的事件，只有当前这一个。
*/
function onOnceTransitionEnd(ele, transitionEnd, propertyName) {
  if (propertyName === void 0) {
    propertyName = 'transform';
  }
  if (ele) {
    ele.ontransitionend = function (e) {
      // 阻止冒泡及后续事件触发
      e.stopImmediatePropagation();
      // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
      if (e.target === ele && e.propertyName === propertyName) {
        ele.ontransitionend = null;
        transitionEnd(e);
      }
    };
  }
  return ele;
}

/***/ }),

/***/ "./src/events/longTap.ts":
/*!*******************************!*\
  !*** ./src/events/longTap.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ longTap; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");
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
  var target = (0,_util__WEBPACK_IMPORTED_MODULE_0__.findTarget)(sourceEvent, function (t) {
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

/***/ }),

/***/ "./src/events/pointerEnd.ts":
/*!**********************************!*\
  !*** ./src/events/pointerEnd.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pointerEnd; }
/* harmony export */ });
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../transform */ "./src/transform.ts");
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
    if ("" + p.identifier === currentTarget.getAttribute('data-identifier')) {
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
      _transform__WEBPACK_IMPORTED_MODULE_0__.transform.apply(this, [translate]);
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

/***/ }),

/***/ "./src/events/pointerMove.ts":
/*!***********************************!*\
  !*** ./src/events/pointerMove.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pointerMove; }
/* harmony export */ });
/* harmony import */ var _huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @huangjs888/damping */ "./node_modules/@huangjs888/damping/es/index.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../transform */ "./src/transform.ts");
/* harmony import */ var _overshoot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../overshoot */ "./src/overshoot.ts");
/* harmony import */ var _confirm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../confirm */ "./src/confirm.ts");
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
          _overshoot__WEBPACK_IMPORTED_MODULE_2__.overshootChange.apply(this, [actions]);
          var index = actions.items.length - 1;
          var item = actions.items[index];
          if (item.confirm) {
            (0,_confirm__WEBPACK_IMPORTED_MODULE_3__.confirmStyle)(item, true);
            this._confirming = {
              index: index,
              direction: factor > 0 ? 'left' : 'right'
            };
          }
        }
        translate = (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.performDamping)(currentTranslate - otSize, {
          expo: friction
        }) + otSize;
        duration = Math.max(0, this.duration - (timestamp - this._timestamp) / 1000);
      } else {
        if (this._overshooting) {
          this._timestamp = timestamp;
          this._overshooting = false;
          _overshoot__WEBPACK_IMPORTED_MODULE_2__.overshootChange.apply(this, [actions]);
          var _index = actions.items.length - 1;
          var _item = actions.items[_index];
          if (_item.confirm) {
            (0,_confirm__WEBPACK_IMPORTED_MODULE_3__.confirmStyle)(_item);
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
        translate = (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.performDamping)(currentTranslate - oaSize, {
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
  _transform__WEBPACK_IMPORTED_MODULE_1__.transform.apply(this, [translate, duration]);
  if (!this._overshooting) {
    _confirm__WEBPACK_IMPORTED_MODULE_3__.confirmCancel.apply(this, []);
  }
  return;
}

/***/ }),

/***/ "./src/events/pointerStart.ts":
/*!************************************!*\
  !*** ./src/events/pointerStart.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ pointerStart; }
/* harmony export */ });
/* harmony import */ var _huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @huangjs888/damping */ "./node_modules/@huangjs888/damping/es/index.js");
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 15:16:50
 * @Description: ******
 */


function pointerStart(e) {
  var pointers = e.pointers,
    currentTarget = e.currentTarget;
  // data-identifier存在，表示是已经有指点放上去了
  if (currentTarget.getAttribute('data-identifier')) {
    return;
  }
  // 设置第一个为主手指
  var pointer = pointers[0];
  currentTarget.setAttribute('data-identifier', "" + pointer.identifier);
  var point = pointer.current;
  var leftActions = this.leftActions,
    rightActions = this.rightActions,
    friction = this.friction;
  if ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  this._isMoving = true;
  this._timestamp = 0;
  this._startAngle = 0;
  // 初始偏移量
  this._startOffset = this._translate;
  // 初始点
  this._startPoint = point;
  // 计算初始taranslate
  var actions = this._translate > 0 ? leftActions : this._translate < 0 ? rightActions : null;
  var startTranslate = 0;
  if (actions && !actions.disable) {
    var overshoot = actions.overshoot,
      overshootFreeSize = actions.overshootFreeSize,
      tWidth = actions.width;
    // 弹性尺寸临界点
    var criticalTranslate = (overshoot ? Math.min(this._width, Math.max(this._width - overshootFreeSize, tWidth)) : tWidth) * this._translate / Math.abs(this._translate);
    if (Math.abs(this._translate) <= Math.abs(criticalTranslate)) {
      startTranslate = this._translate;
    } else {
      // 恢复_translate的弹性尺寸部分
      startTranslate = (0,_huangjs888_damping__WEBPACK_IMPORTED_MODULE_0__.revokeDamping)(this._translate - criticalTranslate, {
        expo: friction
      }) + criticalTranslate;
    }
  }
  this._startTranslate = startTranslate;
}

/***/ }),

/***/ "./src/events/tap.ts":
/*!***************************!*\
  !*** ./src/events/tap.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ tap; }
/* harmony export */ });
/* harmony import */ var _buttonPress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buttonPress */ "./src/events/buttonPress.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.ts");
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
  var target = (0,_util__WEBPACK_IMPORTED_MODULE_1__.findTarget)(sourceEvent, function (t) {
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
    _buttonPress__WEBPACK_IMPORTED_MODULE_0__["default"].apply(this, [e, 'left']);
  }
  // 触发右边按钮按压事件
  else if (target === rightEl) {
    _buttonPress__WEBPACK_IMPORTED_MODULE_0__["default"].apply(this, [e, 'right']);
  }
}

/***/ }),

/***/ "./src/overshoot.ts":
/*!**************************!*\
  !*** ./src/overshoot.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   overshootChange: function() { return /* binding */ overshootChange; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");
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
    (0,_util__WEBPACK_IMPORTED_MODULE_0__.setStyle)(item.wrapper, {
      width: this._overshooting ? '100%' : ''
    });
  }
};

/***/ }),

/***/ "./src/transform.ts":
/*!**************************!*\
  !*** ./src/transform.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cTransform: function() { return /* binding */ cTransform; },
/* harmony export */   transform: function() { return /* binding */ transform; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.ts");

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
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(contentEl, {
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
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(wrapper, {
          transform: "translate3d(" + (transformx + delta) + "px, 0, 0)",
          transition: transition
        });
      } else if (i > index) {
        var _transformx = 0;
        if (translate === 0) {
          _transformx = (width + gap[1] + transformTotal) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(wrapper, {
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
      (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(element, {
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
      (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(wrapper, (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
        transform: "translate3d(" + ((i === len && _this2._overshooting ? translate : transformx) + delta) + "px, 0, 0)",
        transition: transition
      }, styleObj));
      // 累计已滑出按钮的占比距离
      transformTotal += transformb + factor * gap[0];
    }
  };
  // move事件发生，放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(function () {
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.setStyle)(contentEl, {
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

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addClass: function() { return /* binding */ addClass; },
/* harmony export */   cssInject: function() { return /* binding */ cssInject; },
/* harmony export */   findTarget: function() { return /* binding */ findTarget; },
/* harmony export */   getIconType: function() { return /* binding */ getIconType; },
/* harmony export */   getMarginSize: function() { return /* binding */ getMarginSize; },
/* harmony export */   removeClass: function() { return /* binding */ removeClass; },
/* harmony export */   setStyle: function() { return /* binding */ setStyle; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_corejs3_core_js_number_is_nan__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/number/is-nan */ "./node_modules/@babel/runtime-corejs3/core-js/number/is-nan.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_number_is_nan__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_number_is_nan__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/object/keys */ "./node_modules/@babel/runtime-corejs3/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__);


/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-03 17:24:27
 * @Description: ******
 */

function getIconType(url) {
  if (url) {
    if (url.match(/\.(jpe?g|png|gif|bmp|ico|svg|webp)$/) || url.match(/^(data:image\/)/)) {
      return 'img';
    } else if (url.match(/^<svg(.+)?>.+<\/svg>$/)) {
      return 'span';
    }
  }
  return 'i';
}
function findTarget(event, condition) {
  var target = event.target;
  while (condition(target)) {
    target = target.parentNode;
  }
  return target;
}
var getMarginSize = function getMarginSize(element) {
  var val = 0;
  if (element) {
    var computed = window.getComputedStyle(element, null);
    if (computed) {
      val = parseFloat(computed.marginLeft) + parseFloat(computed.marginRight);
    } else {
      val = parseFloat(element.style.marginLeft) + parseFloat(element.style.marginRight);
    }
    if (_babel_runtime_corejs3_core_js_number_is_nan__WEBPACK_IMPORTED_MODULE_0___default()(val)) {
      val = 0;
    }
  }
  return val;
};
function addClass(ele, className) {
  if (ele && typeof className === 'string') {
    className.split(' ').forEach(function (c) {
      return c && ele.classList.add(c);
    });
  }
  return ele;
}
function removeClass(ele, className) {
  if (ele && typeof className === 'string') {
    className.split(' ').forEach(function (c) {
      return c && ele.classList.remove(c);
    });
  }
  return ele;
}
var styleId = 'hjs-slide-view-style';
function cssInject(cssText) {
  var style = document.querySelector("#" + styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(cssText));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
  }
}
var autoPxReg = /^(?:-border(?:-top|-right|-bottom|-left)?(?:-width|)|(?:-margin|-padding)?(?:-top|-right|-bottom|-left)?|(?:-min|-max)?(?:-width|-height))$/;
function setStyle(ele, css) {
  if (ele) {
    var cssText = '';
    _babel_runtime_corejs3_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(css).forEach(function (k) {
      var key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      if (css[k] !== 0 && !css[k]) {
        // 删除
        ele.style.setProperty(key, '');
      } else {
        var suffix = typeof css[k] === 'number' && /^[a-z]/.test(key) && autoPxReg.test("-" + key) ? 'px' : '';
        var val = "" + css[k] + suffix;
        cssText += key + ":" + val + ";";
      }
    });
    if (cssText) {
      ele.style.cssText += cssText;
    }
  }
  return ele;
}

/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/bind.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/bind.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/bind */ "./node_modules/core-js-pure/stable/instance/bind.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/filter.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/filter.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/filter */ "./node_modules/core-js-pure/stable/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/index-of.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/index-of.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/index-of */ "./node_modules/core-js-pure/stable/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/map.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/map.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/map */ "./node_modules/core-js-pure/stable/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/instance/splice.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/instance/splice.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/instance/splice */ "./node_modules/core-js-pure/stable/instance/splice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/number/is-nan.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/number/is-nan.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/number/is-nan */ "./node_modules/core-js-pure/stable/number/is-nan.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/assign.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/assign.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/assign */ "./node_modules/core-js-pure/stable/object/assign.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/create.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/create.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/create */ "./node_modules/core-js-pure/stable/object/create.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/keys.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/keys */ "./node_modules/core-js-pure/stable/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/object/set-prototype-of.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/actual/object/set-prototype-of.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/object/set-prototype-of */ "./node_modules/core-js-pure/stable/object/set-prototype-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/actual/promise/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/actual/promise/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../stable/promise */ "./node_modules/core-js-pure/stable/promise/index.js");
__webpack_require__(/*! ../../modules/esnext.promise.with-resolvers */ "./node_modules/core-js-pure/modules/esnext.promise.with-resolvers.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/filter.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/filter.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.filter */ "./node_modules/core-js-pure/modules/es.array.filter.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').filter;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/index-of.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/index-of.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.index-of */ "./node_modules/core-js-pure/modules/es.array.index-of.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').indexOf;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/map.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.map */ "./node_modules/core-js-pure/modules/es.array.map.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').map;


/***/ }),

/***/ "./node_modules/core-js-pure/es/array/virtual/splice.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/es/array/virtual/splice.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.array.splice */ "./node_modules/core-js-pure/modules/es.array.splice.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Array').splice;


/***/ }),

/***/ "./node_modules/core-js-pure/es/function/virtual/bind.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/es/function/virtual/bind.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../../modules/es.function.bind */ "./node_modules/core-js-pure/modules/es.function.bind.js");
var entryVirtual = __webpack_require__(/*! ../../../internals/entry-virtual */ "./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports = entryVirtual('Function').bind;


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/bind.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/bind.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../function/virtual/bind */ "./node_modules/core-js-pure/es/function/virtual/bind.js");

var FunctionPrototype = Function.prototype;

module.exports = function (it) {
  var own = it.bind;
  return it === FunctionPrototype || (isPrototypeOf(FunctionPrototype, it) && own === FunctionPrototype.bind) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/filter.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/filter.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/filter */ "./node_modules/core-js-pure/es/array/virtual/filter.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.filter) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/index-of.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/index-of.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/index-of */ "./node_modules/core-js-pure/es/array/virtual/index-of.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.indexOf) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/map.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/map.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/map */ "./node_modules/core-js-pure/es/array/virtual/map.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.map;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.map) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/instance/splice.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/es/instance/splice.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var method = __webpack_require__(/*! ../array/virtual/splice */ "./node_modules/core-js-pure/es/array/virtual/splice.js");

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.splice;
  return it === ArrayPrototype || (isPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.splice) ? method : own;
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/number/is-nan.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/number/is-nan.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.number.is-nan */ "./node_modules/core-js-pure/modules/es.number.is-nan.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Number.isNaN;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/assign.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/assign.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.assign */ "./node_modules/core-js-pure/modules/es.object.assign.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.assign;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/create.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/create.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.create */ "./node_modules/core-js-pure/modules/es.object.create.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

var Object = path.Object;

module.exports = function create(P, D) {
  return Object.create(P, D);
};


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/keys.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/keys.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.keys */ "./node_modules/core-js-pure/modules/es.object.keys.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.keys;


/***/ }),

/***/ "./node_modules/core-js-pure/es/object/set-prototype-of.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/es/object/set-prototype-of.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.object.set-prototype-of */ "./node_modules/core-js-pure/modules/es.object.set-prototype-of.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Object.setPrototypeOf;


/***/ }),

/***/ "./node_modules/core-js-pure/es/promise/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/es/promise/index.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../../modules/es.aggregate-error */ "./node_modules/core-js-pure/modules/es.aggregate-error.js");
__webpack_require__(/*! ../../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../modules/es.object.to-string */ "./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__(/*! ../../modules/es.promise */ "./node_modules/core-js-pure/modules/es.promise.js");
__webpack_require__(/*! ../../modules/es.promise.all-settled */ "./node_modules/core-js-pure/modules/es.promise.all-settled.js");
__webpack_require__(/*! ../../modules/es.promise.any */ "./node_modules/core-js-pure/modules/es.promise.any.js");
__webpack_require__(/*! ../../modules/es.promise.finally */ "./node_modules/core-js-pure/modules/es.promise.finally.js");
__webpack_require__(/*! ../../modules/es.string.iterator */ "./node_modules/core-js-pure/modules/es.string.iterator.js");
var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = path.Promise;


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/filter.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/filter.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/filter */ "./node_modules/core-js-pure/full/instance/filter.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/map.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/map.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/map */ "./node_modules/core-js-pure/full/instance/map.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/instance/splice.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/features/instance/splice.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/instance/splice */ "./node_modules/core-js-pure/full/instance/splice.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/number/is-nan.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/features/number/is-nan.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/number/is-nan */ "./node_modules/core-js-pure/full/number/is-nan.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/object/keys.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/features/object/keys.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/object/keys */ "./node_modules/core-js-pure/full/object/keys.js");


/***/ }),

/***/ "./node_modules/core-js-pure/features/promise/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/features/promise/index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! ../../full/promise */ "./node_modules/core-js-pure/full/promise/index.js");


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/bind.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/bind.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/bind */ "./node_modules/core-js-pure/actual/instance/bind.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/filter.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/filter.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/filter */ "./node_modules/core-js-pure/actual/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/index-of.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/index-of.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/index-of */ "./node_modules/core-js-pure/actual/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/map.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/map.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/map */ "./node_modules/core-js-pure/actual/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/instance/splice.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/full/instance/splice.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/instance/splice */ "./node_modules/core-js-pure/actual/instance/splice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/number/is-nan.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/number/is-nan.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/number/is-nan */ "./node_modules/core-js-pure/actual/number/is-nan.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/assign.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/assign */ "./node_modules/core-js-pure/actual/object/assign.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/create.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/create */ "./node_modules/core-js-pure/actual/object/create.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/keys.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/keys */ "./node_modules/core-js-pure/actual/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/object/set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/full/object/set-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/object/set-prototype-of */ "./node_modules/core-js-pure/actual/object/set-prototype-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/full/promise/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/full/promise/index.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../actual/promise */ "./node_modules/core-js-pure/actual/promise/index.js");
// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../../modules/esnext.aggregate-error */ "./node_modules/core-js-pure/modules/esnext.aggregate-error.js");
__webpack_require__(/*! ../../modules/esnext.promise.all-settled */ "./node_modules/core-js-pure/modules/esnext.promise.all-settled.js");
__webpack_require__(/*! ../../modules/esnext.promise.try */ "./node_modules/core-js-pure/modules/esnext.promise.try.js");
__webpack_require__(/*! ../../modules/esnext.promise.any */ "./node_modules/core-js-pure/modules/esnext.promise.any.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-callable.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-callable.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-constructor.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-constructor.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/a-possible-prototype.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/a-possible-prototype.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/add-to-unscopables.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/add-to-unscopables.js ***!
  \*******************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function () { /* empty */ };


/***/ }),

/***/ "./node_modules/core-js-pure/internals/an-instance.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/an-instance.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/an-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/an-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-includes.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-includes.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-iteration.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-iteration.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js-pure/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-method-has-species-support.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-method-has-species-support.js ***!
  \*********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-method-is-strict.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-method-is-strict.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-set-length.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-set-length.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-slice.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-slice.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-species-constructor.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-species-constructor.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js-pure/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js-pure/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/array-species-create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/array-species-create.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js-pure/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/check-correctness-of-iteration.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/check-correctness-of-iteration.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/classof-raw.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/classof-raw.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/classof.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/classof.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/copy-constructor-properties.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/copy-constructor-properties.js ***!
  \****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js-pure/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/correct-prototype-getter.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/correct-prototype-getter.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-iter-result-object.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-iter-result-object.js ***!
  \**************************************************************************/
/***/ (function(module) {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-non-enumerable-property.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-property-descriptor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-property-descriptor.js ***!
  \***************************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/create-property.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/create-property.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-in-accessor.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-in-accessor.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-built-in.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-built-in.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/define-global-property.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/define-global-property.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/delete-property-or-throw.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/delete-property-or-throw.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/descriptors.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/descriptors.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/document-all.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/document-all.js ***!
  \*************************************************************/
/***/ (function(module) {

"use strict";

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/document-create-element.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/document-create-element.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js ***!
  \*****************************************************************************/
/***/ (function(module) {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/dom-iterables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/dom-iterables.js ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-browser.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-browser.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_DENO = __webpack_require__(/*! ../internals/engine-is-deno */ "./node_modules/core-js-pure/internals/engine-is-deno.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");

module.exports = !IS_DENO && !IS_NODE
  && typeof window == 'object'
  && typeof document == 'object';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-deno.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-deno.js ***!
  \***************************************************************/
/***/ (function(module) {

"use strict";

/* global Deno -- Deno case */
module.exports = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-ios-pebble.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-ios-pebble.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

module.exports = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != 'undefined';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-ios.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-ios.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-node.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-node.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

module.exports = typeof process != 'undefined' && classof(process) == 'process';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-is-webos-webkit.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-is-webos-webkit.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

module.exports = /web0s(?!.*chrome)/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-user-agent.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-user-agent.js ***!
  \******************************************************************/
/***/ (function(module) {

"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/engine-v8-version.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/engine-v8-version.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js-pure/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/entry-virtual.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/entry-virtual.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");

module.exports = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/enum-bug-keys.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/enum-bug-keys.js ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-clear.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/error-stack-clear.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-install.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/error-stack-install.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var clearErrorStack = __webpack_require__(/*! ../internals/error-stack-clear */ "./node_modules/core-js-pure/internals/error-stack-clear.js");
var ERROR_STACK_INSTALLABLE = __webpack_require__(/*! ../internals/error-stack-installable */ "./node_modules/core-js-pure/internals/error-stack-installable.js");

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/error-stack-installable.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/error-stack-installable.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports = !fails(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/export.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/export.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js-pure/internals/function-apply.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f);
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js-pure/internals/is-forced.js");
var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return apply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global : STATIC ? global[TARGET] : (global[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwn(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty == typeof sourceProperty) continue;

    // bind methods to global for calling from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, global);
    // wrap global constructors for prevent changes in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = uncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    createNonEnumerableProperty(target, key, resultProperty);

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwn(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && (FORCED || !targetPrototype[key])) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/fails.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/fails.js ***!
  \******************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-apply.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-apply.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind-context.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind-context.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind-native.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind-native.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-bind.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-bind.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var $Function = Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
// eslint-disable-next-line es/no-function-prototype-bind -- detection
module.exports = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-call.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-call.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-name.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-name.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this-clause.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/function-uncurry-this.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/function-uncurry-this.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js-pure/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-built-in.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-built-in.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js-pure/internals/path.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-iterator-method.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-iterator.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-iterator.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js-pure/internals/get-iterator-method.js");

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/get-method.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/get-method.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/global.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/global.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || this || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js-pure/internals/has-own-property.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/has-own-property.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/hidden-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/hidden-keys.js ***!
  \************************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/host-report-errors.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/host-report-errors.js ***!
  \*******************************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/html.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/html.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js-pure/internals/ie8-dom-define.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/ie8-dom-define.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/indexed-object.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/indexed-object.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/inspect-source.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/inspect-source.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/install-error-cause.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/install-error-cause.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/internal-state.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/internal-state.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-array-iterator-method.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-array-iterator-method.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-array.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-array.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js-pure/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-callable.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-callable.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js-pure/internals/document-all.js");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-constructor.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js-pure/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-forced.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-forced.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-null-or-undefined.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-null-or-undefined.js ***!
  \*********************************************************************/
/***/ (function(module) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js-pure/internals/document-all.js");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-pure.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-pure.js ***!
  \********************************************************/
/***/ (function(module) {

"use strict";

module.exports = true;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/is-symbol.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/is-symbol.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterate.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterate.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js-pure/internals/try-to-string.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js-pure/internals/get-iterator-method.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js-pure/internals/iterator-close.js");

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-close.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-close.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-create-constructor.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-create-constructor.js ***!
  \****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js-pure/internals/iterators-core.js").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterator-define.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterator-define.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js-pure/internals/function-name.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js-pure/internals/iterator-create-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js-pure/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterators-core.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterators-core.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/iterators.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/iterators.js ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/length-of-array-like.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/length-of-array-like.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js-pure/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/math-trunc.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/math-trunc.js ***!
  \***********************************************************/
/***/ (function(module) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/microtask.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/microtask.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f);
var macrotask = (__webpack_require__(/*! ../internals/task */ "./node_modules/core-js-pure/internals/task.js").set);
var Queue = __webpack_require__(/*! ../internals/queue */ "./node_modules/core-js-pure/internals/queue.js");
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js-pure/internals/engine-is-ios.js");
var IS_IOS_PEBBLE = __webpack_require__(/*! ../internals/engine-is-ios-pebble */ "./node_modules/core-js-pure/internals/engine-is-ios-pebble.js");
var IS_WEBOS_WEBKIT = __webpack_require__(/*! ../internals/engine-is-webos-webkit */ "./node_modules/core-js-pure/internals/engine-is-webos-webkit.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var microtask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
var notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!microtask) {
  var queue = new Queue();

  var flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (fn = queue.get()) try {
      fn();
    } catch (error) {
      if (queue.head) notify();
      throw error;
    }
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // `webpack` dev server bug on IE global methods - use bind(fn, global)
    macrotask = bind(macrotask, global);
    notify = function () {
      macrotask(flush);
    };
  }

  microtask = function (fn) {
    if (!queue.head) notify();
    queue.add(fn);
  };
}

module.exports = microtask;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/new-promise-capability.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/new-promise-capability.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/normalize-string-argument.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/normalize-string-argument.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-assign.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-assign.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-create.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-create.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js-pure/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js-pure/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-define-properties.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-define-properties.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-define-property.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-define-property.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js-pure/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js-pure/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js-pure/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-names.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-names.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-own-property-symbols.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-get-prototype-of.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-get-prototype-of.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js-pure/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js-pure/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-is-prototype-of.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-is-prototype-of.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-keys-internal.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-keys-internal.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js-pure/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js-pure/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-keys.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-keys.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js-pure/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-property-is-enumerable.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-property-is-enumerable.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-set-prototype-of.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-set-prototype-of.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(/*! ../internals/function-uncurry-this-accessor */ "./node_modules/core-js-pure/internals/function-uncurry-this-accessor.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js-pure/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js-pure/internals/object-to-string.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/object-to-string.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/ordinary-to-primitive.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/own-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/own-keys.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/path.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/path.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/perform.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/perform.js ***!
  \********************************************************/
/***/ (function(module) {

"use strict";

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-constructor-detection.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-constructor-detection.js ***!
  \******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js-pure/internals/is-forced.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js-pure/internals/inspect-source.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_BROWSER = __webpack_require__(/*! ../internals/engine-is-browser */ "./node_modules/core-js-pure/internals/engine-is-browser.js");
var IS_DENO = __webpack_require__(/*! ../internals/engine-is-deno */ "./node_modules/core-js-pure/internals/engine-is-deno.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var SPECIES = wellKnownSymbol('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR = isForced('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
  if (IS_PURE && !(NativePromisePrototype['catch'] && NativePromisePrototype['finally'])) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
    // Detect correctness of subclassing with @@species support
    var promise = new NativePromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT;
});

module.exports = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
  SUBCLASSING: SUBCLASSING
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-native-constructor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-native-constructor.js ***!
  \***************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");

module.exports = global.Promise;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-resolve.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-resolve.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var newPromiseCapability = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js":
/*!************************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js ***!
  \************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js-pure/internals/check-correctness-of-iteration.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);

module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function (iterable) {
  NativePromiseConstructor.all(iterable).then(undefined, function () { /* empty */ });
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/queue.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/queue.js ***!
  \******************************************************/
/***/ (function(module) {

"use strict";

var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    var tail = this.tail;
    if (tail) tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      var next = this.head = entry.next;
      if (next === null) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/require-object-coercible.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/require-object-coercible.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/set-species.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/set-species.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js-pure/internals/define-built-in-accessor.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineBuiltInAccessor(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/set-to-string-tag.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/set-to-string-tag.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js-pure/internals/to-string-tag-support.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js-pure/internals/object-to-string.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js-pure/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js-pure/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared-store.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared-store.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js-pure/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js-pure/internals/shared.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js-pure/internals/shared.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js-pure/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.32.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.32.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/species-constructor.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/species-constructor.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js-pure/internals/an-object.js");
var aConstructor = __webpack_require__(/*! ../internals/a-constructor */ "./node_modules/core-js-pure/internals/a-constructor.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js-pure/internals/is-null-or-undefined.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/string-multibyte.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/string-multibyte.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/symbol-constructor-detection.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js-pure/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/task.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/task.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js-pure/internals/function-apply.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js-pure/internals/function-bind-context.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js-pure/internals/html.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js-pure/internals/array-slice.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js-pure/internals/document-create-element.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js-pure/internals/validate-arguments-length.js");
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js-pure/internals/engine-is-ios.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;

fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = global.location;
});

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var eventListener = function (event) {
  run(event.data);
};

var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    global.addEventListener('message', eventListener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-absolute-index.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-absolute-index.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-indexed-object.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-indexed-object.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js-pure/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-integer-or-infinity.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js-pure/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-length.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-length.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js-pure/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-primitive.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-primitive.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js-pure/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js-pure/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js-pure/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-property-key.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-property-key.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js-pure/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js-pure/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-string-tag-support.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-string-tag-support.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/to-string.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/internals/to-string.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/try-to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/try-to-string.js ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/uid.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js-pure/internals/uid.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js-pure/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/use-symbol-as-uid.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js-pure/internals/v8-prototype-define-bug.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/v8-prototype-define-bug.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "./node_modules/core-js-pure/internals/validate-arguments-length.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/validate-arguments-length.js ***!
  \**************************************************************************/
/***/ (function(module) {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ "./node_modules/core-js-pure/internals/weak-map-basic-detection.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/weak-map-basic-detection.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js-pure/internals/well-known-symbol.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/internals/well-known-symbol.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js-pure/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js-pure/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js-pure/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js-pure/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js-pure/internals/object-is-prototype-of.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js-pure/internals/copy-constructor-properties.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js-pure/internals/create-property-descriptor.js");
var installErrorCause = __webpack_require__(/*! ../internals/install-error-cause */ "./node_modules/core-js-pure/internals/install-error-cause.js");
var installErrorStack = __webpack_require__(/*! ../internals/error-stack-install */ "./node_modules/core-js-pure/internals/error-stack-install.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var normalizeStringArgument = __webpack_require__(/*! ../internals/normalize-string-argument */ "./node_modules/core-js-pure/internals/normalize-string-argument.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Error = Error;
var push = [].push;

var $AggregateError = function AggregateError(errors, message /* , options */) {
  var isInstance = isPrototypeOf(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf) {
    that = setPrototypeOf($Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create(AggregateErrorPrototype);
    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
  installErrorStack(that, $AggregateError, that.stack, 1);
  if (arguments.length > 2) installErrorCause(that, arguments[2]);
  var errorsArray = [];
  iterate(errors, push, { that: errorsArray });
  createNonEnumerableProperty(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf) setPrototypeOf($AggregateError, $Error);
else copyConstructorProperties($AggregateError, $Error, { name: true });

var AggregateErrorPrototype = $AggregateError.prototype = create($Error.prototype, {
  constructor: createPropertyDescriptor(1, $AggregateError),
  message: createPropertyDescriptor(1, ''),
  name: createPropertyDescriptor(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({ global: true, constructor: true, arity: 2 }, {
  AggregateError: $AggregateError
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.aggregate-error.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.aggregate-error.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/es.aggregate-error.constructor */ "./node_modules/core-js-pure/modules/es.aggregate-error.constructor.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.filter.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.filter.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $filter = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js-pure/internals/array-iteration.js").filter);
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.index-of.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.index-of.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js-pure/internals/function-uncurry-this-clause.js");
var $indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js-pure/internals/array-includes.js").indexOf);
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js-pure/internals/array-method-is-strict.js");

var nativeIndexOf = uncurryThis([].indexOf);

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: FORCED }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf(this, searchElement, fromIndex) || 0
      : $indexOf(this, searchElement, fromIndex);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.iterator.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.iterator.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js-pure/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js-pure/internals/add-to-unscopables.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js-pure/internals/object-define-property.js").f);
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return createIterResultObject(undefined, true);
  }
  if (kind == 'keys') return createIterResultObject(index, false);
  if (kind == 'values') return createIterResultObject(target[index], false);
  return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.map.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var $map = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js-pure/internals/array-iteration.js").map);
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.array.splice.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.array.splice.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js-pure/internals/to-absolute-index.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js-pure/internals/to-integer-or-infinity.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js-pure/internals/length-of-array-like.js");
var setArrayLength = __webpack_require__(/*! ../internals/array-set-length */ "./node_modules/core-js-pure/internals/array-set-length.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js-pure/internals/does-not-exceed-safe-integer.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js-pure/internals/array-species-create.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js-pure/internals/create-property.js");
var deletePropertyOrThrow = __webpack_require__(/*! ../internals/delete-property-or-throw */ "./node_modules/core-js-pure/internals/delete-property-or-throw.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
    }
    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow(O, to);
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    setArrayLength(O, len - actualDeleteCount + insertCount);
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.function.bind.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.function.bind.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind */ "./node_modules/core-js-pure/internals/function-bind.js");

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
// eslint-disable-next-line es/no-function-prototype-bind -- detection
$({ target: 'Function', proto: true, forced: Function.bind !== bind }, {
  bind: bind
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.number.is-nan.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.number.is-nan.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");

// `Number.isNaN` method
// https://tc39.es/ecma262/#sec-number.isnan
$({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare -- NaN check
    return number != number;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.assign.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.assign.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js-pure/internals/object-assign.js");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.create.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.create.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js-pure/internals/descriptors.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js-pure/internals/object-create.js");

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.keys.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.keys.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js-pure/internals/to-object.js");
var nativeKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js-pure/internals/object-keys.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.set-prototype-of.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.set-prototype-of.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.object.to-string.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.object.to-string.js ***!
  \******************************************************************/
/***/ (function() {

// empty


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.all-settled.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.all-settled.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.all.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.all.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.any.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.any.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn('AggregateError');
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aCallable(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.catch.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.catch.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['catch'];
  if (NativePromisePrototype['catch'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'catch', method, { unsafe: true });
  }
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.constructor.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js-pure/internals/engine-is-node.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js-pure/internals/set-to-string-tag.js");
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js-pure/internals/set-species.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js-pure/internals/is-object.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js-pure/internals/an-instance.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js-pure/internals/species-constructor.js");
var task = (__webpack_require__(/*! ../internals/task */ "./node_modules/core-js-pure/internals/task.js").set);
var microtask = __webpack_require__(/*! ../internals/microtask */ "./node_modules/core-js-pure/internals/microtask.js");
var hostReportErrors = __webpack_require__(/*! ../internals/host-report-errors */ "./node_modules/core-js-pure/internals/host-report-errors.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var Queue = __webpack_require__(/*! ../internals/queue */ "./node_modules/core-js-pure/internals/queue.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var PromiseConstructorDetection = __webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
var PromiseConstructor = NativePromiseConstructor;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable(onRejected) && onRejected;
    reaction.domain = IS_NODE ? process.domain : undefined;
    if (state.state == PENDING) state.reactions.add(reaction);
    else microtask(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };

  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.finally.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.finally.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js-pure/internals/fails.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js-pure/internals/is-callable.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js-pure/internals/species-constructor.js");
var promiseResolve = __webpack_require__(/*! ../internals/promise-resolve */ "./node_modules/core-js-pure/internals/promise-resolve.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js-pure/internals/define-built-in.js");

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromiseConstructor && fails(function () {
  // eslint-disable-next-line unicorn/no-thenable -- required for testing
  NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = isCallable(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (!IS_PURE && isCallable(NativePromiseConstructor)) {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
  }
}


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(/*! ../modules/es.promise.constructor */ "./node_modules/core-js-pure/modules/es.promise.constructor.js");
__webpack_require__(/*! ../modules/es.promise.all */ "./node_modules/core-js-pure/modules/es.promise.all.js");
__webpack_require__(/*! ../modules/es.promise.catch */ "./node_modules/core-js-pure/modules/es.promise.catch.js");
__webpack_require__(/*! ../modules/es.promise.race */ "./node_modules/core-js-pure/modules/es.promise.race.js");
__webpack_require__(/*! ../modules/es.promise.reject */ "./node_modules/core-js-pure/modules/es.promise.reject.js");
__webpack_require__(/*! ../modules/es.promise.resolve */ "./node_modules/core-js-pure/modules/es.promise.resolve.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.race.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.race.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js-pure/internals/a-callable.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js-pure/internals/iterate.js");
var PROMISE_STATICS_INCORRECT_ITERATION = __webpack_require__(/*! ../internals/promise-statics-incorrect-iteration */ "./node_modules/core-js-pure/internals/promise-statics-incorrect-iteration.js");

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.reject.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.reject.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js-pure/internals/function-call.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule.f(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.promise.resolve.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.promise.resolve.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js-pure/internals/get-built-in.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js-pure/internals/is-pure.js");
var NativePromiseConstructor = __webpack_require__(/*! ../internals/promise-native-constructor */ "./node_modules/core-js-pure/internals/promise-native-constructor.js");
var FORCED_PROMISE_CONSTRUCTOR = (__webpack_require__(/*! ../internals/promise-constructor-detection */ "./node_modules/core-js-pure/internals/promise-constructor-detection.js").CONSTRUCTOR);
var promiseResolve = __webpack_require__(/*! ../internals/promise-resolve */ "./node_modules/core-js-pure/internals/promise-resolve.js");

var PromiseConstructorWrapper = getBuiltIn('Promise');
var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$({ target: 'Promise', stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/es.string.iterator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/es.string.iterator.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js-pure/internals/string-multibyte.js").charAt);
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js-pure/internals/to-string.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js-pure/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js-pure/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js-pure/internals/create-iter-result-object.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.aggregate-error.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.aggregate-error.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.aggregate-error */ "./node_modules/core-js-pure/modules/es.aggregate-error.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.all-settled.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.all-settled.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.promise.all-settled.js */ "./node_modules/core-js-pure/modules/es.promise.all-settled.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.any.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.any.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../modules/es.promise.any */ "./node_modules/core-js-pure/modules/es.promise.any.js");


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.try.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.try.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js-pure/internals/perform.js");

// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
$({ target: 'Promise', stat: true, forced: true }, {
  'try': function (callbackfn) {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    var result = perform(callbackfn);
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/esnext.promise.with-resolvers.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/esnext.promise.with-resolvers.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js-pure/internals/new-promise-capability.js");

// `Promise.withResolvers` method
// https://github.com/tc39/proposal-promise-with-resolvers
$({ target: 'Promise', stat: true }, {
  withResolvers: function withResolvers() {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    return {
      promise: promiseCapability.promise,
      resolve: promiseCapability.resolve,
      reject: promiseCapability.reject
    };
  }
});


/***/ }),

/***/ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js-pure/modules/web.dom-collections.iterator.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js-pure/modules/es.array.iterator.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js-pure/internals/dom-iterables.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js-pure/internals/global.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js-pure/internals/classof.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG) {
    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
  }
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/bind.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/bind.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/bind */ "./node_modules/core-js-pure/es/instance/bind.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/filter.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/filter.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/filter */ "./node_modules/core-js-pure/es/instance/filter.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/index-of.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/index-of.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/index-of */ "./node_modules/core-js-pure/es/instance/index-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/map.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/map.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/map */ "./node_modules/core-js-pure/es/instance/map.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/instance/splice.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/instance/splice.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/instance/splice */ "./node_modules/core-js-pure/es/instance/splice.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/number/is-nan.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/number/is-nan.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/number/is-nan */ "./node_modules/core-js-pure/es/number/is-nan.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/assign.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/assign.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/assign */ "./node_modules/core-js-pure/es/object/assign.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/create.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/create.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/create */ "./node_modules/core-js-pure/es/object/create.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/keys.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/keys */ "./node_modules/core-js-pure/es/object/keys.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/object/set-prototype-of.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js-pure/stable/object/set-prototype-of.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/object/set-prototype-of */ "./node_modules/core-js-pure/es/object/set-prototype-of.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/core-js-pure/stable/promise/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js-pure/stable/promise/index.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var parent = __webpack_require__(/*! ../../es/promise */ "./node_modules/core-js-pure/es/promise/index.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */ "./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports = parent;


/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/filter.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/filter */ "./node_modules/core-js-pure/features/instance/filter.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/map.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/map.js ***!
  \*********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/map */ "./node_modules/core-js-pure/features/instance/map.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/instance/splice.js ***!
  \************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/instance/splice */ "./node_modules/core-js-pure/features/instance/splice.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/number/is-nan.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/number/is-nan.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/number/is-nan */ "./node_modules/core-js-pure/features/number/is-nan.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/object/keys.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/object/keys.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/object/keys */ "./node_modules/core-js-pure/features/object/keys.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/core-js/promise.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/core-js/promise.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js-pure/features/promise */ "./node_modules/core-js-pure/features/promise/index.js");

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_assign_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js-pure/features/object/assign.js */ "./node_modules/core-js-pure/full/object/assign.js");
/* harmony import */ var core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/instance/bind.js */ "./node_modules/core-js-pure/full/instance/bind.js");


function _extends() {
  var _context;
  _extends = core_js_pure_features_object_assign_js__WEBPACK_IMPORTED_MODULE_0__ ? core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__(_context = core_js_pure_features_object_assign_js__WEBPACK_IMPORTED_MODULE_0__).call(_context) : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _inheritsLoose; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_create_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/object/create.js */ "./node_modules/core-js-pure/full/object/create.js");
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime-corejs3/helpers/esm/setPrototypeOf.js");


function _inheritsLoose(subClass, superClass) {
  subClass.prototype = core_js_pure_features_object_create_js__WEBPACK_IMPORTED_MODULE_1__(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectWithoutPropertiesLoose; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js-pure/features/object/keys.js */ "./node_modules/core-js-pure/full/object/keys.js");
/* harmony import */ var core_js_pure_features_instance_index_of_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/instance/index-of.js */ "./node_modules/core-js-pure/full/instance/index-of.js");


function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = core_js_pure_features_object_keys_js__WEBPACK_IMPORTED_MODULE_0__(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (core_js_pure_features_instance_index_of_js__WEBPACK_IMPORTED_MODULE_1__(excluded).call(excluded, key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime-corejs3/helpers/esm/setPrototypeOf.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime-corejs3/helpers/esm/setPrototypeOf.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
/* harmony import */ var core_js_pure_features_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js-pure/features/object/set-prototype-of.js */ "./node_modules/core-js-pure/full/object/set-prototype-of.js");
/* harmony import */ var core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js-pure/features/instance/bind.js */ "./node_modules/core-js-pure/full/instance/bind.js");


function _setPrototypeOf(o, p) {
  var _context;
  _setPrototypeOf = core_js_pure_features_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__ ? core_js_pure_features_instance_bind_js__WEBPACK_IMPORTED_MODULE_1__(_context = core_js_pure_features_object_set_prototype_of_js__WEBPACK_IMPORTED_MODULE_0__).call(_context) : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/extends */ "./node_modules/@babel/runtime-corejs3/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/assertThisInitialized */ "./node_modules/@babel/runtime-corejs3/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/inheritsLoose */ "./node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/map */ "./node_modules/@babel/runtime-corejs3/core-js/instance/map.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */ "./node_modules/@babel/runtime-corejs3/core-js/promise.js");
/* harmony import */ var _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _huangjs888_gesture__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @huangjs888/gesture */ "./node_modules/@huangjs888/gesture/es/index.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events */ "./src/events/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dom */ "./src/dom.ts");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./transform */ "./src/transform.ts");
/* harmony import */ var _overshoot__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./overshoot */ "./src/overshoot.ts");
/* harmony import */ var _confirm__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./confirm */ "./src/confirm.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util */ "./src/util.ts");





/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 16:00:29
 * @Description: ******
 */







var SlideView = /*#__PURE__*/function (_EventTarget) {
  (0,_babel_runtime_corejs3_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(SlideView, _EventTarget);
  function SlideView(options) {
    var _this;
    _this = _EventTarget.call(this) || this;
    _this.element = null;
    // 滑动视图元素
    _this.contentEl = null;
    // 内容元素
    _this.leftEl = null;
    // 左按钮元素
    _this.rightEl = null;
    // 右按钮元素
    _this.leftActions = null;
    // 按钮集合
    _this.rightActions = null;
    // 按钮集合
    _this.friction = 0.5;
    // 摩擦因子(0-1的值)
    _this.rebounce = 12;
    // 弹性尺寸
    _this.duration = 0.4;
    // 按钮滑出动画时间（秒级）
    _this.timing = 'ease';
    // 滑动时动画的函数
    _this._destory = false;
    // 是否销毁
    _this._direction = 'none';
    // 当前展示的是哪个方向按钮
    _this._confirming = null;
    // 当前正在确认的按钮
    _this._overshooting = false;
    // 当前是否处于overshoot状态
    _this._translate = 0;
    // 元素当前位移值
    _this._width = 0;
    // 视图宽度
    _this._offset = 0;
    // 手指放上后滑动视图元素距离屏幕左边距离即offsetLeft
    _this._startOffset = 0;
    // 手指放上那一刻，translate值
    _this._startTranslate = 0;
    // 手指放上那一刻，translate未经rebounceSize的值
    _this._startPoint = null;
    // 手指放上后初始点
    _this._startAngle = 0;
    // 移动时的角度与45度的关系
    _this._timestamp = 0;
    // 移动时的时间戳
    _this._isMoving = false;
    // 是否正在滑动
    _this._gesture = null;
    _this._removeResize = null;
    var className = options.className,
      container = options.container,
      content = options.content,
      friction = options.friction,
      rebounce = options.rebounce,
      duration = options.duration,
      timing = options.timing,
      leftActions = options.leftActions,
      rightActions = options.rightActions;
    var _generateEl = (0,_dom__WEBPACK_IMPORTED_MODULE_7__["default"])(container, className),
      element = _generateEl[0],
      contentEl = _generateEl[1],
      leftEl = _generateEl[2],
      rightEl = _generateEl[3];
    _this._gesture = _events__WEBPACK_IMPORTED_MODULE_6__["default"].apply((0,_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__["default"])(_this), [element]);
    _this.element = element;
    _this.contentEl = contentEl;
    _this.leftEl = leftEl;
    _this.rightEl = rightEl;
    _this.setContent(content);
    _this.setFriction(friction);
    _this.setRebounce(rebounce);
    _this.setDuration(duration);
    _this.setTiming(timing);
    _this.setActions(leftActions, 'left');
    _this.setActions(rightActions, 'right');
    // 浏览器窗口变化重置
    var resize = function resize() {
      var _element$getBoundingC = element.getBoundingClientRect(),
        width = _element$getBoundingC.width,
        left = _element$getBoundingC.left;
      _this._width = width;
      _this._offset = left;
    };
    window.addEventListener('resize', resize);
    _this._removeResize = function () {
      window.removeEventListener('resize', resize);
    };
    resize();
    return _this;
  }
  var _proto = SlideView.prototype;
  _proto.setContent = function setContent(content, dangerous) {
    if (content === void 0) {
      content = '';
    }
    if (this._destory || !this.contentEl) {
      return;
    }
    // 注意XSS注入
    if (dangerous && typeof content === 'string') {
      this.contentEl.innerHTML = content;
      return;
    }
    var tempChild;
    if (typeof content === 'string') {
      tempChild = document.querySelector(content);
    } else {
      tempChild = content;
    }
    if (tempChild) {
      this.contentEl.innerHTML = '';
      this.contentEl.appendChild(tempChild);
    }
  };
  _proto.setFriction = function setFriction(friction) {
    if (friction === void 0) {
      friction = 0.5;
    }
    if (this._destory) {
      return;
    }
    // friction: 不传为默认值0.5，传小于0的都为0，大于1的都为1，传非数字，则属于无效设置
    if (typeof friction === 'number') {
      this.friction = Math.min(1, Math.max(0, friction));
    }
  };
  _proto.setRebounce = function setRebounce(rebounce) {
    if (rebounce === void 0) {
      rebounce = 12;
    }
    if (this._destory) {
      return;
    }
    // rebounce: 不传为默认值12，传小于0的都为0，传非数字，则属于无效设置
    if (typeof rebounce === 'number') {
      this.rebounce = Math.max(0, rebounce);
    }
  };
  _proto.setDuration = function setDuration(duration) {
    if (duration === void 0) {
      duration = 0.4;
    }
    if (this._destory) {
      return;
    }
    // duration: 不传为默认值0.4，传小于0的都为0，传非数字，则属于无效设置
    if (typeof duration === 'number') {
      this.duration = Math.max(0, duration);
    }
  };
  _proto.setTiming = function setTiming(timing) {
    if (timing === void 0) {
      timing = 'ease';
    }
    if (this._destory) {
      return;
    }
    // timing: 不传为默认值ease
    this.timing = timing;
  };
  _proto.setDisable = function setDisable(disable, direction) {
    var _this2 = this;
    if (disable === void 0) {
      disable = true;
    }
    if (direction === void 0) {
      direction = 'both';
    }
    if (this._destory) {
      return;
    }
    // disable: 不传为默认值true，传非布尔，则无效设置
    if (typeof disable === 'boolean') {
      this.hide().then(function () {
        // direction传其它，则属于无效设置
        if (_this2.leftActions && (direction === 'both' || direction === 'left')) {
          _this2.leftActions.disable = disable;
        }
        if (_this2.rightActions && (direction === 'both' || direction === 'right')) {
          _this2.rightActions.disable = disable;
        }
      });
    }
  };
  _proto.setOvershoot = function setOvershoot(overshoot, direction) {
    if (overshoot === void 0) {
      overshoot = true;
    }
    if (direction === void 0) {
      direction = 'both';
    }
    if (this._destory) {
      return;
    }
    // overshoot: 不传为默认值true，传非布尔，则无效设置
    if (typeof overshoot === 'boolean') {
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.overshoot = overshoot;
      }
      if (this.rightActions && (direction === 'both' || direction === 'right')) {
        this.rightActions.overshoot = overshoot;
      }
    }
  };
  _proto.setThreshold = function setThreshold(threshold, direction) {
    if (threshold === void 0) {
      threshold = 40;
    }
    if (direction === void 0) {
      direction = 'both';
    }
    if (this._destory) {
      return;
    }
    // overshoot: 不传为默认值40，传小于0的都为0，传非数字，则无效设置
    if (typeof threshold === 'number') {
      var _threshold = Math.max(0, threshold);
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.threshold = Math.min(_threshold, this.leftActions.width);
      }
      if (this.rightActions && (direction === 'both' || direction === 'right')) {
        this.rightActions.threshold = Math.min(_threshold, this.rightActions.width);
      }
    }
  };
  _proto.setActions = function setActions(actions, direction) {
    var _this3 = this;
    if (actions === void 0) {
      actions = {};
    }
    if (direction === void 0) {
      direction = 'both';
    }
    if (this._destory || direction === 'none') {
      return;
    }
    // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
    var _setActions = function _setActions(_direction) {
      var parentEl = _this3[_direction + "El"];
      if (!parentEl) {
        return;
      }
      parentEl.innerHTML = '';
      _this3[_direction + "Actions"] = null;
      if (actions.items && actions.items.length > 0) {
        var _actions = actions,
          className = _actions.className,
          _actions$style = _actions.style,
          style = _actions$style === void 0 ? 'accordion' : _actions$style,
          _actions$disable = _actions.disable,
          disable = _actions$disable === void 0 ? false : _actions$disable,
          _actions$overshoot = _actions.overshoot,
          overshoot = _actions$overshoot === void 0 ? false : _actions$overshoot,
          _actions$overshootEdg = _actions.overshootEdgeSize,
          overshootEdgeSize = _actions$overshootEdg === void 0 ? 80 : _actions$overshootEdg,
          _actions$overshootFre = _actions.overshootFreeSize,
          overshootFreeSize = _actions$overshootFre === void 0 ? 30 : _actions$overshootFre,
          _actions$threshold = _actions.threshold,
          threshold = _actions$threshold === void 0 ? 40 : _actions$threshold,
          items = _actions.items;
        var tElement = (0,_util__WEBPACK_IMPORTED_MODULE_11__.addClass)(document.createElement('div'), "hjs-slideview__actions " + (className || ''));
        parentEl.appendChild(tElement);
        var tWidth = 0;
        var tGap = 0;
        var newItems = _babel_runtime_corejs3_core_js_instance_map__WEBPACK_IMPORTED_MODULE_3___default()(items).call(items, function (item, index) {
          var _item$gap = item.gap,
            gap = _item$gap === void 0 ? 0 : _item$gap,
            _item$fixedGap = item.fixedGap,
            fixedGap = _item$fixedGap === void 0 ? false : _item$fixedGap,
            text = item.text,
            icon = item.icon;
          var element = (0,_util__WEBPACK_IMPORTED_MODULE_11__.addClass)(document.createElement('div'), 'hjs-slideview__action');
          element.setAttribute('data-index', String(index));
          if (icon) {
            element.appendChild((0,_util__WEBPACK_IMPORTED_MODULE_11__.addClass)(document.createElement((0,_util__WEBPACK_IMPORTED_MODULE_11__.getIconType)(icon)), 'hjs-slideview__action__icon'));
          }
          if (text) {
            element.appendChild((0,_util__WEBPACK_IMPORTED_MODULE_11__.addClass)(document.createElement('span'), 'hjs-slideview__action__text'));
          }
          var wrapper = (0,_util__WEBPACK_IMPORTED_MODULE_11__.addClass)(document.createElement('div'), 'hjs-slideview__action__wrapper');
          wrapper.appendChild(element);
          tElement.appendChild(wrapper);
          var tItem = (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, item, {
            wrapper: wrapper,
            element: element,
            width: 0,
            gap: [0, 0],
            fixedGap: fixedGap
          });
          // 设置非确认时的样式和内容
          (0,_confirm__WEBPACK_IMPORTED_MODULE_10__.confirmStyle)(tItem);
          var _element$getBoundingC2 = element.getBoundingClientRect(),
            width = _element$getBoundingC2.width;
          var leftGap = 0;
          var rightGap = 0;
          if (typeof gap === 'number') {
            leftGap = gap;
            rightGap = gap;
          } else {
            leftGap = gap[0];
            rightGap = gap[1];
          }
          leftGap = Math.min(width, Math.max(leftGap, 0));
          rightGap = Math.min(width, Math.max(rightGap, 0));
          tWidth += width + leftGap + rightGap;
          tGap += leftGap + rightGap;
          return (0,_babel_runtime_corejs3_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, tItem, {
            gap: [leftGap, rightGap],
            fixedGap: leftGap === 0 && rightGap === 0 ? false : fixedGap,
            // 左右gap都为0的情况，gudinggap无意义
            width: width
          });
        });
        _this3[_direction + "Actions"] = {
          style: style,
          disable: disable,
          overshoot: overshoot,
          overshootFreeSize: overshootFreeSize,
          overshootEdgeSize: overshootEdgeSize,
          threshold: Math.min(tWidth, Math.max(threshold, 0)),
          element: tElement,
          width: tWidth,
          gap: tGap,
          items: newItems
        };
      }
    };
    var _setActionsAfterCollapse = function _setActionsAfterCollapse(_direction) {
      // 重新设置按钮时应该先收起
      _this3.hide().then(function () {
        _setActions(_direction);
        _this3.show(_direction);
      });
    };
    var shown = this._translate > 0 ? 'left' : this._translate < 0 ? 'right' : 'none';
    if (direction === 'both') {
      if (shown !== 'none') {
        _setActionsAfterCollapse(shown);
      }
      if (shown !== 'left') {
        _setActions('left');
      }
      if (shown !== 'right') {
        _setActions('right');
      }
    } else {
      if (shown === direction) {
        _setActionsAfterCollapse(direction);
      } else {
        _setActions(direction);
      }
    }
  };
  _proto.toggle = function toggle(direction) {
    if (direction === void 0) {
      direction = 'right';
    }
    return this._translate === 0 ? this.show(direction) : this.hide();
  };
  _proto.show = function show(direction) {
    var _this4 = this;
    if (direction === void 0) {
      direction = 'right';
    }
    var contentEl = this.contentEl,
      rebounce = this.rebounce,
      leftActions = this.leftActions,
      rightActions = this.rightActions;
    if (this._destory || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
      return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4___default().resolve();
    }
    return new (_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4___default())(function (resolve) {
      var __direction = direction;
      if (!leftActions || leftActions.disable) {
        __direction = 'right';
      }
      if (!rightActions || rightActions.disable) {
        __direction = 'left';
      }
      var actions = __direction === 'left' ? leftActions : rightActions;
      var factor = __direction === 'left' ? 1 : -1;
      var maxTranslate = !actions ? 0 : actions.width * factor;
      if (_this4._translate === maxTranslate) {
        resolve();
        return;
      }
      var show = function show(rebSize) {
        if (rebSize === void 0) {
          rebSize = 0;
        }
        var translate = maxTranslate + rebSize;
        _this4._translate = translate;
        _transform__WEBPACK_IMPORTED_MODULE_8__.transform.apply(_this4, [translate]);
        if (_this4._overshooting) {
          _this4._overshooting = false;
          _overshoot__WEBPACK_IMPORTED_MODULE_9__.overshootChange.apply(_this4, [_this4._translate > 0 ? leftActions : rightActions]);
        }
        _confirm__WEBPACK_IMPORTED_MODULE_10__.confirmCancel.apply(_this4, []);
        if (!rebSize) {
          (0,_events__WEBPACK_IMPORTED_MODULE_6__.onOnceTransitionEnd)(contentEl, function () {
            resolve();
            if (_this4._direction !== __direction) {
              _this4.emit('show', {
                direction: __direction,
                currentTarget: contentEl,
                timestamp: Date.now(),
                sourceEvent: null
              });
              _this4._direction = __direction;
            }
          });
        }
      };
      // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
      if (rebounce > 0 && (maxTranslate > 0 && _this4._translate < maxTranslate || maxTranslate < 0 && _this4._translate > maxTranslate)) {
        (0,_events__WEBPACK_IMPORTED_MODULE_6__.onOnceTransitionEnd)(contentEl, function () {
          return show();
        });
        show(rebounce * factor);
      } else {
        show();
      }
    });
  };
  _proto.hide = function hide() {
    var _this5 = this;
    var contentEl = this.contentEl,
      leftActions = this.leftActions,
      rightActions = this.rightActions;
    if (this._destory || this._translate === 0 || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
      return _babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4___default().resolve();
    }
    return new (_babel_runtime_corejs3_core_js_promise__WEBPACK_IMPORTED_MODULE_4___default())(function (resolve) {
      _this5._translate = 0;
      _transform__WEBPACK_IMPORTED_MODULE_8__.transform.apply(_this5, [0]);
      // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
      (0,_events__WEBPACK_IMPORTED_MODULE_6__.onOnceTransitionEnd)(contentEl, function () {
        resolve();
        if (_this5._overshooting) {
          _this5._overshooting = false;
          _overshoot__WEBPACK_IMPORTED_MODULE_9__.overshootChange.apply(_this5, [_this5._translate > 0 ? leftActions : rightActions]);
        }
        _confirm__WEBPACK_IMPORTED_MODULE_10__.confirmCancel.apply(_this5, []);
        if (_this5._direction !== 'none') {
          _this5.emit('hide', {
            direction: 'none',
            currentTarget: contentEl,
            timestamp: Date.now(),
            sourceEvent: null
          });
          _this5._direction = 'none';
        }
      });
    });
  };
  _proto.destory = function destory() {
    // 解除所有事件
    _EventTarget.prototype.off.call(this);
    // 销毁底层事件
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
    }
    this._destory = true;
    this.leftActions = null;
    this.rightActions = null;
    this._confirming = null;
    this._startPoint = null;
    this.contentEl = null;
    this.leftEl = null;
    this.rightEl = null;
    if (this.element) {
      // 删除元素，用户可以在调用该方法之前加一个删除动画
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
  };
  return SlideView;
}(_huangjs888_gesture__WEBPACK_IMPORTED_MODULE_5__.EventTarget);
/* harmony default export */ __webpack_exports__["default"] = (SlideView);
}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=slide-view.js.map