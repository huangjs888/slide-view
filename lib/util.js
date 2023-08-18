"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.addClass = addClass;
exports.cssInject = cssInject;
exports.findTarget = findTarget;
exports.getIconType = getIconType;
exports.getMarginSize = void 0;
exports.removeClass = removeClass;
exports.setStyle = setStyle;
var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/number/is-nan"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
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
    if ((0, _isNan.default)(val)) {
      val = 0;
    }
  }
  return val;
};
exports.getMarginSize = getMarginSize;
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
    (0, _keys.default)(css).forEach(function (k) {
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