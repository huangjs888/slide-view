"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClass = addClass;
exports.onOnceTransitionEnd = onOnceTransitionEnd;
exports.rebounceSize = rebounceSize;
exports.setStyle = setStyle;
exports.styleInject = styleInject;
exports.touchable = touchable;
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:15:50
 * @Description: ******
 */

function touchable(ele) {
  if (!ele) {
    return false;
  }
  return navigator.maxTouchPoints || 'ontouchstart' in ele;
}
function rebounceSize(value) {
  return Math.pow(Math.abs(value || 1), 0.6) * (value > 0 ? 1 : -1);
}
function addClass(ele, className) {
  if (!ele) {
    return;
  }
  if (typeof className === 'string') {
    className.split(' ').forEach(function (c) {
      return c && ele.classList.add(c);
    });
  }
}
function setStyle(ele, css) {
  if (!ele) {
    return;
  }
  return Object.keys(css).forEach(function (k) {
    if (typeof css[k] === 'undefined') {
      return;
    }
    var key = k.indexOf('-') !== -1 ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
    var val = typeof css[k] === 'number' ? "".concat(css[k], "px") : String(css[k]);
    ele.style.setProperty(key, val);
  });
}
function onOnceTransitionEnd(ele, transitionEnd) {
  if (!ele) {
    return;
  }
  var transitionEndWrapper = function transitionEndWrapper(e) {
    transitionEnd(e);
    ele.removeEventListener('oTransitionEnd', transitionEndWrapper);
    ele.removeEventListener('mozTransitionEnd', transitionEndWrapper);
    ele.removeEventListener('webkitTransitionEnd', transitionEndWrapper);
    ele.removeEventListener('transitionend', transitionEndWrapper);
  };
  ele.addEventListener('oTransitionEnd', transitionEndWrapper);
  ele.addEventListener('mozTransitionEnd', transitionEndWrapper);
  ele.addEventListener('webkitTransitionEnd', transitionEndWrapper);
  ele.addEventListener('transitionend', transitionEndWrapper);
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