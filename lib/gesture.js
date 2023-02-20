"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Gesture;
var _util = require("./util");
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:13:05
 * @Description: ******
 */

function touchstarted(element, event, handler) {
  event.stopImmediatePropagation();
  // 表示是已经有一个手指放上去了
  if (element.getAttribute('data-touch-identifier')) {
    return;
  }
  var touch = event.touches.item(0);
  if (!touch) {
    return;
  }
  // 设置主手指
  element.setAttribute('data-touch-identifier', touch.identifier.toString());
  handler.start && handler.start({
    type: 'touch',
    point: [touch.pageX, touch.pageY],
    sourceEvent: event
  });
}
function touchmoved(element, event, handler) {
  event.preventDefault();
  event.stopImmediatePropagation();
  var changedTouch = null;
  for (var i = 0; i < event.changedTouches.length; i++) {
    var touch = event.changedTouches.item(i);
    if (touch && touch.identifier === +(element.getAttribute('data-touch-identifier') || -1)) {
      changedTouch = touch;
      break;
    }
  }
  // 表示移动的手指不是主手指
  if (!changedTouch) {
    return;
  }
  handler.move && handler.move({
    type: 'touch',
    point: [changedTouch.pageX, changedTouch.pageY],
    sourceEvent: event
  });
}
function touchended(element, event, handler) {
  event.stopImmediatePropagation();
  var changedTouch = null;
  for (var i = 0; i < event.changedTouches.length; i++) {
    var touch = event.changedTouches.item(i);
    if (touch && touch.identifier === +(element.getAttribute('data-touch-identifier') || -1)) {
      changedTouch = touch;
      break;
    }
  }
  // 表示抬起的手指不是主手指
  if (!changedTouch) {
    return;
  }
  handler.end && handler.end({
    type: 'touch',
    point: [changedTouch.pageX, changedTouch.pageY],
    sourceEvent: event
  });
  // 没有手指在上面了
  element.setAttribute('data-touch-identifier', '');
  if (event.touches.length) {
    // 当主手指抬起来了，但是还有其他手指在上面，就把第二个手指作为主手指
    var _touch = event.touches.item(0);
    if (!_touch) {
      return;
    }
    // 设置主手指
    element.setAttribute('data-touch-identifier', _touch.identifier.toString());
    handler.start && handler.start({
      type: 'touch',
      point: [_touch.pageX, _touch.pageY],
      sourceEvent: event
    });
  }
}
function mousedowned(element, event, handler) {
  event.stopImmediatePropagation();
  document.addEventListener('mousemove', mousemoved);
  document.addEventListener('mouseup', mouseupped);
  if ('onselectstart' in document) {
    document.addEventListener('dragstart', dragstarted, {
      capture: true,
      passive: false
    });
    document.addEventListener('selectstart', dragstarted, {
      capture: true,
      passive: false
    });
  }
  var x0 = event.clientX;
  var y0 = event.clientY;
  handler.start && handler.start({
    type: 'mouse',
    point: [event.pageX, event.pageY],
    sourceEvent: event
  });
  function dragstarted(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function mousemoved(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var dx = e.clientX - x0;
    var dy = e.clientY - y0;
    if (dx * dx + dy * dy < 3) {
      return;
    }
    handler.move && handler.move({
      type: 'mouse',
      point: [e.pageX, e.pageY],
      sourceEvent: e
    });
  }
  function mouseupped(e) {
    e.stopImmediatePropagation();
    document.removeEventListener('mousemove', mousemoved);
    document.removeEventListener('mouseup', mouseupped);
    if ('onselectstart' in document) {
      document.removeEventListener('dragstart', dragstarted);
      document.removeEventListener('selectstart', dragstarted);
    }
    handler.end && handler.end({
      type: 'mouse',
      point: [e.pageX, e.pageY],
      sourceEvent: e
    });
  }
}
function Gesture(ele, handler) {
  if (!ele || !(ele instanceof HTMLElement)) {
    throw new Error('Binding events require HTMLElement...');
  }
  var h = handler || {};
  var ts = function ts(e) {
    return touchstarted(ele, e, h);
  };
  var tm = function tm(e) {
    return touchmoved(ele, e, h);
  };
  var te = function te(e) {
    return touchended(ele, e, h);
  };
  var md = function md(e) {
    return mousedowned(ele, e, h);
  };
  if ((0, _util.touchable)(ele)) {
    ele.addEventListener('touchstart', ts);
    ele.addEventListener('touchmove', tm);
    ele.addEventListener('touchend', te);
    ele.addEventListener('touchcancel', te);
  } else {
    ele.addEventListener('mousedown', md);
  }
  return {
    element: ele,
    handler: h,
    destory: function destory() {
      if ((0, _util.touchable)(ele)) {
        ele.removeEventListener('touchstart', ts);
        ele.removeEventListener('touchmove', tm);
        ele.removeEventListener('touchend', te);
        ele.removeEventListener('touchcancel', te);
      } else {
        ele.removeEventListener('mousedown', md);
      }
    }
  };
}