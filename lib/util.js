"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClass = addClass;
exports.getAngle = getAngle;
exports.getCenter = getCenter;
exports.getDirection = getDirection;
exports.getDistance = getDistance;
exports.getIconType = getIconType;
exports.getMarginSize = void 0;
exports.getVelocity = getVelocity;
exports.isTouchable = isTouchable;
exports.rebounceSize = rebounceSize;
exports.removeClass = removeClass;
exports.setStyle = setStyle;
exports.styleInject = styleInject;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-10 10:33:06
 * @Description: ******
 */

function isTouchable(ele) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}
function getDistance(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2.default)(_ref, 2),
    x0 = _ref3[0],
    y0 = _ref3[1];
  var _ref4 = (0, _slicedToArray2.default)(_ref2, 2),
    x1 = _ref4[0],
    y1 = _ref4[1];
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}
function getVelocity(deltaTime, distance) {
  return distance / deltaTime || 0;
}
function getAngle(_ref5, _ref6) {
  var _ref7 = (0, _slicedToArray2.default)(_ref5, 2),
    x0 = _ref7[0],
    y0 = _ref7[1];
  var _ref8 = (0, _slicedToArray2.default)(_ref6, 2),
    x1 = _ref8[0],
    y1 = _ref8[1];
  return Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
}
function getCenter(_ref9, _ref10) {
  var _ref11 = (0, _slicedToArray2.default)(_ref9, 2),
    x0 = _ref11[0],
    y0 = _ref11[1];
  var _ref12 = (0, _slicedToArray2.default)(_ref10, 2),
    x1 = _ref12[0],
    y1 = _ref12[1];
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}
function getDirection(_ref13, _ref14) {
  var _ref15 = (0, _slicedToArray2.default)(_ref13, 2),
    x0 = _ref15[0],
    y0 = _ref15[1];
  var _ref16 = (0, _slicedToArray2.default)(_ref14, 2),
    x1 = _ref16[0],
    y1 = _ref16[1];
  var x = x0 - x1;
  var y = y0 - y1;
  if (x === y) {
    return 'None';
  }
  return Math.abs(x) >= Math.abs(y) ? x0 - x1 > 0 ? 'Left' : 'Right' : y0 - y1 > 0 ? 'Up' : 'Down';
}
function rebounceSize(value, friction) {
  var inverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (friction <= 0) {
    return 1;
  }
  var v = value || 1;
  var f = Math.min(1, friction);
  f = inverse ? 1 / f : f;
  return Math.pow(Math.abs(v), f) * v / Math.abs(v);
}
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
function setStyle(ele, css) {
  if (ele) {
    Object.keys(css).forEach(function (k) {
      if (typeof css[k] === 'undefined') {
        return;
      }
      var key = k.indexOf('-') !== -1 ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
      var val = typeof css[k] === 'number' && key !== 'z-index' && key !== 'opacity' ? "".concat(css[k], "px") : String(css[k]);
      ele.style.setProperty(key, val);
    });
  }
  return ele;
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
    if (Number.isNaN(val)) {
      val = 0;
    }
  }
  return val;
};
exports.getMarginSize = getMarginSize;
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
var styleId = 'hjs-slide-view-style';
function styleInject(cssText) {
  var style = document.querySelector("#".concat(styleId));
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    style.appendChild(document.createTextNode(cssText));
    (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
  }
}