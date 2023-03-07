"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
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
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _event = _interopRequireDefault(require("./event"));
var _agent = _interopRequireWildcard(require("./agent"));
var _util = require("./util");
var _css = _interopRequireDefault(require("./css"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var generate = function generate(container, className) {
  var tempContainer;
  if (typeof container === 'string') {
    tempContainer = document.querySelector(container);
  } else {
    tempContainer = container;
  }
  if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
    throw new Error('Please pass in a valid container element...');
  }
  (0, _util.styleInject)(_css.default);
  var view = (0, _util.addClass)(document.createElement('div'), "hjs-slide-view ".concat(className || ''));
  var element = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__middle');
  var leftElement = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__left');
  leftElement.appendChild((0, _util.addClass)(document.createElement('div'), 'hjs-slideview__buttons'));
  var rightElement = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__right');
  rightElement.appendChild((0, _util.addClass)(document.createElement('div'), 'hjs-slideview__buttons'));
  view.appendChild(leftElement);
  view.appendChild(element);
  view.appendChild(rightElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(view);
  return element;
};
var cTransform = function cTransform(index, confirm) {
  var rebSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.duration;
  var _buttons = this._buttons,
    _translateX = this._translateX;
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 前面已有按钮的滑动距离
  var leftTransformTotal = 0;
  var rightTransformTotal = 0;
  var _loop = function _loop() {
    var _buttons$i = _buttons[i],
      btnEl = _buttons$i.element,
      width = _buttons$i.width,
      position = _buttons$i.position,
      slideOut = _buttons$i.slideOut;
    var factor = _translateX === 0 ? 0 : _translateX / Math.abs(_translateX);
    if (i === index) {
      // 当前的按钮将进行变换展示
      var btnChild = btnEl.firstChild;
      (0, _util.setStyle)(btnChild.firstChild, {
        display: confirm ? 'none' : 'block'
      });
      (0, _util.setStyle)(btnChild.lastChild, {
        display: confirm ? 'block' : 'none'
      });
      var transformx = confirm ? _translateX : factor * (width + (position === 'left' ? leftTransformTotal : rightTransformTotal));
      (0, _util.setStyle)(btnEl, {
        width: confirm ? Math.abs(_translateX + rebSize * factor) : duration > 0 && !slideOut ? width : 'auto',
        transform: "translate3d(".concat(transformx + rebSize * factor, "px, 0, 0)"),
        transition: duration <= 0 ? '' : "width ".concat(duration, "s, transform ").concat(duration, "s")
      });
      if (!confirm && !slideOut && duration > 0) {
        // 因为width直接设置auto，是没有动画过程的
        (0, _agent.onOnceTransitionEnd)(btnEl, function () {
          return (0, _util.setStyle)(btnEl, {
            width: 'auto'
          });
        });
      }
    } else if (i > index) {
      // 注意，这里不分position，因为大于index的都是压在上面的，压在下面的不需要变换
      // 压在上面的收起
      var _transformx = confirm ? 0 : factor * (width + (position === 'left' ? leftTransformTotal : rightTransformTotal));
      (0, _util.setStyle)(btnEl, {
        transform: "translate3d(".concat(_transformx, "px, 0, 0)"),
        transition: duration <= 0 ? '' : "transform ".concat(duration, "s")
      });
    }
    if (position === 'left') {
      leftTransformTotal += width;
    } else {
      rightTransformTotal += width;
    }
  };
  for (var i = _buttons.length - 1; i >= 0; i--) {
    _loop();
  }
};
var transform = function transform(moveX, positive, status) {
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.duration;
  var element = this.element,
    _buttons = this._buttons,
    _slideRange = this._slideRange;
  var _ref = _slideRange || [0, 0],
    _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    slideMin = _ref2[0],
    slideMax = _ref2[1];
  if (!_buttons || !_buttons.length) {
    return;
  }
  (0, _util.setStyle)(element, {
    transform: "translate3d(".concat(moveX, "px, 0, 0)"),
    transition: duration <= 0 || status === 2 ? '' : "transform ".concat(duration, "s")
  });
  // 前面已有按钮的占比距离
  var leftTransformTotal = 0;
  var rightTransformTotal = 0;
  for (var i = _buttons.length - 1; i >= 0; i--) {
    var _buttons$i2 = _buttons[i],
      btnEl = _buttons$i2.element,
      width = _buttons$i2.width,
      lastOne = _buttons$i2.lastOne,
      position = _buttons$i2.position,
      icon = _buttons$i2.icon;
    var btnChild = btnEl.firstChild;
    // 当前按钮需要滑出的占比距离
    var transformb = width / Math.abs(position === 'left' ? slideMax : slideMin) * moveX;
    // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
    var transformx = transformb + (position === 'left' ? leftTransformTotal : rightTransformTotal);
    // 左边或右边的最后一个按钮
    // (leftTransformTotal === 0 && position === 'left') ||  (rightTransformTotal === 0 && position === 'right')
    if (lastOne) {
      if (!icon) {
        var _setStyle;
        (0, _util.setStyle)(btnChild, (_setStyle = {}, (0, _defineProperty2.default)(_setStyle, "padding-".concat(position), (Math.abs(transformb) <= width ? 0 : Math.abs(status === 1 ? moveX : transformx) - width) + 16), (0, _defineProperty2.default)(_setStyle, "transition", duration <= 0 ? '' : "padding-".concat(position, " ").concat(duration, "s ease ").concat(duration * (positive ? 1 : -1) * (position === 'right' ? 1 : -1), "s")), _setStyle));
      } else {
        var _setStyle2;
        (0, _util.setStyle)(btnChild, (_setStyle2 = {}, (0, _defineProperty2.default)(_setStyle2, "padding-".concat(position), Math.abs(transformb) > width && status === 1 ? Math.abs(moveX) - width : 0), (0, _defineProperty2.default)(_setStyle2, "transition", duration <= 0 ? '' : "padding-".concat(position, " ").concat(duration, "s")), _setStyle2));
      }
      (0, _util.setStyle)(btnEl, {
        transform: "translate3d(".concat(status === 1 ? moveX : transformx, "px, 0, 0)"),
        transition: duration <= 0 ? '' : "transform ".concat(duration, "s")
      });
    } else {
      if (!icon) {
        var _setStyle3;
        (0, _util.setStyle)(btnChild, (_setStyle3 = {}, (0, _defineProperty2.default)(_setStyle3, "padding-".concat(position), (Math.abs(transformb) <= width ? 0 : Math.abs(transformx) - width) + 16), (0, _defineProperty2.default)(_setStyle3, "transition", duration <= 0 || status === 2 ? '' : "padding-".concat(position, " ").concat(duration, "s ease ").concat(duration * (positive ? 1 : -1) * (position === 'right' ? 1 : -1), "s")), _setStyle3));
      }
      (0, _util.setStyle)(btnEl, {
        transform: "translate3d(".concat(transformx, "px, 0, 0)"),
        transition: duration <= 0 || status === 2 ? '' : "transform ".concat(duration, "s")
      });
    }
    // 累计已滑出按钮的占比距离
    if (position === 'left') {
      leftTransformTotal += transformb;
    } else {
      rightTransformTotal += transformb;
    }
  }
};
var start = function start(e) {
  if (!this._buttons || this.disable) {
    return;
  }
  this._isMoving = true;
  this._startTX = this._translateX;
  this._startPoint = e.point;
  this._slideAngle = 0;
  this._slideStatus = 0;
  this._timeStamp = 0;
};
var move = function move(e) {
  if (!this._buttons || this.disable || !this._isMoving || !this._startPoint) {
    return;
  }
  var pageX = e.point[0] - this._startPoint[0];
  var pageY = e.point[1] - this._startPoint[1];
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (this._slideAngle === 0) {
    this._slideAngle = Math.abs(pageX) - Math.abs(pageY);
  }
  if (this._slideAngle < 0) {
    return;
  }
  // 滑动距离
  var moveX = 0;
  var duration = 0;
  var slideX = this._startTX + pageX;
  var _ref3 = this._slideRange || [0, 0],
    _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
    slideMin = _ref4[0],
    slideMax = _ref4[1];
  if (slideX <= slideMin) {
    if (slideMin === 0) {
      // 如果最小等于0，表示只有左边按钮，则可以重置初始值
      this._startPoint = e.point;
      this._startTX = this._translateX;
      this._slideAngle = 0;
      this._slideStatus = 0;
      this._timeStamp = 0;
      moveX = 0;
    } else {
      if (this.fullSlide) {
        var elWidth = this.element.getBoundingClientRect().width;
        var threshold = -Math.max(elWidth * 0.75, Math.abs(slideMin));
        var timeStamp = e.sourceEvent instanceof MouseEvent ? e.sourceEvent.timeStamp : e.sourceEvent.sourceEvent.timeStamp;
        if (slideX <= threshold) {
          if (this._slideStatus !== 1) {
            this._timeStamp = timeStamp;
            this._slideStatus = 1;
          }
          moveX = (this.rebounce ? (0, _util.rebounceSize)(slideX - threshold) : 0) - elWidth * 0.95;
          duration = Math.max(0, this.duration - (timeStamp - this._timeStamp) / 1000);
        } else {
          if (this._slideStatus === 0) {
            // 从[slideMin,0]进入[threshold,slideMin]之间
            this._timeStamp = 0;
          } else if (this._slideStatus === 1) {
            // 从[-Infinity,threshold]进入[threshold,slideMin]之间
            this._timeStamp = timeStamp;
            this._slideStatus = 2;
          }
          moveX = slideX;
          duration = Math.max(0, this.duration / 2 - (timeStamp - this._timeStamp) / 1000);
        }
      } else {
        moveX = (this.rebounce ? (0, _util.rebounceSize)(slideX - Math.min(slideMin, this._startTX)) : 0) + Math.min(slideMin, this._startTX);
      }
    }
  } else if (slideX < slideMax) {
    // 滑动距离在最大最小之间，逐步滑动
    moveX = slideX;
    this._slideStatus = 0;
    this._timeStamp = 0;
  } else {
    if (slideMax === 0) {
      // 如果最大等于0，表示只有右边按钮，则可以重置初始值
      this._startPoint = e.point;
      this._startTX = this._translateX;
      this._slideAngle = 0;
      this._slideStatus = 0;
      this._timeStamp = 0;
      moveX = 0;
    } else {
      if (this.fullSlide) {
        var _elWidth = this.element.getBoundingClientRect().width;
        var _threshold = Math.max(_elWidth * 0.75, Math.abs(slideMax));
        var _timeStamp = e.sourceEvent instanceof MouseEvent ? e.sourceEvent.timeStamp : e.sourceEvent.sourceEvent.timeStamp;
        if (slideX >= _threshold) {
          if (this._slideStatus !== 1) {
            this._timeStamp = _timeStamp;
            this._slideStatus = 1;
          }
          moveX = (this.rebounce ? (0, _util.rebounceSize)(slideX - _threshold) : 0) + _elWidth * 0.95;
          duration = Math.max(0, this.duration - (_timeStamp - this._timeStamp) / 1000);
        } else {
          if (this._slideStatus === 0) {
            // 从[0,slideMax]进入[slideMax,threshold]之间
            this._timeStamp = 0;
          } else if (this._slideStatus === 1) {
            // 从[threshold,+Infinity]进入[slideMax,threshold]之间
            this._timeStamp = _timeStamp;
            this._slideStatus = 2;
          }
          moveX = slideX;
          duration = Math.max(0, this.duration / 2 - (_timeStamp - this._timeStamp) / 1000);
        }
      } else {
        moveX = (this.rebounce ? (0, _util.rebounceSize)(slideX - Math.max(slideMax, this._startTX)) : 0) + Math.max(slideMax, this._startTX);
      }
    }
  }
  if (this._confirmIndex !== -1) {
    // 如果当前处于按钮确认状态，滑动之前需要先取消
    cTransform.apply(this, [this._confirmIndex, false, 0, 0]);
    this._confirmIndex = -1;
  }
  var positive = moveX > this._translateX;
  this._translateX = moveX;
  transform.apply(this, [moveX, positive, this._slideStatus, duration]);
  return false; // 禁止垂直方向的滑动
};

var end = function end(e) {
  var _this = this;
  if (!this._buttons || this.disable || !this._isMoving || this._slideAngle < 0 || !this._startPoint) {
    return;
  }
  if (this.fullSlide && this._slideStatus === 1) {
    var index = this._buttons.findIndex(function (_ref5) {
      var lastOne = _ref5.lastOne,
        position = _ref5.position;
      return lastOne && (_this._translateX > 0 && position === 'left' || _this._translateX < 0 && position === 'right');
    });
    buttonSlide.apply(this, [e, index]);
  } else if (this._translateX === 0 ||
  // 这个判断是因为手势里默认移动距离在3px以内不算移动
  (0, _util.getDistance)(this._startPoint, e.point) < 3 || this._translateX < 0 && (e.point[0] - this._startPoint[0] >= 0 || this._translateX > -this.throttle) || this._translateX > 0 && (e.point[0] - this._startPoint[0] <= 0 || this._translateX < this.throttle)) {
    this.hideButton();
  } else {
    this.showButton(this._translateX > 0 ? 'left' : 'right');
  }
  this._isMoving = false;
  this._startTX = 0;
  this._startPoint = [0, 0];
  this._slideAngle = 0;
  this._slideStatus = 0;
  this._timeStamp = 0;
};
var press = function press(e) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('press', {
      currentTarget: this.element,
      timeStamp: Date.now(),
      sourceEvent: e
    });
  }
};
var longPress = function longPress(e) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('longPress', {
      currentTarget: this.element,
      timeStamp: Date.now(),
      sourceEvent: e
    });
  }
};
var doublePress = function doublePress(e) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('doublePress', {
      currentTarget: this.element,
      timeStamp: Date.now(),
      sourceEvent: e
    });
  }
};
var buttonPress = function buttonPress(e) {
  var _this2 = this;
  // 表示按钮处于收起隐藏状态
  if (this._translateX === 0 || !this._buttons) {
    return;
  }
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = sourceEvent instanceof MouseEvent ? sourceEvent.target : sourceEvent.sourceEvent.target;
  while (target !== currentTarget && !target.getAttribute('data-index')) {
    target = target.parentNode;
  }
  var index = +(target.getAttribute('data-index') || -1);
  if (index >= 0 && this._buttons[index]) {
    var _this$_buttons$index = this._buttons[index],
      lastOne = _this$_buttons$index.lastOne,
      confirm = _this$_buttons$index.confirm,
      slideOut = _this$_buttons$index.slideOut,
      data = _this$_buttons$index.data;
    // 最后一个按钮单独处理
    if (this.fullSlide && lastOne) {
      buttonSlide.apply(this, [e, index, target]);
      return;
    }
    // 如果是再次确认或者首次无需确认，则直接执行
    var type = 'buttonPress';
    if (this._confirmIndex === index || !confirm) {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (slideOut) {
        this.hideButton();
      } else {
        cTransform.apply(this, [index, false]);
        this._confirmIndex = -1;
      }
    } else {
      // 当前事件需要确认，设置回弹效果
      if (this.rebounce) {
        cTransform.apply(this, [index, true, SlideView.REBOUNCE_SIZE]);
        (0, _agent.onOnceTransitionEnd)(this._buttons[index].element, function () {
          cTransform.apply(_this2, [index, true]);
        });
      } else {
        cTransform.apply(this, [index, true]);
      }
      this._confirmIndex = index;
      type = 'buttonConfirm';
    }
    this.trigger(type, {
      index: index,
      data: data,
      currentTarget: target,
      timeStamp: Date.now(),
      sourceEvent: e
    });
  }
};
var buttonSlide = function buttonSlide(event, index, target) {
  // 表示按钮处于收起隐藏状态
  if (this._translateX === 0 || !this._buttons || !this._buttons[index]) {
    return;
  }
  var type = 'buttonPress';
  var _this$_buttons$index2 = this._buttons[index],
    element = _this$_buttons$index2.element,
    confirm = _this$_buttons$index2.confirm,
    slideOut = _this$_buttons$index2.slideOut,
    data = _this$_buttons$index2.data;
  // 此时是滑满之后的二次点击
  if (this._confirmIndex === index) {
    if (slideOut) {
      this.hideButton();
    } else {
      this.showButton(this._translateX > 0 ? 'left' : 'right');
      this._confirmIndex = -1;
    }
  }
  // 此时是滑动到最满，或者点最后一个按钮，滑满
  else {
    var moveX = (this._translateX > 0 ? 1 : -1) * this.element.getBoundingClientRect().width;
    var positive = this._translateX < moveX;
    this._translateX = moveX;
    transform.apply(this, [moveX, positive, 1]);
    if (confirm) {
      type = 'buttonConfirm';
      this._confirmIndex = index;
    }
  }
  this.trigger(type, {
    index: index,
    data: data,
    currentTarget: target || element,
    timeStamp: Date.now(),
    sourceEvent: event
  });
};
var SlideView = /*#__PURE__*/function (_EventTarget) {
  (0, _inherits2.default)(SlideView, _EventTarget);
  var _super = _createSuper(SlideView);
  // 触发滑动的元素
  // 禁止按钮滑出
  // 按钮滑出动画时间（秒级）
  // 按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  // 滑出时是否有弹性效果
  // 是否启用最后一个按钮覆盖滑动
  // 按钮状态，已滑出（展开）

  // 当前正在确认的按钮
  // 元素当前位移值
  // 手指滑出时与水平角度值（非真实角度，只是xy差，反映是否小于45度）
  // 滑动状态
  // element逐步移动最大范围
  // 手指放上后初始点
  // 手指放上那一刻，translateX值
  // 移动时的时间戳
  // 是否正在滑动

  // 按钮集合

  function SlideView(options) {
    var _this3;
    (0, _classCallCheck2.default)(this, SlideView);
    _this3 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "disable", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "duration", 0.4);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "throttle", 60);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "rebounce", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "fullSlide", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_shown", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_destory", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_confirmIndex", -1);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_translateX", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_slideAngle", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_slideStatus", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_slideRange", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_startPoint", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_startTX", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_timeStamp", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_isMoving", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_buttons", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_agents", null);
    var container = options.container,
      className = options.className,
      content = options.content,
      buttons = options.buttons,
      duration = options.duration,
      throttle = options.throttle,
      _options$disable = options.disable,
      disable = _options$disable === void 0 ? false : _options$disable,
      _options$rebounce = options.rebounce,
      rebounce = _options$rebounce === void 0 ? true : _options$rebounce,
      _options$fullSlide = options.fullSlide,
      fullSlide = _options$fullSlide === void 0 ? false : _options$fullSlide;
    _this3.element = generate(container, className);
    _this3._agents = [(0, _agent.default)(_this3.element, {
      start: start.bind((0, _assertThisInitialized2.default)(_this3)),
      move: move.bind((0, _assertThisInitialized2.default)(_this3)),
      end: end.bind((0, _assertThisInitialized2.default)(_this3)),
      press: press.bind((0, _assertThisInitialized2.default)(_this3)),
      longPress: longPress.bind((0, _assertThisInitialized2.default)(_this3)),
      doublePress: doublePress.bind((0, _assertThisInitialized2.default)(_this3))
    })];
    _this3.setContent(content);
    _this3.setButtons(buttons);
    _this3._destory = false;
    _this3.disable = disable || false;
    _this3.duration = (duration || 400) / 1000;
    _this3.throttle = throttle || 40;
    _this3.rebounce = rebounce;
    _this3.fullSlide = fullSlide;
    return _this3;
  }
  (0, _createClass2.default)(SlideView, [{
    key: "setDisable",
    value: function setDisable() {
      var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this._destory) {
        return;
      }
      this.disable = disable;
    }
  }, {
    key: "setRebounce",
    value: function setRebounce() {
      var rebounce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this._destory) {
        return;
      }
      this.rebounce = rebounce;
    }
  }, {
    key: "setDuration",
    value: function setDuration() {
      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this._destory) {
        return;
      }
      this.duration = duration / 1000;
    }
  }, {
    key: "setThrottle",
    value: function setThrottle() {
      var throttle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this._destory) {
        return;
      }
      this.throttle = throttle;
    }
  }, {
    key: "setFullSlide",
    value: function setFullSlide() {
      var fullSlide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this._destory) {
        return;
      }
      this.fullSlide = fullSlide;
    }
  }, {
    key: "setButtons",
    value: function setButtons(buttons) {
      var _this4 = this;
      if (this._destory) {
        return;
      }
      var btnPos = this._translateX === 0 ? null : this._translateX > 0 ? 'left' : 'right';
      // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
      this.hideButton().then(function () {
        var _this4$element$previo, _this4$element$nextSi;
        var leftBtnElement = (_this4$element$previo = _this4.element.previousSibling) === null || _this4$element$previo === void 0 ? void 0 : _this4$element$previo.firstChild;
        leftBtnElement.innerHTML = '';
        if (_this4._agents && !_this4._agents[1]) {
          _this4._agents[1] = (0, _agent.default)(leftBtnElement, {
            press: buttonPress.bind(_this4)
          });
        }
        var rightBtnElement = (_this4$element$nextSi = _this4.element.nextSibling) === null || _this4$element$nextSi === void 0 ? void 0 : _this4$element$nextSi.firstChild;
        rightBtnElement.innerHTML = '';
        if (_this4._agents && !_this4._agents[2]) {
          _this4._agents[2] = (0, _agent.default)(rightBtnElement, {
            press: buttonPress.bind(_this4)
          });
        }
        var leftMax = 0;
        var rightMax = 0;
        var lastLeftIndex = -1;
        var lastRightIndex = -1;
        _this4._buttons = (buttons || []).map(function (_ref6, index) {
          var className = _ref6.className,
            icon = _ref6.icon,
            width = _ref6.width,
            height = _ref6.height,
            text = _ref6.text,
            confirmText = _ref6.confirmText,
            color = _ref6.color,
            background = _ref6.background,
            _ref6$position = _ref6.position,
            position = _ref6$position === void 0 ? 'right' : _ref6$position,
            _ref6$slideOut = _ref6.slideOut,
            slideOut = _ref6$slideOut === void 0 ? true : _ref6$slideOut,
            data = _ref6.data;
          var btnWrap = (0, _util.addClass)(document.createElement('div'), "hjs-slideview__btn__wrap ".concat(className || ''));
          btnWrap.setAttribute('data-index', String(index));
          var btn = (0, _util.setStyle)((0, _util.addClass)(document.createElement('div'), 'hjs-slideview__btn'), {
            color: color,
            background: background,
            width: width || '100%',
            height: height || '100%',
            padding: icon ? 0 : '0 16px',
            margin: icon ? '0 10px' : 0,
            borderRadius: icon ? !height ? '50%' : (typeof height === 'string' ? parseInt(height, 10) : height) / 2 : 0
          });
          if (icon) {
            var src = icon.src,
              cls = icon.className,
              w = icon.width,
              h = icon.height;
            if (src) {
              var btnImg = document.createElement('img');
              btnImg.src = src;
              if (typeof w === 'string') {
                btnImg.width = parseInt(w, 10);
              } else if (typeof w === 'number') {
                btnImg.width = w;
              }
              if (typeof h === 'string') {
                btnImg.height = parseInt(h, 10);
              } else if (typeof h === 'number') {
                btnImg.height = h;
              }
              btn.appendChild((0, _util.addClass)(btnImg, cls || ''));
            } else {
              btn.appendChild((0, _util.setStyle)((0, _util.addClass)(document.createElement('i'), cls || ''), {
                width: width,
                height: height
              }));
            }
          } else {
            var btnText = document.createElement('span');
            btnText.innerText = String(text);
            btn.appendChild(btnText);
            if (confirmText) {
              var btnCText = document.createElement('span');
              btnCText.innerText = String(confirmText);
              (0, _util.setStyle)(btnCText, {
                display: 'none'
              });
              btn.appendChild(btnCText);
            }
          }
          btnWrap.appendChild(btn);
          if (position === 'left') {
            leftBtnElement.appendChild(btnWrap);
          } else {
            rightBtnElement.appendChild(btnWrap);
          }
          var btnWidth = btnWrap.getBoundingClientRect().width;
          if (position === 'left') {
            leftMax += btnWidth;
            lastLeftIndex = index;
          } else {
            rightMax += btnWidth;
            lastRightIndex = index;
          }
          return {
            element: btnWrap,
            width: btnWidth,
            position: position,
            slideOut: slideOut,
            icon: !!icon,
            confirm: !!confirmText,
            lastOne: false,
            data: data
          };
        });
        if (lastLeftIndex !== -1) {
          _this4._buttons[lastLeftIndex].lastOne = true;
        }
        if (lastRightIndex !== -1) {
          _this4._buttons[lastRightIndex].lastOne = true;
        }
        _this4._slideRange = [-rightMax, leftMax];
        if (btnPos) {
          _this4.showButton(btnPos);
        }
      });
    }
  }, {
    key: "setContent",
    value: function setContent(content) {
      if (this._destory) {
        return;
      }
      var tempChild;
      if (typeof content === 'string') {
        tempChild = document.querySelector(content);
      } else {
        tempChild = content;
      }
      if (tempChild) {
        this.element.innerHTML = '';
        this.element.appendChild(tempChild);
      }
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      var _this5 = this;
      return new Promise(function (resolve) {
        if (_this5._destory || !_this5._buttons) {
          resolve();
          return;
        }
        if (_this5._translateX === 0 && _this5._shown) {
          resolve();
          _this5.trigger('hide', {
            currentTarget: _this5.element,
            timeStamp: Date.now(),
            sourceEvent: null
          });
          _this5._shown = false;
          return;
        }
        var positive = _this5._translateX < 0;
        _this5._translateX = 0;
        transform.apply(_this5, [0, positive, 0]);
        (0, _agent.onOnceTransitionEnd)(_this5.element, function () {
          resolve(); // 如果当前处于按钮确认状态，隐藏之前需要先取消
          if (_this5._confirmIndex !== -1) {
            cTransform.apply(_this5, [_this5._confirmIndex, false]);
            _this5._confirmIndex = -1;
          }
          if (_this5._shown) {
            _this5.trigger('hide', {
              currentTarget: _this5.element,
              timeStamp: Date.now(),
              sourceEvent: null
            });
            _this5._shown = false;
          }
        });
      });
    }
  }, {
    key: "showButton",
    value: function showButton(position) {
      var _this6 = this;
      return new Promise(function (resolve) {
        if (_this6._destory) {
          resolve();
          return;
        }
        var _ref7 = _this6._slideRange || [0, 0],
          _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
          slideMin = _ref8[0],
          slideMax = _ref8[1];
        var pos = slideMin === 0 ? 'left' : slideMax === 0 ? 'right' : position;
        var max = pos === 'left' ? slideMax : slideMin;
        if (_this6._translateX === max && !_this6._shown) {
          resolve();
          _this6.trigger('show', {
            currentTarget: _this6.element,
            timeStamp: Date.now(),
            sourceEvent: null
          });
          _this6._shown = true;
          return;
        }
        var show = function show() {
          var rebSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var factor = pos === 'left' ? 1 : -1;
          var moveX = max + rebSize * factor;
          var positive = moveX > _this6._translateX;
          _this6._translateX = moveX;
          transform.apply(_this6, [moveX, positive, 0]);
          if (!rebSize) {
            (0, _agent.onOnceTransitionEnd)(_this6.element, function () {
              resolve();
              if (!_this6._shown) {
                _this6.trigger('show', {
                  currentTarget: _this6.element,
                  timeStamp: Date.now(),
                  sourceEvent: null
                });
                _this6._shown = true;
              }
            });
          }
        };
        // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
        if (_this6.rebounce && Math.abs(_this6._translateX) < Math.abs(max)) {
          show(SlideView.REBOUNCE_SIZE);
          (0, _agent.onOnceTransitionEnd)(_this6.element, function () {
            return show();
          });
        } else {
          show();
        }
      });
    }
  }, {
    key: "toggleButton",
    value: function toggleButton(position) {
      if (this._destory) {
        return;
      }
      return this._translateX === 0 ? this.showButton(position) : this.hideButton();
    }
  }, {
    key: "destory",
    value: function destory() {
      var _this$_agents, _viewEl$parentNode;
      // 解除所有事件
      (0, _get2.default)((0, _getPrototypeOf2.default)(SlideView.prototype), "off", this).call(this);
      // 销毁底层事件
      (_this$_agents = this._agents) === null || _this$_agents === void 0 ? void 0 : _this$_agents.forEach(function (a) {
        return a && a.destory();
      });
      this._agents = null;
      this._destory = true;
      this._buttons = null;
      this._slideRange = null;
      this._startPoint = null;
      // 删除元素，用户可以在调用该方法之前加一个删除动画
      var viewEl = this.element.parentNode;
      (_viewEl$parentNode = viewEl.parentNode) === null || _viewEl$parentNode === void 0 ? void 0 : _viewEl$parentNode.removeChild(viewEl);
    }
  }]);
  return SlideView;
}(_event.default);
(0, _defineProperty2.default)(SlideView, "REBOUNCE_SIZE", 12);
var _default = SlideView;
exports.default = _default;