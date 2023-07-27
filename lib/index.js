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
var _gesture = require("@huangjs888/gesture");
var _damping = require("@huangjs888/damping");
var _agent = _interopRequireWildcard(require("./agent"));
var _util = require("./util");
var _css = _interopRequireDefault(require("./css"));
var _excluded = ["wrapper", "element", "confirm"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
  (0, _util.cssInject)(_css.default);
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
var confirmStyle = function confirmStyle(item) {
  var isConfirm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var wrapper = item.wrapper,
    element = item.element,
    _item$confirm = item.confirm,
    confirm = _item$confirm === void 0 ? {} : _item$confirm,
    rest = (0, _objectWithoutProperties2.default)(item, _excluded);
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
  (0, _util.setStyle)(wrapper, {
    background: background || '',
    color: color || ''
  });
  (0, _util.addClass)((0, _util.removeClass)(element, isConfirm ? rest.className || '' : confirm.className || rest.className || ''), className || '');
  if (icon) {
    var iconEl = element.firstElementChild;
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
    var textEl = element.lastElementChild;
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
          transformx = (width + gap[1] + transformTotal) * factor;
        }
        (0, _util.setStyle)(wrapper, {
          transform: "translate3d(".concat(transformx + delta, "px, 0, 0)"),
          transition: transition
        });
      } else if (i > index) {
        var _transformx = 0;
        if (translate === 0) {
          _transformx = (width + gap[1] + transformTotal) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        (0, _util.setStyle)(wrapper, {
          transform: "translate3d(".concat(_transformx + delta, "px, 0, 0)"),
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
var transform = function transform(translate) {
  var _this2 = this;
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
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
  var transition = duration <= 0 ? '' : "transform ".concat(duration, "s ").concat(timing, " 0s");
  var wTransition = duration <= 0 ? '' : "width ".concat(duration, "s ").concat(timing, " 0s, transform ").concat(duration, "s ").concat(timing, " 0s");
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
      (0, _util.setStyle)(element, {
        width: Math.max(Math.abs(translate), tWidth),
        transform: "translate3d(".concat(translate, "px, 0, 0)"),
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
      (0, _util.setStyle)(wrapper, _objectSpread({
        transform: "translate3d(".concat((i === len && _this2._overshooting ? translate : transformx) + delta, "px, 0, 0)"),
        transition: transition
      }, styleObj));
      // 累计已滑出按钮的占比距离
      transformTotal += transformb + factor * gap[0];
    }
  };
  // move事件发生，放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(function () {
    (0, _util.setStyle)(contentEl, {
      transform: "translate3d(".concat(translate, "px, 0, 0)"),
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
      (0, _util.setStyle)(item.element, {
        width: ''
      });
      confirmStyle(item);
    }
    this._confirming = null;
  }
};
var overshootChange = function overshootChange(actions) {
  if (actions && !actions.disable) {
    var item = actions.items[actions.items.length - 1];
    (0, _util.setStyle)(item.wrapper, {
      width: this._overshooting ? '100%' : ''
    });
  }
};
var start = function start(e) {
  var element = this.element,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    friction = this.friction;
  if (!element || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  // 每次start重新计算容器宽度和offsetLeft(防止屏幕变化)
  var _element$getBoundingC = element.getBoundingClientRect(),
    width = _element$getBoundingC.width,
    left = _element$getBoundingC.left;
  this._width = width;
  this._offset = left;
  var point = e.point;
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
    var criticalTranslate = (overshoot ? Math.min(width, Math.max(width - overshootFreeSize, tWidth)) : tWidth) * this._translate / Math.abs(this._translate);
    if (Math.abs(this._translate) <= Math.abs(criticalTranslate)) {
      startTranslate = this._translate;
    } else {
      // 恢复_translate的弹性尺寸部分
      startTranslate = (0, _damping.revokeDamping)(this._translate - criticalTranslate, {
        expo: friction
      }) + criticalTranslate;
    }
  }
  this._startTranslate = startTranslate;
};
var move = function move(e) {
  var leftActions = this.leftActions,
    rightActions = this.rightActions,
    friction = this.friction;
  if (!this._isMoving || !this._startPoint || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var currentPoint = e.point;
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
          overshootChange.apply(this, [actions]);
          var index = actions.items.length - 1;
          var item = actions.items[index];
          if (item.confirm) {
            confirmStyle(item, true);
            this._confirming = {
              index: index,
              direction: factor > 0 ? 'left' : 'right'
            };
          }
        }
        translate = (0, _damping.performDamping)(currentTranslate - otSize, {
          expo: friction
        }) + otSize;
        duration = Math.max(0, this.duration - (timestamp - this._timestamp) / 1000);
      } else {
        if (this._overshooting) {
          this._timestamp = timestamp;
          this._overshooting = false;
          overshootChange.apply(this, [actions]);
          var _index = actions.items.length - 1;
          var _item = actions.items[_index];
          if (_item.confirm) {
            confirmStyle(_item);
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
        console.log(22, (0, _damping.performDamping)(currentTranslate - oaSize, {
          expo: friction
        }));
        translate = (0, _damping.performDamping)(currentTranslate - oaSize, {
          // max: rebounce * 2,
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
  transform.apply(this, [translate, duration]);
  if (!this._overshooting) {
    confirmCancel.apply(this, []);
  }
  return;
};
var end = function end(e) {
  var leftActions = this.leftActions,
    rightActions = this.rightActions;
  if (!this._isMoving || !this._startPoint || this._startAngle !== 1 || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  this._isMoving = false;
  var startPoint = this._startPoint;
  var currentPoint = e.point;
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
      transform.apply(this, [translate]);
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
};
var longPress = function longPress(e) {
  var contentEl = this.contentEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && t !== contentEl;
  });
  // 触发内容双按压事件
  if (target === contentEl) {
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
};
var doublePress = function doublePress(e) {
  var contentEl = this.contentEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && t !== contentEl;
  });
  // 触发内容双按压事件
  if (target === contentEl) {
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
};
var press = function press(e) {
  var contentEl = this.contentEl,
    leftEl = this.leftEl,
    rightEl = this.rightEl,
    _translate = this._translate;
  var sourceEvent = e.sourceEvent,
    currentTarget = e.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && t !== contentEl && t !== leftEl && t !== rightEl;
  });
  // 触发内容元素按压事件
  if (target === contentEl) {
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
    buttonPress.apply(this, [e, 'left']);
  }
  // 触发右边按钮按压事件
  else if (target === rightEl) {
    buttonPress.apply(this, [e, 'right']);
  }
};
var buttonPress = function buttonPress(event, direction) {
  var _this3 = this;
  var element = this.element,
    leftActions = this.leftActions,
    rightActions = this.rightActions,
    rebounce = this.rebounce;
  if (this._translate === 0 || !element || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
    return;
  }
  var sourceEvent = event.sourceEvent,
    currentTarget = event.currentTarget;
  var target = (0, _util.findTarget)(sourceEvent, function (t) {
    return t !== currentTarget && !t.getAttribute('data-index');
  });
  var index = +(target.getAttribute('data-index') || -1);
  var actions = direction === 'left' ? leftActions : rightActions;
  if (index < 0 || !actions || actions.disable) {
    return;
  }
  var elWidth = element.getBoundingClientRect().width;
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
      confirmStyle(item);
      this._confirming = null;
    } else {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (item.collapse) {
        this.hide();
      } else {
        // 取消确认
        (0, _util.setStyle)(item.element, {
          width: ''
        });
        cTransform.apply(this, [confirm]);
        confirmStyle(item);
        this._confirming = null;
      }
    }
  } else {
    if (overshoot) {
      if (!this._overshooting) {
        this._overshooting = true;
        var translate = factor * elWidth;
        this._translate = translate;
        transform.apply(this, [translate]);
        overshootChange.apply(this, [actions]);
      }
      if (item.confirm) {
        this._confirming = confirm;
        confirmStyle(item, true);
        eventType = 'buttonConfirm';
      }
    } else {
      if (item.confirm) {
        // 如果是仅有一个按钮，确认的时候宽度设置2倍变化，但是不能超过最大宽度
        var _translate2 = this._translate;
        if (actions.items.length === 1) {
          _translate2 = Math.min(Math.abs(2 * _translate2), elWidth) * factor;
        }
        // 设置回弹效果，第一个按钮没有
        if (rebounce > 0 && index !== 0 /*  &&
                                        parseFloat(window.getComputedStyle(item.wrapper, null).width) ===
                                        elWidth */) {
          (0, _agent.onOnceTransitionEnd)(item.wrapper, function () {
            // 该事件执行时确保当前还处于确认状态，否则不能再执行
            if (_this3._confirming && _this3._confirming.index === confirm.index && _this3._confirming.direction === confirm.direction) {
              cTransform.apply(_this3, [confirm, _translate2]);
            }
          });
          cTransform.apply(this, [confirm, _translate2 + rebounce * _translate2 / Math.abs(_translate2)]);
        } else {
          cTransform.apply(this, [confirm, _translate2]);
        }
        (0, _util.setStyle)(item.wrapper, {
          width: ''
        });
        (0, _util.setStyle)(item.element, {
          width: Math.abs(_translate2)
        });
        this._confirming = confirm;
        confirmStyle(item, true);
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
    var _this4;
    (0, _classCallCheck2.default)(this, SlideView);
    _this4 = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "element", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "contentEl", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "leftEl", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "rightEl", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "leftActions", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "rightActions", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "friction", 0.5);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "rebounce", 12);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "duration", 0.4);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "timing", 'ease');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_destory", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_direction", 'none');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_confirming", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_overshooting", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_translate", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_width", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_offset", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_startOffset", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_startTranslate", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_startPoint", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_startAngle", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_timestamp", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_isMoving", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_agents", null);
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
      var _this5 = this;
      var disable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
      if (this._destory) {
        return;
      }
      // disable: 不传为默认值true，传非布尔，则无效设置
      if (typeof disable === 'boolean') {
        this.hide().then(function () {
          // direction传其它，则属于无效设置
          if (_this5.leftActions && (direction === 'both' || direction === 'left')) {
            _this5.leftActions.disable = disable;
          }
          if (_this5.rightActions && (direction === 'both' || direction === 'right')) {
            _this5.rightActions.disable = disable;
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
      var _this6 = this;
      var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'both';
      if (this._destory || direction === 'none') {
        return;
      }
      // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
      var _setActions = function _setActions(_direction) {
        var parentEl = _this6["".concat(_direction, "El")];
        if (!parentEl) {
          return;
        }
        parentEl.innerHTML = '';
        _this6["".concat(_direction, "Actions")] = null;
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
            confirmStyle(tItem);
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
          _this6["".concat(_direction, "Actions")] = {
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
        _this6.hide().then(function () {
          _setActions(_direction);
          _this6.show(_direction);
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
      var _this7 = this;
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
        if (_this7._translate === maxTranslate) {
          resolve();
          return;
        }
        var show = function show() {
          var rebSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var translate = maxTranslate + rebSize;
          _this7._translate = translate;
          transform.apply(_this7, [translate]);
          if (_this7._overshooting) {
            _this7._overshooting = false;
            overshootChange.apply(_this7, [_this7._translate > 0 ? leftActions : rightActions]);
          }
          confirmCancel.apply(_this7, []);
          if (!rebSize) {
            (0, _agent.onOnceTransitionEnd)(contentEl, function () {
              resolve();
              if (_this7._direction !== __direction) {
                _this7.emit('show', {
                  direction: __direction,
                  currentTarget: contentEl,
                  timestamp: Date.now(),
                  sourceEvent: null
                });
                _this7._direction = __direction;
              }
            });
          }
        };
        // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
        if (rebounce > 0 && (maxTranslate > 0 && _this7._translate < maxTranslate || maxTranslate < 0 && _this7._translate > maxTranslate)) {
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
      var _this8 = this;
      var contentEl = this.contentEl,
        leftActions = this.leftActions,
        rightActions = this.rightActions;
      if (this._destory || this._translate === 0 || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
        return Promise.resolve();
      }
      return new Promise(function (resolve) {
        _this8._translate = 0;
        transform.apply(_this8, [0]);
        // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
        (0, _agent.onOnceTransitionEnd)(contentEl, function () {
          resolve();
          if (_this8._overshooting) {
            _this8._overshooting = false;
            overshootChange.apply(_this8, [_this8._translate > 0 ? leftActions : rightActions]);
          }
          confirmCancel.apply(_this8, []);
          if (_this8._direction !== 'none') {
            _this8.emit('hide', {
              direction: 'none',
              currentTarget: contentEl,
              timestamp: Date.now(),
              sourceEvent: null
            });
            _this8._direction = 'none';
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