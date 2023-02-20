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
var _gesture = _interopRequireDefault(require("./gesture"));
var _util = require("./util");
var _css = _interopRequireDefault(require("./css"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var generate = function generate(container, handler, className) {
  (0, _util.styleInject)(_css.default);
  var view = document.createElement('div');
  (0, _util.addClass)(view, "hjs-slide-view ".concat(className || ''));
  var element = document.createElement('div');
  (0, _util.addClass)(element, 'hjs-slideview__left');
  var click = function click(e) {
    return handler('click', e);
  };
  element.addEventListener('click', click);
  var rightElement = document.createElement('div');
  (0, _util.addClass)(rightElement, 'hjs-slideview__right');
  var btnElement = document.createElement('div');
  (0, _util.addClass)(btnElement, 'hjs-slideview__buttons');
  var btnClick = function btnClick(e) {
    return handler('button-click', e);
  };
  btnElement.addEventListener('click', btnClick);
  rightElement.appendChild(btnElement);
  view.appendChild(element);
  view.appendChild(rightElement);
  container.innerHTML = '';
  container.appendChild(view);
  return {
    element: element,
    destory: function destory() {
      element.removeEventListener('click', click);
      btnElement.removeEventListener('click', btnClick);
      container.innerHTML = '';
    }
  };
};
var start = function start(e) {
  if (!this.buttons.length || this.disable) {
    return;
  }
  this.isMoving = true;
  this.startX = e.point[0];
  this.startY = e.point[1];
  this.slideAngle = 0;
};
var move = function move(e) {
  if (!this.buttons.length || this.disable || !this.isMoving) {
    return;
  }
  var pagex = e.point[0] - this.startX;
  var pagey = e.point[1] - this.startY;
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (this.slideAngle === 0) {
    this.slideAngle = Math.abs(pagex) - Math.abs(pagey);
  }
  if (this.slideAngle < 0) {
    return;
  }
  // 滑动距离
  var movex;
  // 前面所有按钮的占比距离
  var transformTotal = 0;
  // 已经滑出来情况处理
  if (this.slideOut) {
    if (pagex < 0) {
      if (this.rebounce) {
        // 滑出情况向左滑动，小幅度弹性继续展开（后面松开时会恢复到最大展开值）
        movex = (0, _util.rebounceSize)(pagex);
      } else {
        movex = 0;
      }
    } else {
      if (pagex <= this.maxWidth) {
        // 向右滑动收起
        movex = pagex;
      } else {
        /* if (this.rebounce) {
          // 弹性右滑
          movex = this.maxWidth + rebounceSize(pagex - this.maxWidth);
        } else {
          // 超过收起最大值之后，更新初始点值，同时标记为已收起
          this.startX = e.point[0];
          this.startY = e.point[1];
          this.slideOut = false;
          movex = this.maxWidth;
        } */
        // 超过收起最大值之后，更新初始点值，同时标记为已收起
        this.startX = e.point[0];
        this.startY = e.point[1];
        this.slideOut = false;
        movex = this.maxWidth;
      }
    }
    this.slideVector = -this.maxWidth + movex;
    (0, _util.setStyle)(this.element, {
      transform: "translateX(".concat(-this.maxWidth + movex, "px)"),
      transition: ''
    });
    transformTotal = 0;
    for (var i = this.buttons.length - 1; i >= 0; i--) {
      // 当前按钮需要收起的占比距离
      var transform = this.buttons[i].width / this.maxWidth * movex;
      // 当前按钮收起距离应该是占比距离-当前按钮滑出的最大距离
      var transformx = -this.buttons[i].maxWidth + transform + transformTotal;
      (0, _util.setStyle)(this.buttons[i].element, {
        transform: "translateX(".concat(transformx, "px)"),
        transition: ''
      });
      // 累计已收起按钮的占比距离
      transformTotal += transform;
    }
    return false; // 禁止垂直方向的滑动
  }
  // 需要滑出情况处理
  if (pagex > 0) {
    /* if (this.rebounce) {
      // 弹性距离
      movex = rebounceSize(pagex);
    } else {
      // 收起情况向右滑动，改变初始点值
      this.startX = e.point[0];
      this.startY = e.point[1];
      movex = 0;
    } */
    // 收起情况向右滑动，改变初始点值
    this.startX = e.point[0];
    this.startY = e.point[1];
    movex = 0;
  } else {
    if (pagex >= -this.maxWidth) {
      // 向左滑动展开
      movex = pagex;
    } else {
      if (this.rebounce) {
        // 向左滑动超过展开最大值之后，小幅度弹性继续展开（后面松开时会恢复到最大展开值）
        movex = (0, _util.rebounceSize)(pagex + this.maxWidth) - this.maxWidth;
      } else {
        movex = -this.maxWidth;
      }
    }
  }
  this.slideVector = movex;
  (0, _util.setStyle)(this.element, {
    transform: "translateX(".concat(movex, "px)"),
    transition: ''
  });
  transformTotal = 0;
  for (var _i = this.buttons.length - 1; _i >= 0; _i--) {
    // 当前按钮需要滑出的占比距离
    var _transform = this.buttons[_i].width / this.maxWidth * movex;
    // 当前按钮滑出距离应该是占比距离+前面所有按钮的占比距离
    var _transformx = _transform + transformTotal;
    (0, _util.setStyle)(this.buttons[_i].element, {
      transform: "translateX(".concat(_transformx, "px)"),
      transition: ''
    });
    // 累计已滑出按钮的占比距离
    transformTotal += _transform;
  }
  return false; // 禁止垂直方向的滑动
};

var end = function end(e) {
  if (!this.buttons.length || this.disable || !this.isMoving || this.slideAngle < 0) {
    return;
  }
  this.isMoving = false;
  this.slideAngle = 0;
  // 如果滑出的距离小于throttle，或者直接向右滑（出现于向右滑一点，但未完全收起的情况）则直接完全收起
  if (e.point[0] - this.startX > 0 || Math.abs(e.point[0] - this.startX) < this.throttle) {
    this.hideButton();
  } else {
    // 如果结束滑动时滑动的距离小于maxWidth，有回弹效果
    this.showButton();
  }
};
var SlideView = /*#__PURE__*/function (_EventTarget) {
  (0, _inherits2.default)(SlideView, _EventTarget);
  var _super = _createSuper(SlideView);
  // 触发滑动的元素
  // 滑出后展开的最大宽度（所有按钮的宽度和，无方向）
  // 按钮集合
  // 禁止按钮滑出
  // 按钮滑出动画时间（秒级）
  // 按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  // 滑出时是否有弹性效果
  // 按钮状态，已滑出（展开）
  // 滑出元素当前滑出距离（有方向）
  // 手指滑出时与水平角度值（非真实角度，只是xy差，反映是否小于45度）
  // 是否正在滑动
  // 手指放上后初始x值
  // 手指放上后初始y值

  function SlideView(options) {
    var _this;
    (0, _classCallCheck2.default)(this, SlideView);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "maxWidth", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "buttons", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "disable", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "duration", 0.4);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "throttle", 60);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "rebounce", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "slideOut", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "slideVector", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "slideAngle", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isMoving", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "startX", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "startY", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "gesture", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "builder", null);
    var container = options.container,
      className = options.className,
      content = options.content,
      buttons = options.buttons,
      disable = options.disable,
      duration = options.duration,
      throttle = options.throttle,
      _options$rebounce = options.rebounce,
      rebounce = _options$rebounce === void 0 ? true : _options$rebounce;
    var tempContainer;
    if (typeof container === 'string') {
      tempContainer = document.querySelector(container);
    } else {
      tempContainer = container;
    }
    if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
      throw new Error('Please pass a container element...');
    }
    _this.builder = generate(tempContainer, function (t, e) {
      var target = e.currentTarget;
      var index = 1;
      var event = {
        type: t,
        target: target,
        sourceEvent: e
      };
      if (t === 'button-click') {
        var _this$buttons$index;
        target = e.target;
        while (target !== e.currentTarget && !target.getAttribute('data-index')) {
          target = target.parentNode;
        }
        index = +(target.getAttribute('data-index') || -1);
        event = _objectSpread(_objectSpread({}, event), {}, {
          target: target,
          index: index,
          data: (_this$buttons$index = _this.buttons[index]) === null || _this$buttons$index === void 0 ? void 0 : _this$buttons$index.data
        });
      }
      if (index >= 0) {
        var pool = _this.events[t] || [];
        pool.forEach(function (h) {
          return h(event);
        });
      }
    }, className);
    _this.element = _this.builder.element;
    _this.setContent(content);
    _this.setButtons(buttons);
    _this.gesture = (0, _gesture.default)(_this.element, {
      start: start.bind((0, _assertThisInitialized2.default)(_this)),
      move: move.bind((0, _assertThisInitialized2.default)(_this)),
      end: end.bind((0, _assertThisInitialized2.default)(_this))
    });
    _this.disable = disable || false;
    _this.duration = (duration || 400) / 1000;
    _this.throttle = throttle || 40;
    _this.rebounce = rebounce;
    return _this;
  }
  (0, _createClass2.default)(SlideView, [{
    key: "setDisable",
    value: function setDisable() {
      var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.disable = disable;
    }
  }, {
    key: "setRebounce",
    value: function setRebounce() {
      var rebounce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.rebounce = rebounce;
    }
  }, {
    key: "setDuration",
    value: function setDuration() {
      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.duration = duration / 1000;
    }
  }, {
    key: "setThrottle",
    value: function setThrottle() {
      var throttle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.throttle = throttle;
    }
  }, {
    key: "setButtons",
    value: function setButtons(buttons) {
      var _this$element$nextSib;
      // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
      this.hideButton();
      var btnElement = (_this$element$nextSib = this.element.nextSibling) === null || _this$element$nextSib === void 0 ? void 0 : _this$element$nextSib.firstChild;
      btnElement.innerHTML = '';
      var maxWidth = 0;
      var actions = [];
      actions = (buttons || []).map(function (_ref, index) {
        var className = _ref.className,
          icon = _ref.icon,
          width = _ref.width,
          height = _ref.height,
          text = _ref.text,
          color = _ref.color,
          background = _ref.background,
          data = _ref.data;
        var btnWrap = document.createElement('div');
        (0, _util.addClass)(btnWrap, "hjs-slideview__btn__wrap ".concat(className || ''));
        btnWrap.setAttribute('data-index', String(index));
        var btn = document.createElement('div');
        (0, _util.addClass)(btn, 'hjs-slideview__btn');
        (0, _util.setStyle)(btn, {
          color: color,
          background: background,
          width: width || '100%',
          height: height || '100%',
          padding: icon ? 0 : '0px 46px 0 16px',
          borderRadius: icon ? '50%' : 0
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
            (0, _util.addClass)(btnImg, cls || '');
            btn.appendChild(btnImg);
          } else {
            var btnI = document.createElement('i');
            (0, _util.setStyle)(btnI, {
              width: width,
              height: height
            });
            (0, _util.addClass)(btnI, cls || '');
            btn.appendChild(btnI);
          }
        } else {
          var btnText = document.createElement('span');
          btnText.innerText = String(text);
          btn.appendChild(btnText);
        }
        btnWrap.appendChild(btn);
        btnElement.appendChild(btnWrap);
        return {
          delt: icon ? 0 : -30,
          // 右边距多了30，是为了弹性效果增加的
          element: btnWrap,
          data: data
        };
      }).reverse().map(function (_ref2) {
        var delt = _ref2.delt,
          element = _ref2.element,
          data = _ref2.data;
        var width = element.getBoundingClientRect().width + delt;
        maxWidth += width;
        return {
          element: element,
          width: width,
          maxWidth: maxWidth,
          data: data
        };
      }).reverse();
      this.maxWidth = maxWidth;
      this.buttons = actions;
    }
  }, {
    key: "setContent",
    value: function setContent(content) {
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
    key: "showButton",
    value: function showButton() {
      var _this2 = this;
      if (!this.buttons.length) {
        return;
      }
      if (!this.slideOut) {
        (0, _util.onOnceTransitionEnd)(this.element, function (e) {
          var pool = _this2.events.show || [];
          pool.forEach(function (h) {
            return h({
              type: 'show',
              target: _this2.element,
              sourceEvent: e
            });
          });
        });
      }
      this.slideOut = true;
      var show = function show() {
        var delt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        _this2.slideVector = -_this2.maxWidth - delt;
        (0, _util.setStyle)(_this2.element, {
          transform: "translate3d(".concat(-_this2.maxWidth - delt, "px, 0, 0)"),
          transition: "transform ".concat(_this2.duration, "s")
        });
        var transformTotal = 0;
        for (var i = _this2.buttons.length - 1; i >= 0; i--) {
          // 当前按钮需要滑出的占比距离
          var transform = -(_this2.buttons[i].width / _this2.maxWidth) * (_this2.maxWidth + delt);
          // 当前按钮滑出距离应该是占比距离+前面所有按钮的占比距离
          var transformx = transform + transformTotal;
          (0, _util.setStyle)(_this2.buttons[i].element, {
            transform: "translate3d(".concat(transformx, "px, 0, 0)"),
            transition: "transform ".concat(_this2.duration, "s")
          });
          // 累计已滑出按钮的占比距离
          transformTotal += transform;
        }
      };
      // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
      if (this.rebounce && Math.abs(this.slideVector) < this.maxWidth) {
        show(SlideView.REBOUNCE_SIZE);
        (0, _util.onOnceTransitionEnd)(this.element, function () {
          return show();
        });
      } else {
        show();
      }
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      var _this3 = this;
      if (!this.buttons.length) {
        return;
      }
      if (this.slideOut) {
        (0, _util.onOnceTransitionEnd)(this.element, function (e) {
          var pool = _this3.events.hide || [];
          pool.forEach(function (h) {
            return h({
              type: 'hide',
              target: _this3.element,
              sourceEvent: e
            });
          });
        });
      }
      this.slideOut = false;
      this.slideVector = 0;
      (0, _util.setStyle)(this.element, {
        transform: 'translate3d(0, 0, 0)',
        transition: "transform ".concat(this.duration, "s")
      });
      for (var i = this.buttons.length - 1; i >= 0; i--) {
        (0, _util.setStyle)(this.buttons[i].element, {
          transform: 'translate3d(0, 0, 0)',
          transition: "transform ".concat(this.duration, "s")
        });
      }
    }
  }, {
    key: "toggleButton",
    value: function toggleButton() {
      this.slideOut ? this.hideButton() : this.showButton();
    }
  }, {
    key: "destory",
    value: function destory() {
      var _this$gesture, _this$builder;
      // 解除所有事件
      (0, _get2.default)((0, _getPrototypeOf2.default)(SlideView.prototype), "off", this).call(this);
      // 解除手势事件
      (_this$gesture = this.gesture) === null || _this$gesture === void 0 ? void 0 : _this$gesture.destory();
      // 解除创建者
      (_this$builder = this.builder) === null || _this$builder === void 0 ? void 0 : _this$builder.destory();
    }
  }]);
  return SlideView;
}(_event.default);
(0, _defineProperty2.default)(SlideView, "REBOUNCE_SIZE", 12);
var _default = SlideView;
exports.default = _default;