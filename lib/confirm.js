"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirmStyle = exports.confirmCancel = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _util = require("./util");
var _excluded = ["wrapper", "element", "confirm"];
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
exports.confirmStyle = confirmStyle;
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
exports.confirmCancel = confirmCancel;