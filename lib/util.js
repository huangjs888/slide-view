"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClass = addClass;
exports.cssInject = cssInject;
exports.findTarget = findTarget;
exports.getIconType = getIconType;
exports.getMarginSize = void 0;
exports.removeClass = removeClass;
exports.setStyle = setStyle;
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 13:50:19
 * @Description: ******
 */

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
function cssInject(cssText) {
  var style = document.querySelector("#".concat(styleId));
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
    Object.keys(css).forEach(function (k) {
      if (typeof css[k] === 'undefined') {
        return;
      }
      var key = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      var val = typeof css[k] === 'number' && /^[a-z]/.test(key) && autoPxReg.test("-".concat(key)) ? "".concat(css[k], "px") : String(css[k]);
      ele.style.setProperty(key, val);
    });
  }
  return ele;
}
function findTarget(event, condition) {
  var target = event instanceof MouseEvent ? event.target : event.sourceEvent.target;
  while (condition(target)) {
    target = target.parentNode;
  }
  return target;
}