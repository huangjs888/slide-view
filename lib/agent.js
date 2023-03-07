"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = agent;
exports.onOnceTransitionEnd = onOnceTransitionEnd;
var _gesture = _interopRequireDefault(require("./gesture"));
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-07 13:43:03
 * @Description: ******
 */

function started(element, event, start) {
  var e = event.sourceEvent;
  // 表示是已经有一个手指放上去了
  if (element.getAttribute('data-touch-identifier')) {
    return;
  }
  var touch = e.touches[0];
  if (!touch) {
    return;
  }
  // 设置主手指
  element.setAttribute('data-touch-identifier', touch.identifier.toString());
  start({
    type: 'touch',
    currentTarget: element,
    point: [touch.pageX, touch.pageY],
    sourceEvent: event
  });
}
function moved(element, event, move) {
  var e = event.sourceEvent;
  var changedTouch = null;
  for (var i = 0; i < e.changedTouches.length; i++) {
    var touch = e.changedTouches.item(i);
    if (touch && touch.identifier.toString() === element.getAttribute('data-touch-identifier')) {
      changedTouch = touch;
      break;
    }
  }
  // 表示移动的手指不是主手指
  if (!changedTouch) {
    return;
  }
  move({
    type: 'touch',
    currentTarget: element,
    point: [changedTouch.pageX, changedTouch.pageY],
    sourceEvent: event
  });
}
function ended(element, event, end) {
  var e = event.sourceEvent;
  var changedTouch = null;
  for (var i = 0; i < e.changedTouches.length; i++) {
    var touch = e.changedTouches.item(i);
    if (touch && touch.identifier.toString() === element.getAttribute('data-touch-identifier')) {
      changedTouch = touch;
      break;
    }
  }
  // 表示抬起的手指不是主手指
  if (!changedTouch) {
    return;
  }
  // 没有手指在上面了
  element.setAttribute('data-touch-identifier', '');
  end({
    type: 'touch',
    currentTarget: element,
    point: [changedTouch.pageX, changedTouch.pageY],
    sourceEvent: event
  });
}
function touched(element, event, touch) {
  touch({
    type: 'touch',
    point: event.point[0],
    currentTarget: element,
    sourceEvent: event
  });
}
function mousedowned(element, event, _ref) {
  var start = _ref.start,
    move = _ref.move,
    end = _ref.end;
  event.preventDefault();
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
  start && start({
    type: 'mouse',
    point: [event.pageX, event.pageY],
    currentTarget: element,
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
    if (dx * dx + dy * dy >= 3 * 3) {
      move && move({
        type: 'mouse',
        point: [e.pageX, e.pageY],
        currentTarget: element,
        sourceEvent: e
      });
    }
  }
  function mouseupped(e) {
    e.stopImmediatePropagation();
    document.removeEventListener('mousemove', mousemoved);
    document.removeEventListener('mouseup', mouseupped);
    if ('onselectstart' in document) {
      document.removeEventListener('dragstart', dragstarted);
      document.removeEventListener('selectstart', dragstarted);
    }
    end && end({
      type: 'mouse',
      point: [e.pageX, e.pageY],
      currentTarget: element,
      sourceEvent: e
    });
  }
}
function moused(element, event, mouse) {
  event.preventDefault();
  mouse({
    type: 'mouse',
    point: [event.pageX, event.pageY],
    currentTarget: element,
    sourceEvent: event
  });
}
function agent(ele, handler) {
  if (!ele || !(ele instanceof HTMLElement)) {
    throw new Error('Binding events require HTMLElement...');
  }
  var destory = function destory() {};
  var start = handler.start,
    move = handler.move,
    end = handler.end,
    press = handler.press,
    longPress = handler.longPress,
    doublePress = handler.doublePress;
  var gesture = new _gesture.default(ele);
  if (gesture.done()) {
    start && gesture.on('touchStart', function (e) {
      return started(ele, e, start);
    });
    move && gesture.on('touchMove', function (e) {
      return moved(ele, e, move);
    });
    end && gesture.on('touchEnd', function (e) {
      return ended(ele, e, end);
    });
    press && gesture.on('tap', function (e) {
      return touched(ele, e, press);
    });
    longPress && gesture.on('longTap', function (e) {
      return touched(ele, e, longPress);
    });
    doublePress && gesture.on('doubleTap', function (e) {
      return touched(ele, e, doublePress);
    });
    destory = function destory() {
      gesture.destory();
    };
  } else {
    var mousedown = null;
    if (start || move || end) {
      mousedown = function mousedown(e) {
        return mousedowned(ele, e, {
          start: start,
          move: move,
          end: end
        });
      };
      ele.addEventListener('mousedown', mousedown);
    }
    var click = null;
    if (press) {
      click = function click(e) {
        return moused(ele, e, press);
      };
      ele.addEventListener('click', click);
    }
    var rightclick = null;
    if (longPress) {
      rightclick = function rightclick(e) {
        return moused(ele, e, longPress);
      };
      ele.addEventListener('contextmenu', rightclick);
    }
    var dblclick = null;
    if (doublePress) {
      dblclick = function dblclick(e) {
        return moused(ele, e, doublePress);
      };
      ele.addEventListener('dblclick', dblclick);
    }
    destory = function destory() {
      mousedown && ele.removeEventListener('mousedown', mousedown);
      click && ele.removeEventListener('click', click);
      dblclick && ele.removeEventListener('dblclick', dblclick);
      rightclick && ele.removeEventListener('contextmenu', rightclick);
    };
  }
  return {
    element: ele,
    destory: destory
  };
}
function onOnceTransitionEnd(ele, transitionEnd) {
  if (!ele) {
    return;
  }
  var transitionEndWrapper = function transitionEndWrapper(e) {
    transitionEnd(e);
    ele.removeEventListener('transitionend', transitionEndWrapper);
  };
  ele.addEventListener('transitionend', transitionEndWrapper);
}