"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateEl;
var _util = require("./util");
var _css = _interopRequireDefault(require("./css"));
/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:16:12
 * @Description: ******
 */

function generateEl(container, className) {
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
}