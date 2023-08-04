"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _gesture = require("@huangjs888/gesture");
var _events = _interopRequireWildcard(require("./events"));
var _dom = _interopRequireDefault(require("./dom"));
var _transform = require("./transform");
var _overshoot = require("./overshoot");
var _confirm = require("./confirm");
var _util = require("./util");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SlideView = /*#__PURE__*/function (_EventTarget) {
  (0, _inherits2.default)(SlideView, _EventTarget);
  var _super = _createSuper(SlideView);
  // 滑动视图元素
  // 内容元素
  // 左按钮元素
  // 右按钮元素
  // 按钮集合
  // 按钮集合
  // 摩擦因子(0-1的值)
  // 弹性尺寸
  // 按钮滑出动画时间（秒级）
  // 滑动时动画的函数
  // 是否销毁
  // 当前展示的是哪个方向按钮
  // 当前正在确认的按钮
  // 当前是否处于overshoot状态
  // 元素当前位移值
  // 视图宽度
  // 手指放上后滑动视图元素距离屏幕左边距离即offsetLeft
  // 手指放上那一刻，translate值
  // 手指放上那一刻，translate未经rebounceSize的值
  // 手指放上后初始点
  // 移动时的角度与45度的关系
  // 移动时的时间戳
  // 是否正在滑动

  function SlideView(options) {
    var _this;
    (0, _classCallCheck2.default)(this, SlideView);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "element", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentEl", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "leftEl", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "rightEl", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "leftActions", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "rightActions", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "friction", 0.5);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "rebounce", 12);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "duration", 0.4);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "timing", 'ease');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_destory", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_direction", 'none');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_confirming", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_overshooting", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_translate", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_width", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_offset", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_startOffset", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_startTranslate", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_startPoint", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_startAngle", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_timestamp", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_isMoving", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_gesture", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_removeResize", null);
    var className = options.className,
      container = options.container,
      content = options.content,
      friction = options.friction,
      rebounce = options.rebounce,
      duration = options.duration,
      timing = options.timing,
      leftActions = options.leftActions,
      rightActions = options.rightActions;
    var _generateEl = (0, _dom.default)(container, className),
      _generateEl2 = (0, _slicedToArray2.default)(_generateEl, 4),
      element = _generateEl2[0],
      contentEl = _generateEl2[1],
      leftEl = _generateEl2[2],
      rightEl = _generateEl2[3];
    _this._gesture = _events.default.apply((0, _assertThisInitialized2.default)(_this), [element]);
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
  (0, _createClass2.default)(SlideView, [{
    key: "setContent",
    value: function setContent() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var dangerous = arguments.length > 1 ? arguments[1] : undefined;
      if (this._destory || !this.contentEl) {
        return;
      }
      // 注意XSS注入
      if (dangerous && typeof content === 'string') {
        this.contentEl.innerHTML = content;
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
          this.contentEl.innerHTML = '';
          this.contentEl.appendChild(tempChild);
        }
      } catch (e) {}
    }
  }, {
    key: "setFriction",
    value: function setFriction() {
      var friction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      if (this._destory) {
        return;
      }
      // friction: 不传为默认值0.5，传小于0的都为0，大于1的都为1，传非数字，则属于无效设置
      if (typeof friction === 'number') {
        this.friction = Math.min(1, Math.max(0, friction));
      }
    }
  }, {
    key: "setRebounce",
    value: function setRebounce() {
      var rebounce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
      if (this._destory) {
        return;
      }
      // rebounce: 不传为默认值12，传小于0的都为0，传非数字，则属于无效设置
      if (typeof rebounce === 'number') {
        this.rebounce = Math.max(0, rebounce);
      }
    }
  }, {
    key: "setDuration",
    value: function setDuration() {
      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.4;
      if (this._destory) {
        return;
      }
      // duration: 不传为默认值0.4，传小于0的都为0，传非数字，则属于无效设置
      if (typeof duration === 'number') {
        this.duration = Math.max(0, duration);
      }
    }
  }, {
    key: "setTiming",
    value: function setTiming() {
      var timing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ease';
      if (this._destory) {
        return;
      }
      // timing: 不传为默认值ease
      this.timing = timing;
    }
  }, {
    key: "setDisable",
    value: function setDisable() {
      var _this2 = this;
      var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
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
    }
  }, {
    key: "setOvershoot",
    value: function setOvershoot() {
      var overshoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
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
    }
  }, {
    key: "setThreshold",
    value: function setThreshold() {
      var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
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
    }
  }, {
    key: "setActions",
    value: function setActions() {
      var _this3 = this;
      var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
      if (this._destory || direction === 'none') {
        return;
      }
      // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
      var _setActions = function _setActions(_direction) {
        var parentEl = _this3["".concat(_direction, "El")];
        if (!parentEl) {
          return;
        }
        parentEl.innerHTML = '';
        _this3["".concat(_direction, "Actions")] = null;
        if (actions.items && actions.items.length > 0) {
          var className = actions.className,
            _actions$style = actions.style,
            style = _actions$style === void 0 ? 'accordion' : _actions$style,
            _actions$disable = actions.disable,
            disable = _actions$disable === void 0 ? false : _actions$disable,
            _actions$overshoot = actions.overshoot,
            overshoot = _actions$overshoot === void 0 ? false : _actions$overshoot,
            _actions$overshootEdg = actions.overshootEdgeSize,
            overshootEdgeSize = _actions$overshootEdg === void 0 ? 80 : _actions$overshootEdg,
            _actions$overshootFre = actions.overshootFreeSize,
            overshootFreeSize = _actions$overshootFre === void 0 ? 30 : _actions$overshootFre,
            _actions$threshold = actions.threshold,
            threshold = _actions$threshold === void 0 ? 40 : _actions$threshold,
            items = actions.items;
          var tElement = (0, _util.addClass)(document.createElement('div'), "hjs-slideview__actions ".concat(className || ''));
          parentEl.appendChild(tElement);
          var tWidth = 0;
          var tGap = 0;
          var newItems = items.map(function (item, index) {
            var _item$gap = item.gap,
              gap = _item$gap === void 0 ? 0 : _item$gap,
              _item$fixedGap = item.fixedGap,
              fixedGap = _item$fixedGap === void 0 ? false : _item$fixedGap,
              text = item.text,
              icon = item.icon;
            var element = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__action');
            element.setAttribute('data-index', String(index));
            if (icon) {
              element.appendChild((0, _util.addClass)(document.createElement((0, _util.getIconType)(icon)), 'hjs-slideview__action__icon'));
            }
            if (text) {
              element.appendChild((0, _util.addClass)(document.createElement('span'), 'hjs-slideview__action__text'));
            }
            var wrapper = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__action__wrapper');
            wrapper.appendChild(element);
            tElement.appendChild(wrapper);
            var tItem = _objectSpread(_objectSpread({}, item), {}, {
              wrapper: wrapper,
              element: element,
              width: 0,
              gap: [0, 0],
              fixedGap: fixedGap
            });
            // 设置非确认时的样式和内容
            (0, _confirm.confirmStyle)(tItem);
            var _element$getBoundingC2 = element.getBoundingClientRect(),
              width = _element$getBoundingC2.width;
            var leftGap = 0;
            var rightGap = 0;
            if (typeof gap === 'number') {
              leftGap = gap;
              rightGap = gap;
            } else {
              var _gap = (0, _slicedToArray2.default)(gap, 2);
              leftGap = _gap[0];
              rightGap = _gap[1];
            }
            leftGap = Math.min(width, Math.max(leftGap, 0));
            rightGap = Math.min(width, Math.max(rightGap, 0));
            tWidth += width + leftGap + rightGap;
            tGap += leftGap + rightGap;
            return _objectSpread(_objectSpread({}, tItem), {}, {
              gap: [leftGap, rightGap],
              fixedGap: leftGap === 0 && rightGap === 0 ? false : fixedGap,
              // 左右gap都为0的情况，gudinggap无意义
              width: width
            });
          });
          _this3["".concat(_direction, "Actions")] = {
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
    }
  }, {
    key: "toggle",
    value: function toggle() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
      return this._translate === 0 ? this.show(direction) : this.hide();
    }
  }, {
    key: "show",
    value: function show() {
      var _this4 = this;
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
      var contentEl = this.contentEl,
        rebounce = this.rebounce,
        leftActions = this.leftActions,
        rightActions = this.rightActions;
      if (this._destory || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
        return Promise.resolve();
      }
      return new Promise(function (resolve) {
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
        var show = function show() {
          var rebSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var translate = maxTranslate + rebSize;
          _this4._translate = translate;
          _transform.transform.apply(_this4, [translate]);
          if (_this4._overshooting) {
            _this4._overshooting = false;
            _overshoot.overshootChange.apply(_this4, [_this4._translate > 0 ? leftActions : rightActions]);
          }
          _confirm.confirmCancel.apply(_this4, []);
          if (!rebSize) {
            (0, _events.onOnceTransitionEnd)(contentEl, function () {
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
          (0, _events.onOnceTransitionEnd)(contentEl, function () {
            return show();
          });
          show(rebounce * factor);
        } else {
          show();
        }
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      var _this5 = this;
      var contentEl = this.contentEl,
        leftActions = this.leftActions,
        rightActions = this.rightActions;
      if (this._destory || this._translate === 0 || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
        return Promise.resolve();
      }
      return new Promise(function (resolve) {
        _this5._translate = 0;
        _transform.transform.apply(_this5, [0]);
        // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
        (0, _events.onOnceTransitionEnd)(contentEl, function () {
          resolve();
          if (_this5._overshooting) {
            _this5._overshooting = false;
            _overshoot.overshootChange.apply(_this5, [_this5._translate > 0 ? leftActions : rightActions]);
          }
          _confirm.confirmCancel.apply(_this5, []);
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
    }
  }, {
    key: "destory",
    value: function destory() {
      // 解除所有事件
      (0, _get2.default)((0, _getPrototypeOf2.default)(SlideView.prototype), "off", this).call(this);
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
    }
  }]);
  return SlideView;
}(_gesture.EventTarget);
var _default = SlideView;
exports.default = _default;