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
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _event = _interopRequireDefault(require("./event"));
var _agent = _interopRequireWildcard(require("./agent"));
var _util = require("./util");
var _css = _interopRequireDefault(require("./css"));
var _excluded = ["wrapElement", "element", "confirm"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var generateEl = function generateEl(container, className) {
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
  var viewElement = (0, _util.addClass)(document.createElement('div'), "hjs-slideview ".concat(className || ''));
  var leftElement = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__left');
  viewElement.appendChild(leftElement);
  var rightElement = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__right');
  viewElement.appendChild(rightElement);
  var contentElement = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__content');
  viewElement.appendChild(contentElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(viewElement);
  return [viewElement, contentElement, leftElement, rightElement];
};
var confirmStyle = function confirmStyle(actionStyle, actionItem) {
  var isConfirm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var wrapElement = actionItem.wrapElement,
    element = actionItem.element,
    _actionItem$confirm = actionItem.confirm,
    confirm = _actionItem$confirm === void 0 ? {} : _actionItem$confirm,
    rest = (0, _objectWithoutProperties2.default)(actionItem, _excluded);
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
  (0, _util.setStyle)(element, {
    color: color || 'inherit',
    background: background || 'inherit',
    boxShadow: actionStyle === 'round' ? "0px 0px 9px -3px ".concat(background || 'inherit') : 'none'
  });
  if (actionStyle !== 'round') {
    (0, _util.setStyle)(wrapElement, {
      background: background || 'inherit'
    });
  }
  (0, _util.addClass)((0, _util.removeClass)(element, isConfirm ? rest.className || '' : confirm.className || rest.className || ''), className || '');
  if (icon) {
    var iconEl = element.firstChild;
    var type = (0, _util.getIconType)(icon);
    if (type === 'img') {
      iconEl.src = icon;
    } else if (type === 'i') {
      iconEl.className = icon;
    } else {
      iconEl.innerHTML = icon;
    }
  }
  if (text) {
    var textEl = element.lastChild;
    textEl.innerText = text;
  }
};
var cTransform = function cTransform(confirm) {
  var _this = this;
  var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var contentEl = this.contentEl,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    duration = this.duration,
    timing = this.timing;
  if (!contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var transition = duration <= 0 ? '' : "transform ".concat(duration, "s ").concat(timing, " 0s");
  var index = confirm.index,
    direction = confirm.direction;
  // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translate等于0了，所以无需再判断
  var factor = this._translate === 0 ? 0 : this._translate / Math.abs(this._translate);
  var aTransform = function aTransform(_ref) {
    var items = _ref.items;
    // 前面已有按钮的占比距离
    var transformTotal = 0;
    for (var i = items.length - 1; i >= 0; i--) {
      var _items$i = items[i],
        wrapElement = _items$i.wrapElement,
        width = _items$i.width;
      if (items.length === 1) {
        // 如果是仅有一个按钮，确认的时候设置2倍变化
        (0, _util.setStyle)(contentEl, {
          transform: "translate3d(".concat(translate !== 0 ? translate : _this._translate, "px, 0, 0)"),
          transition: transition
        });
      }
      if (i === index) {
        var transformx = 0;
        if (translate !== 0) {
          transformx = translate;
        } else {
          transformx = (width + transformTotal) * factor;
        }
        (0, _util.setStyle)(wrapElement, {
          transform: "translate3d(".concat(transformx, "px, 0, 0)"),
          transition: transition
        });
      } else if (i > index) {
        var _transformx = 0;
        if (translate === 0) {
          _transformx = (width + transformTotal) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        (0, _util.setStyle)(wrapElement, {
          transform: "translate3d(".concat(_transformx, "px, 0, 0)"),
          transition: transition
        });
      }
      transformTotal += width;
    }
  };
  // 放入下一帧执行
  window.requestAnimationFrame(function () {
    if (direction === 'left' && leftActions) {
      aTransform(leftActions);
    }
    if (direction === 'right' && rightActions) {
      aTransform(rightActions);
    }
  });
};
var transform = function transform(translate) {
  var _this2 = this;
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
  var contentEl = this.contentEl,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    timing = this.timing;
  if (!contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var transition = duration <= 0 ? '' : "transform ".concat(duration, "s ").concat(timing, " 0s");
  var aTransform = function aTransform(_ref2) {
    var items = _ref2.items,
      overallSize = _ref2.overallSize;
    // 前面已有按钮的占比距离
    var transformTotal = 0;
    var len = items.length - 1;
    for (var i = len; i >= 0; i--) {
      var _items$i2 = items[i],
        wrapElement = _items$i2.wrapElement,
        width = _items$i2.width;
      // 当前按钮需要滑出的占比距离
      var transformb = width / overallSize * translate;
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      var transformx = transformb + transformTotal;
      // 左边或右边的最后一个按钮
      (0, _util.setStyle)(wrapElement, {
        transform: "translate3d(".concat(i === len && _this2._overshooting ? translate : transformx, "px, 0, 0)"),
        transition: transition
      });
      // 累计已滑出按钮的占比距离
      transformTotal += transformb;
    }
  };
  // 放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(function () {
    (0, _util.setStyle)(contentEl, {
      transform: "translate3d(".concat(translate, "px, 0, 0)"),
      transition: transition
    });
    // 这里是左右都进行变换，还是说根据translate的正负来判断只变换某一边的呢（因为另一边处于隐藏状态无需变换耗能）？
    // 答案是都要进行变换，因为存在一种情况，即滑动太快，left的translate还未走到0（没有完全收起），下一把就right了。
    if (leftActions) {
      aTransform(leftActions);
    }
    if (rightActions) {
      aTransform(rightActions);
    }
  });
};
var confirmCancel = function confirmCancel() {
  // 如果当前处于按钮确认状态，隐藏之前需要先取消
  if (this._confirming) {
    // 因为hide的时候会进行变换，所以不需要再cTransform
    var _this$_confirming = this._confirming,
      index = _this$_confirming.index,
      direction = _this$_confirming.direction;
    var actions = direction === 'left' ? this.leftActions : direction === 'right' ? this.rightActions : null;
    if (actions) {
      var item = actions.items[index];
      if (index !== actions.items.length - 1 || !this._overshooting) {
        (0, _util.setStyle)(item.element, {
          width: item.width - item.margin
        });
      }
      confirmStyle(actions.style, item);
    }
    this._confirming = null;
  }
};
var start = function start(e) {
  var leftActions = this.leftActions,
    rightActions = this.rightActions;
  if ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var point = e.point;
  this._isMoving = true;
  this._startPoint = point;
  this._startTranslate = this._translate;
  this._timeStamp = 0;
};
var move = function move(e) {
  var leftActions = this.leftActions,
    rightActions = this.rightActions,
    friction = this.friction;
  if (!this._isMoving || !this._startPoint || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var currentPoint = e.point,
    sourceEvent = e.sourceEvent;
  var currentX = currentPoint[0] - this._startPoint[0];
  var currentY = currentPoint[1] - this._startPoint[1];
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (Math.abs(currentX) - Math.abs(currentY) < 0) {
    return;
  }
  // 滑动距离
  var moveEdge = false;
  var translate = 0;
  var duration = 0;
  var currentTranslate = this._startTranslate + currentX;
  var actions = currentTranslate > 0 ? leftActions : currentTranslate < 0 ? rightActions : null;
  if (actions && !actions.disable) {
    var vector = currentTranslate / Math.abs(currentTranslate);
    var overshoot = actions.overshoot;
    var overshootEdgeSize = actions.overshootEdgeSize;
    var overshootSize = vector * actions.overshootSize;
    var overallSize = vector * actions.overallSize;
    if (overshoot) {
      // 如果手指从容器一半之外开始移动，只要手指移动到接近边缘，就可以overshoot
      if (this._offset) {
        var deltaSize = 0;
        var currentOffset = currentPoint[0] - this._offset[0];
        var startOffset = this._startPoint[0] - this._offset[0];
        var maxOffset = this._elWidth * 0.5;
        if (currentTranslate < 0) {
          deltaSize = currentOffset - overshootEdgeSize;
          moveEdge = startOffset > maxOffset && deltaSize < 0;
        } else {
          deltaSize = currentOffset - (this._elWidth - overshootEdgeSize);
          moveEdge = startOffset < maxOffset && deltaSize > 0;
        }
        if (moveEdge) {
          this._startPoint = currentPoint;
          currentTranslate = overshootSize + deltaSize;
        }
      }
      var timeStamp = sourceEvent instanceof MouseEvent ? sourceEvent.timeStamp : sourceEvent.sourceEvent.timeStamp;
      // currentTranslate和overshootSize一定是同正或同负，直接比较数值大小，即currentTranslate超出overshootSize范围
      if (Math.abs(currentTranslate) >= Math.abs(overshootSize)) {
        if (!this._overshooting) {
          this._timeStamp = timeStamp;
          this._overshooting = true;
          var _actions$items = actions.items[actions.items.length - 1],
            el = _actions$items.element,
            margin = _actions$items.margin;
          (0, _util.setStyle)(el, {
            width: actions.style === 'round' ? this._elWidth - margin : 'auto'
          });
        }
        translate = (0, _util.rebounceSize)(currentTranslate - overshootSize, friction) + overshootSize;
        duration = Math.max(0, this.duration - (timeStamp - this._timeStamp) / 1000);
      } else {
        if (this._overshooting) {
          this._timeStamp = timeStamp;
          this._overshooting = false;
          var _actions$items2 = actions.items[actions.items.length - 1],
            _el = _actions$items2.element,
            width = _actions$items2.width,
            _margin = _actions$items2.margin;
          (0, _util.setStyle)(_el, {
            width: width - _margin
          });
        }
        // 这里需不需要来一点阻尼？感觉苹果是有的
        if (Math.abs(currentTranslate) >= Math.abs(overallSize)) {
          // 这里不能根据数值大小来比较，因为this._startTranslate和overallSize不一定是同正或同负
          var _overallSize = currentTranslate < 0 ? Math.min(overallSize, this._startTranslate) : Math.max(overallSize, this._startTranslate);
          translate = (0, _util.rebounceSize)(currentTranslate - _overallSize, 0.95) + _overallSize;
        } else {
          translate = currentTranslate;
        }
        duration = Math.max(0, this.duration / 2 - (timeStamp - this._timeStamp) / 1000);
      }
    } else {
      // currentTranslate和overallSize一定是同正或同负，直接比较数值大小，即currentTranslate超出overallSize范围
      if (Math.abs(currentTranslate) >= Math.abs(overallSize)) {
        // 这里不能根据数值大小来比较，因为this._startTranslate和overallSize不一定是同正或同负
        var _overallSize2 = currentTranslate < 0 ? Math.min(overallSize, this._startTranslate) : Math.max(overallSize, this._startTranslate);
        translate = (0, _util.rebounceSize)(currentTranslate - _overallSize2, friction) + _overallSize2;
      } else {
        translate = currentTranslate;
      }
    }
  } else {
    this._startPoint = currentPoint;
    this._startTranslate = 0;
    this._timeStamp = 0;
  }
  translate = Math.min(this._elWidth, Math.max(-this._elWidth, translate));
  if (moveEdge) {
    this._startTranslate = translate;
  }
  this._translate = translate;
  transform.apply(this, [translate, duration]);
  confirmCancel.apply(this, []);
  return false; // 禁止垂直方向的滑动
};

var end = function end(e) {
  var leftActions = this.leftActions,
    rightActions = this.rightActions;
  if (!this._isMoving || !this._startPoint || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var startPoint = this._startPoint;
  var currentPoint = e.point;
  this._isMoving = false;
  this._startTranslate = 0;
  this._startPoint = null;
  this._timeStamp = 0;
  // 滑动距离为0（表示本身就是隐藏状态）或没有任何滑动（只是点了一下）不做任何操作
  // 这个判断是因为手势里默认移动距离在3px以内不算移动
  if (this._translate === 0 || (0, _util.getDistance)(startPoint, currentPoint) < 3) {
    return;
  }
  var actions = this._translate > 0 ? leftActions : this._translate < 0 ? rightActions : null;
  if (actions) {
    // 进行覆盖滑出行为
    if (this._overshooting) {
      buttonSlide.apply(this, [e, {
        index: actions.items.length - 1,
        direction: this._translate > 0 ? 'left' : 'right'
      }]);
      return;
    }
    // 右边按钮展示状态下往右滑动了，或者右边按钮未展示情况下，左滑出的距离不足滑出阈值
    var delta = currentPoint[0] - startPoint[0];
    if (this._translate > 0 && delta < 0 || this._translate < 0 && delta > 0 || Math.abs(this._translate) < actions.threshold) {
      this.hide();
      return;
    }
  }
  // 其它情况均为展示按钮
  this.show(this._translate > 0 ? 'left' : 'right');
};
var longPress = function longPress(e) {
  var contentEl = this.contentEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = sourceEvent instanceof MouseEvent ? sourceEvent.target : sourceEvent.sourceEvent.target;
  while (target !== currentTarget && target !== contentEl) {
    target = target.parentNode;
  }
  // 触发内容双按压事件
  if (target === contentEl) {
    // 收起时候则触发长按事件，未收起则收起
    if (_translate === 0) {
      this.trigger('longPress', {
        currentTarget: contentEl,
        timeStamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
};
var doublePress = function doublePress(e) {
  var contentEl = this.contentEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = sourceEvent instanceof MouseEvent ? sourceEvent.target : sourceEvent.sourceEvent.target;
  while (target !== currentTarget && target !== contentEl) {
    target = target.parentNode;
  }
  // 触发内容双按压事件
  if (target === contentEl) {
    // 收起时候则触发双按事件，未收起则收起
    if (_translate === 0) {
      this.trigger('doublePress', {
        currentTarget: contentEl,
        timeStamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
};
var press = function press(e) {
  var contentEl = this.contentEl,
    leftEl = this.leftEl,
    rightEl = this.rightEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = sourceEvent instanceof MouseEvent ? sourceEvent.target : sourceEvent.sourceEvent.target;
  while (target !== currentTarget && target !== contentEl && target !== leftEl && target !== rightEl) {
    target = target.parentNode;
  }
  // 触发内容元素按压事件
  if (target === contentEl) {
    // 没有使用this._direction判断，是因为该值变化是要动画结束后变化，this._translate变化是动画执行前
    // 使用this._translate判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._direction正好相反
    // 收起时候则触发按压事件，未收起则收起
    if (_translate === 0) {
      this.trigger('press', {
        currentTarget: contentEl,
        timeStamp: Date.now(),
        sourceEvent: e
      });
    } else {
      this.hide();
    }
  }
  // 触发左边按钮按压事件
  else if (target === leftEl) {
    buttonPress.apply(this, [e, 'left']);
  }
  // 触发右边按钮按压事件
  else if (target === rightEl) {
    buttonPress.apply(this, [e, 'right']);
  }
};
var buttonPress = function buttonPress(event, direction) {
  var _this3 = this;
  var leftActions = this.leftActions,
    rightActions = this.rightActions,
    rebounce = this.rebounce;
  if (this._translate === 0 || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var sourceEvent = event.sourceEvent,
    currentTarget = event.currentTarget;
  var target = sourceEvent instanceof MouseEvent ? sourceEvent.target : sourceEvent.sourceEvent.target;
  while (target !== currentTarget && !target.getAttribute('data-index')) {
    target = target.parentNode;
  }
  var index = +(target.getAttribute('data-index') || -1);
  var actions = direction === 'left' ? leftActions : rightActions;
  if (index < 0 || !actions || actions.disable) {
    return;
  }
  var confirm = {
    index: index,
    direction: direction
  };
  var item = actions.items[index];
  // 最后一个按钮单独处理
  if (index === actions.items.length - 1 && actions.overshoot) {
    this._overshooting = true;
    (0, _util.setStyle)(item.element, {
      width: actions.style === 'round' ? this._elWidth - item.margin : 'auto'
    });
    buttonSlide.apply(this, [event, confirm, target]);
    return;
  }
  var eventType = 'buttonPress';
  // 确认之后二次点击（确保当前点击的即是正在确认的）
  if (this._confirming && this._confirming.index === index && this._confirming.direction === direction) {
    // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
    if (item.collapse) {
      this.hide();
    } else {
      // 取消确认
      (0, _util.setStyle)(item.element, {
        width: item.width - item.margin
      });
      confirmStyle(actions.style, item);
      cTransform.apply(this, [confirm]);
      this._confirming = null;
    }
  } else {
    if (item.confirm) {
      // 如果是仅有一个按钮，确认的时候宽度设置2倍变化，但是不能超过最大宽度
      var translate = this._translate;
      if (actions.items.length === 1) {
        translate = Math.min(Math.abs(2 * this._translate), this._elWidth) * translate / Math.abs(translate);
      }
      this._confirming = confirm;
      (0, _util.setStyle)(item.element, {
        width: Math.abs(translate) - item.margin
      });
      confirmStyle(actions.style, item, true);
      // 设置回弹效果，第一个按钮和圆型按钮不需要
      if (rebounce > 0 && actions.style !== 'round' && index !== 0) {
        (0, _agent.onOnceTransitionEnd)(item.wrapElement, function () {
          // 该事件执行时确保当前还处于确认状态，否则不能再执行
          if (_this3._confirming && _this3._confirming.index === confirm.index && _this3._confirming.direction === confirm.direction) {
            cTransform.apply(_this3, [confirm, translate]);
          }
        });
        cTransform.apply(this, [confirm, translate + rebounce * translate / Math.abs(translate)]);
      } else {
        cTransform.apply(this, [confirm, translate]);
      }
      eventType = 'buttonConfirm';
    } else {
      // 无需确认的点击（如果collapse，就点击后隐藏按钮，否则不做任何处理）
      if (item.collapse) {
        this.hide();
      }
    }
  }
  this.trigger(eventType, {
    index: index,
    data: item.data,
    currentTarget: target,
    timeStamp: Date.now(),
    sourceEvent: event
  });
};
var buttonSlide = function buttonSlide(event, confirm, target) {
  var leftActions = this.leftActions,
    rightActions = this.rightActions;
  var index = confirm.index,
    direction = confirm.direction;
  var actions = direction === 'left' ? leftActions : direction === 'right' ? rightActions : null;
  if (this._translate === 0 || !actions || actions.disable) {
    return;
  }
  var item = actions.items[index];
  var eventType = 'buttonPress';
  // overshoot之后二次点击（确保当前点击的即是正在确认的）
  if (this._confirming && this._confirming.index === index && this._confirming.direction === direction) {
    confirmStyle(actions.style, item);
    this._confirming = null;
    // 确认后只做取消确认的样式改变，不做收起的改变（忽略了collapse）后续行为交给用户，让其决定否调用hide或show
  } else {
    // 无论是否确认都需要overshoot
    var translate = this._translate * this._elWidth / Math.abs(this._translate);
    // 已经overshoot的情况就不需要再overshoot
    if (this._translate !== translate) {
      this._translate = translate;
      transform.apply(this, [translate]);
    }
    // 需要确认，触发确认事件
    if (item.confirm) {
      this._confirming = confirm;
      confirmStyle(actions.style, item, true);
      eventType = 'buttonConfirm';
    } else {
      // 不做收起的改变（忽略了collapse）后续行为交给用户，让其决定否调用hide或show
    }
  }
  this.trigger(eventType, {
    index: index,
    data: item.data,
    currentTarget: target || item.element,
    timeStamp: Date.now(),
    sourceEvent: event
  });
};
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
  // 视图宽度
  // 手指放上后滑动视图元素距离屏幕左边和上边的距离即[offsetLeft,offsetTop]
  //是否销毁
  // 当前展示的是哪个方向按钮
  // 当前正在确认的按钮
  // 当前是否处于overshoot状态
  // 元素当前位移值
  // 手指放上那一刻，translate值
  // 手指放上后初始点
  // 移动时的时间戳

  function SlideView(options) {
    var _this4;
    (0, _classCallCheck2.default)(this, SlideView);
    _this4 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "leftActions", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "rightActions", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "friction", 0.5);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "rebounce", 12);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "duration", 0.4);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "timing", 'ease');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_elWidth", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_offset", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_destory", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_direction", 'none');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_confirming", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_overshooting", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_translate", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_startTranslate", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_startPoint", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_timeStamp", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_isMoving", false);
    var className = options.className,
      container = options.container,
      content = options.content,
      friction = options.friction,
      rebounce = options.rebounce,
      duration = options.duration,
      timing = options.timing,
      leftActions = options.leftActions,
      rightActions = options.rightActions;
    var _generateEl = generateEl(container, className),
      _generateEl2 = (0, _slicedToArray2.default)(_generateEl, 4),
      element = _generateEl2[0],
      contentEl = _generateEl2[1],
      leftEl = _generateEl2[2],
      rightEl = _generateEl2[3];
    _this4.element = element;
    var _element$getBoundingC = element.getBoundingClientRect(),
      width = _element$getBoundingC.width,
      left = _element$getBoundingC.left,
      top = _element$getBoundingC.top;
    _this4._elWidth = width;
    _this4._offset = [left, top];
    _this4.contentEl = contentEl;
    _this4.leftEl = leftEl;
    _this4.rightEl = rightEl;
    _this4.setContent(content);
    _this4.setFriction(friction);
    _this4.setRebounce(rebounce);
    _this4.setDuration(duration);
    _this4.setTiming(timing);
    _this4.setActions(leftActions, 'left');
    _this4.setActions(rightActions, 'right');
    _this4._agents = (0, _agent.default)(element, {
      start: start.bind((0, _assertThisInitialized2.default)(_this4)),
      move: move.bind((0, _assertThisInitialized2.default)(_this4)),
      end: end.bind((0, _assertThisInitialized2.default)(_this4)),
      press: press.bind((0, _assertThisInitialized2.default)(_this4)),
      longPress: longPress.bind((0, _assertThisInitialized2.default)(_this4)),
      doublePress: doublePress.bind((0, _assertThisInitialized2.default)(_this4))
    });
    return _this4;
  }
  (0, _createClass2.default)(SlideView, [{
    key: "setContent",
    value: function setContent() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (this._destory || !this.contentEl) {
        return;
      }
      if (typeof content === 'string' && !content.match(/^[#|.].+/)) {
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
      var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
      if (this._destory) {
        return;
      }
      // disable: 不传为默认值true，传非布尔，则无效设置
      if (typeof disable === 'boolean') {
        // direction传其它，则属于无效设置
        if (this.leftActions && (direction === 'both' || direction === 'left')) {
          this.leftActions.disable = disable;
        }
        if (this.rightActions && (direction === 'both' || direction === 'right')) {
          this.rightActions.disable = disable;
        }
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
          this.leftActions.threshold = Math.min(_threshold, this.leftActions.overallSize);
        }
        if (this.rightActions && (direction === 'both' || direction === 'right')) {
          this.rightActions.threshold = Math.min(_threshold, this.rightActions.overallSize);
        }
      }
    }
  }, {
    key: "setActions",
    value: function setActions() {
      var _this5 = this;
      var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
      if (this._destory) {
        return;
      }
      // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
      var _setActions = function _setActions(_direction) {
        var parentEl = _this5["".concat(_direction, "El")];
        if (!parentEl) {
          return;
        }
        parentEl.innerHTML = '';
        _this5["".concat(_direction, "Actions")] = null;
        if (actions.items && actions.items.length > 0) {
          var className = actions.className,
            _actions$style = actions.style,
            style = _actions$style === void 0 ? 'rect' : _actions$style,
            _actions$disable = actions.disable,
            disable = _actions$disable === void 0 ? false : _actions$disable,
            _actions$overshoot = actions.overshoot,
            overshoot = _actions$overshoot === void 0 ? false : _actions$overshoot,
            _actions$overshootEdg = actions.overshootEdgeSize,
            overshootEdgeSize = _actions$overshootEdg === void 0 ? 80 : _actions$overshootEdg,
            _actions$overshootFre = actions.overshootFreeSize,
            overshootFreeSize = _actions$overshootFre === void 0 ? 30 : _actions$overshootFre,
            _actions$overallFreeS = actions.overallFreeSize,
            overallFreeSize = _actions$overallFreeS === void 0 ? 60 : _actions$overallFreeS,
            _actions$threshold = actions.threshold,
            threshold = _actions$threshold === void 0 ? 40 : _actions$threshold,
            items = actions.items;
          var actionEl = (0, _util.addClass)(document.createElement('div'), "hjs-slideview__actions hjs-slideview__actions__".concat(style, " ").concat(className || ''));
          parentEl.appendChild(actionEl);
          var totalWidth = 0;
          var newItems = items.map(function (item, index) {
            var text = item.text,
              icon = item.icon;
            var wrapEl = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__action__wrap');
            var itemEl = (0, _util.addClass)(document.createElement('div'), 'hjs-slideview__action');
            itemEl.setAttribute('data-index', String(index));
            if (icon) {
              itemEl.appendChild((0, _util.addClass)(document.createElement((0, _util.getIconType)(icon)), 'hjs-slideview__action__icon'));
            }
            if (text) {
              itemEl.appendChild((0, _util.addClass)(document.createElement('span'), 'hjs-slideview__action__text'));
            }
            wrapEl.appendChild(itemEl);
            actionEl.appendChild(wrapEl);
            var actionItem = _objectSpread(_objectSpread({}, item), {}, {
              wrapElement: wrapEl,
              element: itemEl,
              width: 0,
              margin: 0
            });
            // 设置非确认时的样式和内容
            confirmStyle(style, actionItem);
            var margin = (0, _util.getMarginSize)(itemEl);
            var width = itemEl.getBoundingClientRect().width + margin;
            totalWidth += width;
            return _objectSpread(_objectSpread({}, actionItem), {}, {
              width: width,
              margin: margin
            });
          });
          var overallSize = Math.min(totalWidth, Math.max(_this5._elWidth - overallFreeSize, 0));
          newItems = newItems.map(function (item) {
            var element = item.element,
              width = item.width,
              margin = item.margin;
            var newWidth = overallSize * width / totalWidth;
            (0, _util.setStyle)(element, {
              width: newWidth - margin
            });
            return _objectSpread(_objectSpread({}, item), {}, {
              width: newWidth
            });
          });
          _this5["".concat(_direction, "Actions")] = {
            style: style,
            disable: disable,
            overshoot: overshoot,
            overallSize: overallSize,
            overshootSize: Math.min(_this5._elWidth, Math.max(_this5._elWidth - overshootFreeSize, overallSize)),
            overshootEdgeSize: Math.min(_this5._elWidth * 0.5, Math.max(0, overshootEdgeSize)),
            threshold: Math.min(overallSize, Math.max(threshold, 0)),
            items: newItems
          };
        }
      };
      // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
      var shown = this._translate > 0 ? 'left' : this._translate < 0 ? 'right' : 'none';
      this.hide().then(function () {
        // direction传其它，则属于无效设置
        if (direction === 'both' || direction === 'left') {
          _setActions('left');
        }
        if (direction === 'both' || direction === 'right') {
          _setActions('right');
        }
        if (shown !== 'none') {
          _this5.show(shown);
        }
      });
    }
  }, {
    key: "toggle",
    value: function toggle() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
      if (this._destory) {
        return;
      }
      return this._translate === 0 ? this.show(direction) : this.hide();
    }
  }, {
    key: "show",
    value: function show() {
      var _this6 = this;
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
      return new Promise(function (resolve) {
        var contentEl = _this6.contentEl,
          rebounce = _this6.rebounce,
          leftActions = _this6.leftActions,
          rightActions = _this6.rightActions;
        if (_this6._destory || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
          resolve();
          return;
        }
        var __direction = direction;
        if (!leftActions || leftActions.disable) {
          __direction = 'right';
        }
        if (!rightActions || rightActions.disable) {
          __direction = 'left';
        }
        var actions = __direction === 'left' ? leftActions : rightActions;
        var factor = __direction === 'left' ? 1 : -1;
        var maxTranslate = !actions ? 0 : actions.overallSize * factor;
        if (_this6._translate === maxTranslate) {
          resolve();
          return;
        }
        var show = function show() {
          var rebSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var translate = maxTranslate + rebSize;
          _this6._overshooting = false;
          _this6._translate = translate;
          transform.apply(_this6, [translate]);
          confirmCancel.apply(_this6, []);
          if (!rebSize) {
            (0, _agent.onOnceTransitionEnd)(contentEl, function () {
              resolve();
              if (_this6._direction !== __direction) {
                _this6.trigger('show', {
                  direction: __direction,
                  currentTarget: contentEl,
                  timeStamp: Date.now(),
                  sourceEvent: null
                });
                _this6._direction = __direction;
              }
            });
          }
        };
        // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
        if (rebounce > 0 && (maxTranslate > 0 && _this6._translate < maxTranslate || maxTranslate < 0 && _this6._translate > maxTranslate)) {
          (0, _agent.onOnceTransitionEnd)(contentEl, function () {
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
      var _this7 = this;
      return new Promise(function (resolve) {
        var contentEl = _this7.contentEl,
          leftActions = _this7.leftActions,
          rightActions = _this7.rightActions;
        if (_this7._destory || _this7._translate === 0 || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
          resolve();
          return;
        }
        _this7._overshooting = false;
        _this7._translate = 0;
        transform.apply(_this7, [0]);
        // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
        (0, _agent.onOnceTransitionEnd)(contentEl, function () {
          resolve();
          // hide在隐藏之后再处理confirm
          confirmCancel.apply(_this7, []);
          if (_this7._direction !== 'none') {
            _this7.trigger('hide', {
              direction: 'none',
              currentTarget: contentEl,
              timeStamp: Date.now(),
              sourceEvent: null
            });
            _this7._direction = 'none';
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
      if (this._agents) {
        this._agents.destory();
        this._agents = null;
      }
      if (this.element) {
        // 删除元素，用户可以在调用该方法之前加一个删除动画
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
      }
      this.contentEl = null;
      this.leftEl = null;
      this.rightEl = null;
      this.leftActions = null;
      this.rightActions = null;
      this._confirming = null;
      this._startPoint = null;
      this._offset = null;
      this._destory = true;
    }
  }]);
  return SlideView;
}(_event.default);
var _default = SlideView;
exports.default = _default;