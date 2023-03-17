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
var confirmStyle = function confirmStyle(ele, confirm, icon, position, _ref) {
  var text = _ref.text,
    otext = _ref.otext,
    src = _ref.src,
    osrc = _ref.osrc,
    cls = _ref.cls,
    _ref$ocls = _ref.ocls,
    ocls = _ref$ocls === void 0 ? '' : _ref$ocls;
  if (!icon) {
    ele.firstChild.innerText = String(!confirm ? otext : text || otext);
    (0, _util.setStyle)(ele, {
      justifyContent: confirm ? 'center' : position === 'left' ? 'flex-end' : 'flex-start'
    });
  } else {
    osrc && (ele.firstChild.src = !confirm ? osrc : src || osrc);
    (0, _util.addClass)((0, _util.removeClass)(ele, confirm ? ocls : cls || ocls), !confirm ? ocls : cls || ocls);
  }
};
var cTransform = function cTransform(index, confirm) {
  var rebSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.duration;
  var element = this.element,
    _buttons = this._buttons,
    _translateX = this._translateX;
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 在下一侦进行动画过渡
  window.requestAnimationFrame(function () {
    // 前面已有按钮的滑动距离
    var transformTotal = {
      left: 0,
      right: 0
    };
    for (var i = _buttons.length - 1; i >= 0; i--) {
      var _buttons$i = _buttons[i],
        btnEl = _buttons$i.element,
        width = _buttons$i.width,
        icon = _buttons$i.icon,
        position = _buttons$i.position,
        indexPos = _buttons$i.indexPos,
        confirmInfo = _buttons$i.confirm;
      // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translateX等于0了，所以无需再判断
      var factor = _translateX === 0 ? 0 : _translateX / Math.abs(_translateX);
      var multi = indexPos === 'first-last' ? 2 : 1;
      if (i === index) {
        var transformx = 0;
        if (confirm) {
          transformx = multi * _translateX + rebSize * factor;
        } else {
          transformx = (width + transformTotal[position]) * factor;
        }
        (0, _util.setStyle)(btnEl, {
          width: confirm ? Math.abs(transformx) : width,
          transform: "translate3d(".concat(transformx, "px, 0, 0)"),
          transition: duration <= 0 ? '' : "width ".concat(duration, "s, transform ").concat(duration, "s")
        });
        // 如果是仅有一个按钮，确认的时候宽度设置2倍变化
        if (multi === 2) {
          (0, _util.setStyle)(element, {
            transform: "translate3d(".concat(confirm ? multi * _translateX : _translateX, "px, 0, 0)"),
            transition: duration <= 0 ? '' : "transform ".concat(duration, "s")
          });
        }
        // 如果是icon类型，需要对子元素处理宽度变换
        var btnChild = btnEl.firstChild;
        if (icon) {
          (0, _util.setStyle)(btnChild, {
            width: confirm ? '100%' : width - 20,
            // 减去20是因为按钮子元素的margin左右最初值是10
            transition: duration <= 0 ? '' : "width ".concat(duration, "s")
          });
        }
        confirmInfo && confirmStyle(btnChild, confirm, icon, position, confirmInfo);
      } else if (i > index) {
        var _transformx = 0;
        if (!confirm) {
          _transformx = (width + transformTotal[position]) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        (0, _util.setStyle)(btnEl, {
          transform: "translate3d(".concat(_transformx, "px, 0, 0)"),
          transition: duration <= 0 ? '' : "transform ".concat(duration, "s")
        });
      }
      transformTotal[position] += width;
    }
  });
};
var transform = function transform(moveX, status) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.duration;
  var element = this.element,
    _buttons = this._buttons,
    _slideRange = this._slideRange;
  var _ref2 = _slideRange || [0, 0],
    _ref3 = (0, _slicedToArray2.default)(_ref2, 2),
    slideMin = _ref3[0],
    slideMax = _ref3[1];
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 在下一侦进行动画过渡
  window.requestAnimationFrame(function () {
    (0, _util.setStyle)(element, {
      transform: "translate3d(".concat(moveX, "px, 0, 0)"),
      transition: duration <= 0 || status === 2 ? '' : "transform ".concat(duration, "s")
    });
    // 前面已有按钮的占比距离
    var transformTotal = {
      left: 0,
      right: 0
    };
    for (var i = _buttons.length - 1; i >= 0; i--) {
      var _buttons$i2 = _buttons[i],
        btnEl = _buttons$i2.element,
        width = _buttons$i2.width,
        indexPos = _buttons$i2.indexPos,
        position = _buttons$i2.position,
        icon = _buttons$i2.icon;
      // 当前按钮需要滑出的占比距离
      var transformb = width / Math.abs(position === 'left' ? slideMax : slideMin) * moveX;
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      var transformx = transformb + transformTotal[position];
      // 左边或右边的最后一个按钮
      var mWidth = Math.max(Math.abs(transformb), width);
      if (indexPos === 'last' || indexPos === 'first-last') {
        if (icon) {
          var _setStyle;
          (0, _util.setStyle)(btnEl.firstChild, (_setStyle = {}, (0, _defineProperty2.default)(_setStyle, "padding-".concat(position), (status === 1 ? Math.abs(moveX) : width) - width), (0, _defineProperty2.default)(_setStyle, "transition", duration <= 0 ? '' : "padding-".concat(position, " ").concat(duration, "s")), _setStyle));
        }
        (0, _util.setStyle)(btnEl, {
          width: (status === 1 ? Math.abs(moveX) : mWidth) + (icon ? 0 : 1),
          // 1px闪动问题
          transform: "translate3d(".concat(status === 1 ? moveX : transformx, "px, 0, 0)"),
          transition: duration <= 0 ? '' : "transform ".concat(duration, "s, width ").concat(duration, "s")
        });
      } else {
        (0, _util.setStyle)(btnEl, {
          width: mWidth + (icon ? 0 : 1),
          // 1px闪动问题
          transform: "translate3d(".concat(transformx, "px, 0, 0)"),
          transition: duration <= 0 || status === 2 ? '' : "transform ".concat(duration, "s, width ").concat(duration, "s")
        });
      }
      // 累计已滑出按钮的占比距离
      transformTotal[position] += transformb;
    }
  });
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
  var _ref4 = this._slideRange || [0, 0],
    _ref5 = (0, _slicedToArray2.default)(_ref4, 2),
    slideMin = _ref5[0],
    slideMax = _ref5[1];
  var elWidth = this.element.getBoundingClientRect().width;
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
        var _threshold = Math.max(elWidth * 0.75, Math.abs(slideMax));
        var _timeStamp = e.sourceEvent instanceof MouseEvent ? e.sourceEvent.timeStamp : e.sourceEvent.sourceEvent.timeStamp;
        if (slideX >= _threshold) {
          if (this._slideStatus !== 1) {
            this._timeStamp = _timeStamp;
            this._slideStatus = 1;
          }
          moveX = (this.rebounce ? (0, _util.rebounceSize)(slideX - _threshold) : 0) + elWidth * 0.95;
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
  moveX = (moveX > 0 ? 1 : -1) * Math.min(elWidth, Math.abs(moveX));
  this._translateX = moveX;
  transform.apply(this, [moveX, this._slideStatus, duration]);
  return false; // 禁止垂直方向的滑动
};

var end = function end(e) {
  var _this = this;
  if (!this._buttons || this.disable || !this._isMoving || this._slideAngle < 0 || !this._startPoint) {
    return;
  }
  if (this.fullSlide && this._slideStatus === 1) {
    var index = this._buttons.findIndex(function (_ref6) {
      var indexPos = _ref6.indexPos,
        position = _ref6.position;
      return (indexPos === 'last' || indexPos === 'first-last') && (_this._translateX > 0 && position === 'left' || _this._translateX < 0 && position === 'right');
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
  // 没有使用this._shown判断，是因为该值变化是要动画结束后变化，this._translateX变化是动画执行前
  // 使用this._translateX判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._shown正好相反
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
      element = _this$_buttons$index.element,
      indexPos = _this$_buttons$index.indexPos,
      icon = _this$_buttons$index.icon,
      confirm = _this$_buttons$index.confirm,
      slideOut = _this$_buttons$index.slideOut,
      data = _this$_buttons$index.data;
    // 最后一个按钮单独处理
    if (this.fullSlide && (indexPos === 'last' || indexPos === 'first-last')) {
      buttonSlide.apply(this, [e, index, target]);
      return;
    }
    // 如果是再次确认或者首次无需确认，则直接执行
    var type = 'buttonPress';
    // 确认后二次点击
    if (this._confirmIndex === index) {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (slideOut) {
        this.hideButton();
      } else {
        // 取消确认
        cTransform.apply(this, [index, false]);
        this._confirmIndex = -1;
      }
    } else if (this._confirmIndex === -1) {
      // 当前没有确认的情况
      // 首次点击需要确认
      if (confirm) {
        this._confirmIndex = index;
        // 设置回弹效果，第一个按钮和图标按钮不需要
        if (this.rebounce && !icon && indexPos !== 'first') {
          (0, _agent.onOnceTransitionEnd)(element, function () {
            // 该事件执行时确保当前还处于确认状态，否则不能再执行
            if (_this2._confirmIndex === index) {
              cTransform.apply(_this2, [index, true]);
            }
          });
          cTransform.apply(this, [index, true, SlideView.REBOUNCE_SIZE]);
        } else {
          cTransform.apply(this, [index, true]);
        }
        type = 'buttonConfirm';
      }
      // 无需确认的点击（如果slideOut，就点击后隐藏按钮，否则不做任何处理）
      else if (slideOut) {
        this.hideButton();
      }
    } else {
      // 此时其它按钮正处于确认情况，本按钮的点击无效
      type = null;
    }
    if (type) {
      this.trigger(type, {
        index: index,
        data: data,
        currentTarget: target,
        timeStamp: Date.now(),
        sourceEvent: e
      });
    }
  }
};
var buttonSlide = function buttonSlide(event, index, target) {
  // 表示按钮处于收起隐藏状态
  if (this._translateX === 0 || !this._buttons || !this._buttons[index]) {
    return;
  }
  var _this$_buttons$index2 = this._buttons[index],
    element = _this$_buttons$index2.element,
    confirm = _this$_buttons$index2.confirm,
    icon = _this$_buttons$index2.icon,
    position = _this$_buttons$index2.position,
    slideOut = _this$_buttons$index2.slideOut,
    data = _this$_buttons$index2.data;
  var type = 'buttonPress';
  // 滑满之后二次点击
  if (this._confirmIndex === index) {
    // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
    if (slideOut) {
      this.hideButton();
    } else {
      confirm && confirmStyle(element.firstChild, true, icon, position, confirm);
      this._confirmIndex = -1;
      // 应该不做任何事情，因为这样的按钮一般用于destory，没必要再show
      // this.showButton(this._translateX > 0 ? 'left' : 'right');
    }
  } else if (this._confirmIndex === -1) {
    // 无论是否确认都需要滑满
    var moveX = (this._translateX > 0 ? 1 : -1) * this.element.getBoundingClientRect().width;
    this._translateX = moveX;
    transform.apply(this, [moveX, 1]);
    // 需要确认，触发确认事件
    if (confirm) {
      confirmStyle(element.firstChild, true, icon, position, confirm);
      this._confirmIndex = index;
      type = 'buttonConfirm';
    } else {
      // 无确认滑满情况
      if (slideOut) {
        this.hideButton();
      } else {
        // 应该不做任何事情，因为这样的按钮一般用于destory，没必要再show
        // this.showButton(this._translateX > 0 ? 'left' : 'right');
      }
    }
  } else {
    // 此时其它按钮正处于确认情况，本按钮的点击无效
    type = null;
  }
  if (type) {
    this.trigger(type, {
      index: index,
      data: data,
      currentTarget: target || element,
      timeStamp: Date.now(),
      sourceEvent: event
    });
  }
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
  // 按钮状态，展示的是哪一个按钮
  //是否销毁
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_shown", 'none');
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
      _options$rebounce = options.rebounce,
      rebounce = _options$rebounce === void 0 ? true : _options$rebounce,
      _options$disable = options.disable,
      disable = _options$disable === void 0 ? false : _options$disable,
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
        var leftBtnElement = _this4.element.previousSibling && _this4.element.previousSibling.firstChild;
        leftBtnElement.innerHTML = '';
        // 绑定左边按钮事件
        if (_this4._agents && !_this4._agents[1]) {
          _this4._agents[1] = (0, _agent.default)(leftBtnElement, {
            press: buttonPress.bind(_this4)
          });
        }
        var rightBtnElement = _this4.element.nextSibling && _this4.element.nextSibling.firstChild;
        rightBtnElement.innerHTML = '';
        // 绑定右边按钮事件
        if (_this4._agents && !_this4._agents[2]) {
          _this4._agents[2] = (0, _agent.default)(rightBtnElement, {
            press: buttonPress.bind(_this4)
          });
        }
        var leftMax = 0;
        var rightMax = 0;
        var firstLeftIndex = -1;
        var firstRightIndex = -1;
        var lastLeftIndex = -1;
        var lastRightIndex = -1;
        _this4._buttons = (buttons || []).map(function (_ref7, index) {
          var className = _ref7.className,
            icon = _ref7.icon,
            width = _ref7.width,
            height = _ref7.height,
            text = _ref7.text,
            confirm = _ref7.confirm,
            color = _ref7.color,
            background = _ref7.background,
            _ref7$position = _ref7.position,
            position = _ref7$position === void 0 ? 'right' : _ref7$position,
            _ref7$slideOut = _ref7.slideOut,
            slideOut = _ref7$slideOut === void 0 ? true : _ref7$slideOut,
            data = _ref7.data;
          var btnWrap = (0, _util.addClass)(document.createElement('div'), "hjs-slideview__btn__wrap ".concat(className || ''));
          btnWrap.setAttribute('data-index', String(index));
          var btn = (0, _util.setStyle)((0, _util.addClass)(document.createElement('div'), 'hjs-slideview__btn'), {
            color: color,
            width: width || '100%',
            height: height || '100%',
            margin: "0 ".concat(icon ? 10 : 16, "px"),
            justifyContent: icon ? 'center' : position === 'left' ? 'flex-end' : 'flex-start',
            background: !icon ? 'transparent' : background,
            borderRadius: icon ? !height ? '50%' : (typeof height === 'string' ? parseInt(height, 10) : height) / 2 : 0
          });
          var btnConfirm = !confirm ? undefined : {};
          if (icon) {
            var src = icon.src,
              cls = icon.className,
              w = icon.width,
              h = icon.height;
            if (btnConfirm && confirm) {
              btnConfirm.ocls = cls;
              btnConfirm.cls = confirm.className;
            }
            var btnIcon = null;
            if (src) {
              if (btnConfirm && confirm) {
                btnConfirm.osrc = src;
                btnConfirm.src = confirm.src;
              }
              btnIcon = document.createElement('img');
              btnIcon.src = src;
            } else {
              btnIcon = document.createElement('i');
            }
            btn.appendChild((0, _util.setStyle)((0, _util.addClass)(btnIcon, cls || ''), {
              width: w,
              height: h
            }));
          } else {
            if (btnConfirm && confirm) {
              btnConfirm.otext = text;
              btnConfirm.text = confirm.text;
            }
            var btnText = document.createElement('span');
            btnText.innerText = String(text);
            btn.appendChild(btnText);
          }
          btnWrap.appendChild(btn);
          if (position === 'left') {
            leftBtnElement.appendChild(btnWrap);
          } else {
            rightBtnElement.appendChild(btnWrap);
          }
          var btnWidth = btnWrap.getBoundingClientRect().width;
          (0, _util.setStyle)(btnWrap, {
            width: btnWidth,
            background: icon ? 'transparent' : background
          });
          if (position === 'left') {
            leftMax += btnWidth;
            if (firstLeftIndex === -1) {
              firstLeftIndex = index;
            }
            lastLeftIndex = index;
          } else {
            rightMax += btnWidth;
            if (firstRightIndex === -1) {
              firstRightIndex = index;
            }
            lastRightIndex = index;
          }
          return {
            element: btnWrap,
            width: btnWidth,
            position: position,
            slideOut: slideOut,
            icon: !!icon,
            confirm: btnConfirm,
            indexPos: 'middle',
            data: data
          };
        });
        if (firstLeftIndex === lastLeftIndex && firstLeftIndex !== -1) {
          _this4._buttons[firstLeftIndex].indexPos = 'first-last';
        } else {
          if (firstLeftIndex !== -1) {
            _this4._buttons[firstLeftIndex].indexPos = 'first';
          }
          if (lastLeftIndex !== -1) {
            _this4._buttons[lastLeftIndex].indexPos = 'last';
          }
        }
        if (firstRightIndex === lastRightIndex && firstRightIndex !== -1) {
          _this4._buttons[firstRightIndex].indexPos = 'first-last';
        } else {
          if (firstRightIndex !== -1) {
            _this4._buttons[firstRightIndex].indexPos = 'first';
          }
          if (lastRightIndex !== -1) {
            _this4._buttons[lastRightIndex].indexPos = 'last';
          }
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
      if (typeof content === 'string' && !content.match(/^[#|.].+/)) {
        this.element.innerHTML = content;
        return;
      }
      try {
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
      } catch (e) {}
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      var _this5 = this;
      return new Promise(function (resolve) {
        if (_this5._destory || _this5._translateX === 0 || !_this5._buttons) {
          resolve();
          return;
        }
        _this5._translateX = 0;
        transform.apply(_this5, [0, 0]);
        // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
        (0, _agent.onOnceTransitionEnd)(_this5.element, function () {
          resolve();
          // 如果当前处于按钮确认状态，隐藏之前需要先取消
          if (_this5._confirmIndex !== -1) {
            // 此时已经隐藏，this._translateX为0，无需过渡，duration设置为0
            cTransform.apply(_this5, [_this5._confirmIndex, false, 0, 0]);
            _this5._confirmIndex = -1;
          }
          if (_this5._shown !== 'none') {
            _this5.trigger('hide', {
              shown: 'none',
              currentTarget: _this5.element,
              timeStamp: Date.now(),
              sourceEvent: null
            });
            _this5._shown = 'none';
          }
        });
      });
    }
  }, {
    key: "showButton",
    value: function showButton() {
      var _this6 = this;
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
      return new Promise(function (resolve) {
        if (_this6._destory || !_this6._buttons) {
          resolve();
          return;
        }
        var _ref8 = _this6._slideRange || [0, 0],
          _ref9 = (0, _slicedToArray2.default)(_ref8, 2),
          slideMin = _ref9[0],
          slideMax = _ref9[1];
        var pos = slideMin === 0 ? 'left' : slideMax === 0 ? 'right' : position;
        var max = pos === 'left' ? slideMax : slideMin;
        if (_this6._translateX === max) {
          resolve();
          return;
        }
        var show = function show() {
          var rebSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var factor = pos === 'left' ? 1 : -1;
          var moveX = max + rebSize * factor;
          _this6._translateX = moveX;
          transform.apply(_this6, [moveX, 0]);
          if (!rebSize) {
            (0, _agent.onOnceTransitionEnd)(_this6.element, function () {
              resolve();
              if (_this6._shown !== pos) {
                _this6.trigger('show', {
                  shown: pos,
                  currentTarget: _this6.element,
                  timeStamp: Date.now(),
                  sourceEvent: null
                });
                _this6._shown = pos;
              }
            });
          }
        };
        // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
        if (_this6.rebounce && (max > 0 && _this6._translateX < max || max < 0 && _this6._translateX > max)) {
          (0, _agent.onOnceTransitionEnd)(_this6.element, function () {
            return show();
          });
          show(SlideView.REBOUNCE_SIZE);
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
      // 解除所有事件
      (0, _get2.default)((0, _getPrototypeOf2.default)(SlideView.prototype), "off", this).call(this);
      // 销毁底层事件
      if (this._agents) {
        this._agents.forEach(function (a) {
          return a && a.destory();
        });
        this._agents = null;
      }
      this._destory = true;
      this._buttons = null;
      this._slideRange = null;
      this._startPoint = null;
      // 删除元素，用户可以在调用该方法之前加一个删除动画
      var viewEl = this.element.parentNode;
      if (viewEl.parentNode) {
        viewEl.parentNode.removeChild(viewEl);
      }
    }
  }]);
  return SlideView;
}(_event.default);
(0, _defineProperty2.default)(SlideView, "REBOUNCE_SIZE", 12);
var _default = SlideView;
exports.default = _default;