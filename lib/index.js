"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));
var _gesture = require("@huangjs888/gesture");
var _events = _interopRequireWildcard(require("./events"));
var _dom = _interopRequireDefault(require("./dom"));
var _transform = require("./transform");
var _overshoot = require("./overshoot");
var _confirm = require("./confirm");
var _util = require("./util");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 16:00:29
 * @Description: ******
 */
var SlideView = /*#__PURE__*/function (_EventTarget) {
  (0, _inheritsLoose2.default)(SlideView, _EventTarget);
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
    var _generateEl = (0, _dom.default)(container, className),
      element = _generateEl[0],
      contentEl = _generateEl[1],
      leftEl = _generateEl[2],
      rightEl = _generateEl[3];
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
        var tElement = (0, _util.addClass)(document.createElement('div'), "hjs-slideview__actions " + (className || ''));
        parentEl.appendChild(tElement);
        var tWidth = 0;
        var tGap = 0;
        var newItems = (0, _map.default)(items).call(items, function (item, index) {
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
          var tItem = (0, _extends2.default)({}, item, {
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
            leftGap = gap[0];
            rightGap = gap[1];
          }
          leftGap = Math.min(width, Math.max(leftGap, 0));
          rightGap = Math.min(width, Math.max(rightGap, 0));
          tWidth += width + leftGap + rightGap;
          tGap += leftGap + rightGap;
          return (0, _extends2.default)({}, tItem, {
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
      return _promise.default.resolve();
    }
    return new _promise.default(function (resolve) {
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
  };
  _proto.hide = function hide() {
    var _this5 = this;
    var contentEl = this.contentEl,
      leftActions = this.leftActions,
      rightActions = this.rightActions;
    if (this._destory || this._translate === 0 || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
      return _promise.default.resolve();
    }
    return new _promise.default(function (resolve) {
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
}(_gesture.EventTarget);
var _default = SlideView;
exports.default = _default;