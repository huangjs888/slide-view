/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-15 17:57:32
 * @Description: ******
 */

import EventTarget, { type IBaseEvent } from './event';
import agent, {
  onOnceTransitionEnd,
  type AgentEvent,
  type IAgent,
} from './agent';
import {
  getDistance,
  rebounceSize,
  getMarginSize,
  getIconType,
  addClass,
  removeClass,
  setStyle,
  styleInject,
} from './util';
import css from './css';

const generate = function generate(
  container: HTMLElement | string,
  className: string,
) {
  let tempContainer: HTMLElement | null;
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
  styleInject(css);
  const viewElement = addClass(
    document.createElement('div'),
    `hjs-slideview${className}`,
  );
  const leftElement = addClass(
    document.createElement('div'),
    'hjs-slideview__left',
  );
  viewElement.appendChild(leftElement);
  const rightElement = addClass(
    document.createElement('div'),
    'hjs-slideview__right',
  );
  viewElement.appendChild(rightElement);
  const contentElement = addClass(
    document.createElement('div'),
    'hjs-slideview__content',
  );
  viewElement.appendChild(contentElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(viewElement);
  return [viewElement, contentElement, leftElement, rightElement];
};

const confirmStyle = function (
  this: SlideView,
  index: MergeButtonOption | number,
  isConfirm: boolean = false,
) {
  let button;
  const { _buttons, buttonStyle } = this;
  if (typeof index === 'number') {
    if (!_buttons || !_buttons.length) {
      return;
    }
    button = _buttons[index];
  } else {
    button = index;
  }
  const {
    element,
    confirm = {}, // isConfirm为true，confirm必然存在
    ...rest
  } = button;
  let { text, icon, color, background, className } = rest;
  if (isConfirm) {
    // 如果icon不存在，则不存在该确认，如果icon存在，则取确认icon，若确认icon不存在，则仍然取icon
    icon = icon && (confirm.icon || icon);
    text = text && (confirm.text || text);
    color = color && (confirm.color || color);
    background = background && (confirm.background || background);
    className = className && (confirm.className || className);
  }
  if (buttonStyle === 'rect') {
    setStyle(element.parentNode as HTMLElement, {
      background: background || 'inherit',
    });
  }
  setStyle(element, {
    color: color || 'inherit',
    background: background || 'inherit',
    boxShadow: `0px 0px 9px -2px ${background || 'inherit'}`,
  });
  addClass(
    removeClass(
      element,
      isConfirm
        ? rest.className || ''
        : confirm.className || rest.className || '',
    ),
    className || '',
  );
  if (icon) {
    const iconEl = element.firstChild as HTMLElement;
    const type = getIconType(icon);
    if (type === 'img') {
      (iconEl as HTMLImageElement).src = icon;
    } else if (type === 'i') {
      iconEl.className = icon;
    } else {
      iconEl.innerHTML = icon;
    }
  }
  if (text) {
    const textEl = element.lastChild as HTMLElement;
    textEl.innerText = text;
  }
};

const cTransform = function cTransform(
  this: SlideView,
  index: number,
  confirm: boolean,
  rebSize: number = 0,
  duration: number = this.duration,
) {
  const { _contentEl, _buttons, _translateX } = this;
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 放入下一帧执行
  window.requestAnimationFrame(() => {
    // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translateX等于0了，所以无需再判断
    const factor = _translateX === 0 ? 0 : _translateX / Math.abs(_translateX);
    // 前面已有按钮的滑动距离
    const transformTotal = {
      left: 0,
      right: 0,
    };
    for (let i = _buttons.length - 1; i >= 0; i--) {
      const { element, width, position, total } = _buttons[i];
      const parentEl = element.parentNode as HTMLElement;
      const multi = total === 1 ? 2 : 1;
      // 如果是仅有一个按钮，确认的时候宽度设置2倍变化
      if (multi === 2) {
        setStyle(_contentEl, {
          transform: `translate3d(${
            confirm ? multi * _translateX : _translateX
          }px, 0, 0)`,
          transition: duration <= 0 ? '' : `transform ${duration}s`,
        });
      }
      if (i === index) {
        let transformx = 0;
        if (confirm) {
          transformx = multi * _translateX + rebSize * factor;
        } else {
          transformx = (width + transformTotal[position]) * factor;
        }
        setStyle(parentEl, {
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition: duration <= 0 ? '' : `transform ${duration}s`,
        });
        setStyle(element, {
          width: confirm
            ? Math.abs(multi * _translateX) - getMarginSize(element)
            : 'auto',
        });
      } else if (i > index) {
        let transformx = 0;
        if (!confirm) {
          transformx = (width + transformTotal[position]) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        setStyle(parentEl, {
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition: duration <= 0 ? '' : `transform ${duration}s`,
        });
      }
      transformTotal[position] += width;
    }
  });
};

const transform = function transform(
  this: SlideView,
  moveX: number,
  status: number,
  duration: number = this.duration,
) {
  const { _contentEl, _buttons, _slideRange } = this;
  const [slideMin, slideMax] = _slideRange || [0, 0];
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(() => {
    setStyle(_contentEl, {
      transform: `translate3d(${moveX}px, 0, 0)`,
      transition: duration <= 0 || status === 2 ? '' : `transform ${duration}s`,
    });
    // 前面已有按钮的占比距离
    const transformTotal = {
      left: 0,
      right: 0,
    };
    for (let i = _buttons.length - 1; i >= 0; i--) {
      const { element, width, index, total, position } = _buttons[i];
      const parentEl = element.parentNode as HTMLElement;
      // 当前按钮需要滑出的占比距离
      const transformb =
        (width / Math.abs(position === 'left' ? slideMax : slideMin)) * moveX;
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      const transformx = transformb + transformTotal[position];
      // 左边或右边的最后一个按钮
      if (index === total - 1) {
        setStyle(parentEl, {
          transform: `translate3d(${
            status === 1 ? moveX : transformx
          }px, 0, 0)`,
          transition: duration <= 0 ? '' : `transform ${duration}s`,
        });

        if (this.buttonStyle === 'round') {
          setStyle(element, {
            width:
              status === 1
                ? this.element.getBoundingClientRect().width -
                  getMarginSize(element)
                : 'auto',
            justifyContent:
              status === 1
                ? `flex-${position === 'left' ? 'end' : 'start'}`
                : 'center',
          });
        }
      } else {
        setStyle(parentEl, {
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition:
            duration <= 0 || status === 2 ? '' : `transform ${duration}s`,
        });
      }
      // 累计已滑出按钮的占比距离
      transformTotal[position] += transformb;
    }
  });
};

const start = function start(this: SlideView, e: AgentEvent) {
  if (!this._buttons || this.disable) {
    return;
  }
  this._isMoving = true;
  this._startTX = this._translateX;
  this._startPoint = e.point;
  this._slideAngle = 0;
  this._slideStatus = 0;
  this._timeStamp = 0;
};

const move = function move(this: SlideView, e: AgentEvent) {
  if (!this._buttons || this.disable || !this._isMoving || !this._startPoint) {
    return;
  }
  const pageX = e.point[0] - this._startPoint[0];
  const pageY = e.point[1] - this._startPoint[1];
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (this._slideAngle === 0) {
    this._slideAngle = Math.abs(pageX) - Math.abs(pageY);
  }
  if (this._slideAngle < 0) {
    return;
  }
  // 滑动距离
  let moveX = 0;
  let duration = 0;
  const slideX = this._startTX + pageX;
  const [slideMin, slideMax] = this._slideRange || [0, 0];
  const elWidth = this.element.getBoundingClientRect().width;
  if (slideX <= slideMin) {
    if (slideMin === 0) {
      // 如果最小等于0，表示只有左边按钮，则可以重置初始值
      this._startPoint = e.point;
      this._startTX = this._translateX;
      this._slideAngle = 0;
      this._slideStatus = 0;
      this._timeStamp = 0;
      moveX = 0;
    } else {
      if (this.buttonFull.right) {
        const threshold = -Math.max(elWidth * 0.75, Math.abs(slideMin));
        const timeStamp =
          e.sourceEvent instanceof MouseEvent
            ? e.sourceEvent.timeStamp
            : e.sourceEvent.sourceEvent.timeStamp;
        if (slideX <= threshold) {
          if (this._slideStatus !== 1) {
            this._timeStamp = timeStamp;
            this._slideStatus = 1;
          }
          moveX =
            (this.rebounce ? rebounceSize(slideX - threshold) : 0) -
            elWidth * 0.95;
          duration = Math.max(
            0,
            this.duration - (timeStamp - this._timeStamp) / 1000,
          );
        } else {
          if (this._slideStatus === 0) {
            // 从[slideMin,0]进入[threshold,slideMin]之间
            this._timeStamp = 0;
          } else if (this._slideStatus === 1) {
            // 从[-Infinity,threshold]进入[threshold,slideMin]之间
            this._timeStamp = timeStamp;
            this._slideStatus = 2;
          }
          moveX = slideX;
          duration = Math.max(
            0,
            this.duration / 2 - (timeStamp - this._timeStamp) / 1000,
          );
        }
      } else {
        moveX =
          (this.rebounce
            ? rebounceSize(slideX - Math.min(slideMin, this._startTX))
            : 0) + Math.min(slideMin, this._startTX);
      }
    }
  } else if (slideX < slideMax) {
    // 滑动距离在最大最小之间，逐步滑动
    moveX = slideX;
    this._slideStatus = 0;
    this._timeStamp = 0;
  } else {
    if (slideMax === 0) {
      // 如果最大等于0，表示只有右边按钮，则可以重置初始值
      this._startPoint = e.point;
      this._startTX = this._translateX;
      this._slideAngle = 0;
      this._slideStatus = 0;
      this._timeStamp = 0;
      moveX = 0;
    } else {
      if (this.buttonFull.left) {
        const threshold = Math.max(elWidth * 0.75, Math.abs(slideMax));
        const timeStamp =
          e.sourceEvent instanceof MouseEvent
            ? e.sourceEvent.timeStamp
            : e.sourceEvent.sourceEvent.timeStamp;
        if (slideX >= threshold) {
          if (this._slideStatus !== 1) {
            this._timeStamp = timeStamp;
            this._slideStatus = 1;
          }
          moveX =
            (this.rebounce ? rebounceSize(slideX - threshold) : 0) +
            elWidth * 0.95;
          duration = Math.max(
            0,
            this.duration - (timeStamp - this._timeStamp) / 1000,
          );
        } else {
          if (this._slideStatus === 0) {
            // 从[0,slideMax]进入[slideMax,threshold]之间
            this._timeStamp = 0;
          } else if (this._slideStatus === 1) {
            // 从[threshold,+Infinity]进入[slideMax,threshold]之间
            this._timeStamp = timeStamp;
            this._slideStatus = 2;
          }
          moveX = slideX;
          duration = Math.max(
            0,
            this.duration / 2 - (timeStamp - this._timeStamp) / 1000,
          );
        }
      } else {
        moveX =
          (this.rebounce
            ? rebounceSize(slideX - Math.max(slideMax, this._startTX))
            : 0) + Math.max(slideMax, this._startTX);
      }
    }
  }
  if (this._confirmIndex !== -1) {
    // 如果当前处于按钮确认状态，滑动之前需要先取消
    cTransform.apply(this, [this._confirmIndex, false, 0, 0]);
    confirmStyle.apply(this, [this._confirmIndex]);
    this._confirmIndex = -1;
  }
  moveX = (moveX > 0 ? 1 : -1) * Math.min(elWidth, Math.abs(moveX));
  this._translateX = moveX;
  transform.apply(this, [moveX, this._slideStatus, duration]);
  return false; // 禁止垂直方向的滑动
};

const end = function end(this: SlideView, e: AgentEvent) {
  if (
    !this._buttons ||
    this.disable ||
    !this._isMoving ||
    this._slideAngle < 0 ||
    !this._startPoint
  ) {
    return;
  }
  const {
    buttonFull,
    throttle,
    _buttons,
    _translateX,
    _slideStatus,
    _startPoint,
  } = this;
  this._isMoving = false;
  this._startTX = 0;
  this._startPoint = [0, 0];
  this._slideAngle = 0;
  this._slideStatus = 0;
  this._timeStamp = 0;
  if (_slideStatus === 1) {
    const index = _buttons.findIndex(
      ({ index: btnIndex, total, position }) =>
        btnIndex === total - 1 &&
        ((_translateX < 0 && position === 'right') ||
          (_translateX > 0 && position === 'left')),
    );
    if (buttonFull[_buttons[index].position]) {
      buttonSlide.apply(this, [e, index]);
      return;
    }
  }
  if (
    _translateX === 0 ||
    // 这个判断是因为手势里默认移动距离在3px以内不算移动
    getDistance(_startPoint, e.point) < 3 ||
    (_translateX < 0 &&
      (e.point[0] - _startPoint[0] >= 0 || _translateX > -throttle)) ||
    (_translateX > 0 &&
      (e.point[0] - _startPoint[0] <= 0 || _translateX < throttle))
  ) {
    this.hideButton();
  } else {
    this.showButton(_translateX > 0 ? 'left' : 'right');
  }
};

const press = function press(this: SlideView, e: AgentEvent) {
  // 事件只发生于按钮收起隐藏情况
  // 没有使用this._shown判断，是因为该值变化是要动画结束后变化，this._translateX变化是动画执行前
  // 使用this._translateX判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._shown正好相反
  if (this._translateX === 0) {
    this.trigger('press', {
      currentTarget: this._contentEl,
      timeStamp: Date.now(),
      sourceEvent: e,
    });
  }
};

const longPress = function longPress(this: SlideView, e: AgentEvent) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('longPress', {
      currentTarget: this._contentEl,
      timeStamp: Date.now(),
      sourceEvent: e,
    });
  }
};

const doublePress = function doublePress(this: SlideView, e: AgentEvent) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('doublePress', {
      currentTarget: this._contentEl,
      timeStamp: Date.now(),
      sourceEvent: e,
    });
  }
};

const buttonPress = function buttonPress(this: SlideView, e: AgentEvent) {
  // 表示按钮处于收起隐藏状态
  if (this._translateX === 0 || !this._buttons) {
    return;
  }
  const { sourceEvent, currentTarget } = e;
  let target = (
    sourceEvent instanceof MouseEvent
      ? sourceEvent.target
      : sourceEvent.sourceEvent.target
  ) as HTMLElement;
  while (target !== currentTarget && !target.getAttribute('data-index')) {
    target = target.parentNode as HTMLElement;
  }
  const index = +(target.getAttribute('data-index') || -1);
  if (index >= 0 && this._buttons[index]) {
    const {
      element,
      confirm,
      index: btnIndex,
      total,
      position,
      collapse,
      data,
    } = this._buttons[index];
    // 最后一个按钮单独处理
    if (btnIndex === total - 1 && this.buttonFull[position]) {
      buttonSlide.apply(this, [e, index, target]);
      return;
    }
    // 如果是再次确认或者首次无需确认，则直接执行
    let eventType: SlideViewEventType | null = 'buttonPress';
    // 确认后二次点击
    if (this._confirmIndex === index) {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (collapse) {
        this.hideButton();
      } else {
        // 取消确认
        cTransform.apply(this, [index, false]);
        confirmStyle.apply(this, [index]);
        this._confirmIndex = -1;
      }
    } else if (this._confirmIndex === -1) {
      // 当前没有确认的情况
      // 首次点击需要确认
      if (confirm) {
        this._confirmIndex = index;
        confirmStyle.apply(this, [index, true]);
        // 设置回弹效果，第一个按钮和圆型按钮不需要
        if (this.rebounce && this.buttonStyle === 'rect' && btnIndex !== 0) {
          onOnceTransitionEnd(element.parentNode as HTMLElement, () => {
            // 该事件执行时确保当前还处于确认状态，否则不能再执行
            if (this._confirmIndex === index) {
              cTransform.apply(this, [index, true]);
            }
          });
          cTransform.apply(this, [index, true, SlideView.REBOUNCE_SIZE]);
        } else {
          cTransform.apply(this, [index, true]);
        }
        eventType = 'buttonConfirm';
      }
      // 无需确认的点击（如果collapse，就点击后隐藏按钮，否则不做任何处理）
      else if (collapse) {
        this.hideButton();
      }
    } else {
      // 此时其它按钮正处于确认情况，本按钮的点击无效
      eventType = null;
    }
    if (eventType) {
      this.trigger(eventType, {
        index,
        data,
        currentTarget: target,
        timeStamp: Date.now(),
        sourceEvent: e,
      });
    }
  }
};

const buttonSlide = function buttonSlide(
  this: SlideView,
  event: AgentEvent,
  index: number,
  target?: HTMLElement,
) {
  // 表示按钮处于收起隐藏状态
  if (this._translateX === 0 || !this._buttons || !this._buttons[index]) {
    return;
  }
  const { element, confirm, collapse, data } = this._buttons[index];
  let eventType: SlideViewEventType | null = 'buttonPress';
  // 滑满之后二次点击
  if (this._confirmIndex === index) {
    // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
    if (collapse) {
      this.hideButton();
    } else {
      confirmStyle.apply(this, [index]);
      this._confirmIndex = -1;
      // 应该不做任何事情，因为这样的按钮一般用于destory，没必要再show
      // this.showButton(this._translateX > 0 ? 'left' : 'right');
    }
  } else if (this._confirmIndex === -1) {
    // 无论是否确认都需要滑满
    const moveX =
      (this._translateX > 0 ? 1 : -1) *
      this.element.getBoundingClientRect().width;
    this._translateX = moveX;
    transform.apply(this, [moveX, 1]);
    // 需要确认，触发确认事件
    if (confirm) {
      this._confirmIndex = index;
      confirmStyle.apply(this, [index, true]);
      eventType = 'buttonConfirm';
    } else {
      // 无确认滑满情况
      if (collapse) {
        this.hideButton();
      } else {
        // 应该不做任何事情，因为这样的按钮一般用于destory，没必要再show
        // this.showButton(this._translateX > 0 ? 'left' : 'right');
      }
    }
  } else {
    // 此时其它按钮正处于确认情况，本按钮的点击无效
    eventType = null;
  }
  if (eventType) {
    this.trigger(eventType, {
      index,
      data,
      currentTarget: target || element,
      timeStamp: Date.now(),
      sourceEvent: event,
    });
  }
};

type MergeButtonOption = {
  element: HTMLElement; //当前按钮元素
  width: number; // 当前按钮的宽度
  index: number; // 按钮在当前位置菜单的索引
  total: number; //按钮当前位置菜单个数
  position: ButtonPosition;
} & SlideViewButtonOption;

class SlideView extends EventTarget<
  HTMLElement,
  AgentEvent | null,
  SlideViewEventType,
  SlideViewEvent
> {
  static REBOUNCE_SIZE: number = 12; // 弹性尺寸
  element: HTMLElement; // 触发滑动的元素
  disable: boolean = false; // 禁止按钮滑出
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  throttle: number = 60; // 按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  rebounce: boolean = true; // 滑出时是否有弹性效果
  buttonStyle: { left: ButtonStyle; right: ButtonStyle } = {
    left: 'rect',
    right: 'rect',
  }; // 按钮的风格
  buttonFull: { left: boolean; right: boolean } = {
    left: false,
    right: false,
  }; // 是否启用最后一个按钮覆盖滑动
  _shown: ButtonPosition | 'none' = 'none'; // 按钮状态，展示的是哪一个按钮
  _destory: boolean = false; //是否销毁
  _confirmIndex: number = -1; // 当前正在确认的按钮
  _translateX: number = 0; // 元素当前位移值
  _slideAngle: number = 0; // 手指滑出时与水平角度值（非真实角度，只是xy差，反映是否小于45度）
  _slideStatus: number = 0; // 滑动状态
  _slideRange: number[] | null = null; // element逐步移动最大范围
  _startPoint: number[] | null = null; // 手指放上后初始点
  _startTX: number = 0; // 手指放上那一刻，translateX值
  _timeStamp: number = 0; // 移动时的时间戳
  _isMoving: boolean = false; // 是否正在滑动
  _buttons: MergeButtonOption[] | null = null; // 按钮集合
  _agents: IAgent[] | null = null;
  constructor(options: SlideViewOption) {
    super();
    const {
      container,
      className,
      content,
      buttons,
      duration,
      throttle,
      rebounce,
      disable,
      buttonStyle,
      buttonFull,
    } = options;
    const elements = generate(
      container,
      ` hjs-slideview__${buttonStyle} ${className || ''}`,
    );
    this._agents = elements.map((el, i) => {
      return agent(el, {
        start: i === 1 ? start.bind(this) : null,
        move: i === 1 ? move.bind(this) : null,
        end: i === 1 ? end.bind(this) : null,
        press:
          i === 1 ? press.bind(this) : i === 0 ? null : buttonPress.bind(this),
        longPress: i === 1 ? longPress.bind(this) : null,
        doublePress: i === 1 ? doublePress.bind(this) : null,
      });
    });
    this.element = elements[0];
    this._contentEl = elements[1];
    this.setContent(content);
    this.setButtons(buttons);
    this.setDisable(disable || false);
    this.setDuration(duration || 400);
    this.setThrottle(throttle || 40);
    this.setRebounce(rebounce);
    this.setButtonFull(buttonFull || false);
    this.setButtonStyle(buttonStyle);
  }
  setDisable(disable: boolean = true) {
    if (this._destory) {
      return;
    }
    this.disable = disable;
  }
  setRebounce(rebounce: boolean = true) {
    if (this._destory) {
      return;
    }
    this.rebounce = rebounce;
  }
  setDuration(duration: number = 0) {
    if (this._destory) {
      return;
    }
    this.duration = duration / 1000;
  }
  setThrottle(throttle: number = 0) {
    if (this._destory) {
      return;
    }
    this.throttle = throttle;
  }
  setButtonFull(buttonFull: boolean | { left?: boolean; right?: boolean }) {
    if (typeof buttonFull === 'boolean') {
      this.buttonFull = {
        left: buttonFull,
        right: buttonFull,
      };
    } else {
      this.buttonFull = {
        left: buttonFull.left || false,
        right: buttonFull.right || false,
      };
    }
  }
  setButtonStyle(buttonStyle: ButtonStyle, position: ButtonPosition) {
    if (this._destory) {
      return;
    }
    this.buttonStyle = buttonStyle;
  }
  setButtons(buttons?: SlideViewButtonOption[]) {
    if (this._destory) {
      return;
    }
    const btnPos: ButtonPosition | null =
      this._translateX === 0 ? null : this._translateX > 0 ? 'left' : 'right';
    // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
    this.hideButton().then(() => {
      const leftBtnElement = this.element.children[0];
      leftBtnElement.innerHTML = '';
      const rightBtnElement = this.element.children[1];
      rightBtnElement.innerHTML = '';
      let leftIndex = -1;
      let rightIndex = -1;
      let leftMax = 0;
      let rightMax = 0;
      this._buttons = (buttons || [])
        .map((button, index) => {
          const { text, icon, position = 'right', collapse = true } = button;
          const btnWrap = addClass(
            document.createElement('div'),
            'hjs-slideview__btn__wrap',
          );
          const btnEl = addClass(
            document.createElement('div'),
            'hjs-slideview__btn',
          );
          btnEl.setAttribute('data-index', String(index));
          if (icon) {
            btnEl.appendChild(
              addClass(
                document.createElement(getIconType(icon)),
                'hjs-slideview__icon',
              ),
            );
          }
          if (text) {
            btnEl.appendChild(
              addClass(document.createElement('span'), 'hjs-slideview__text'),
            );
          }
          btnWrap.appendChild(btnEl);
          let btnIndex = -1;
          if (position === 'left') {
            btnIndex = leftIndex += 1;
            leftBtnElement.appendChild(btnWrap);
          } else {
            btnIndex = rightIndex += 1;
            rightBtnElement.appendChild(btnWrap);
          }
          const mergeButton = {
            ...button,
            position,
            collapse,
            element: btnEl,
            index: btnIndex,
            width: 0,
            total: 0,
          };
          confirmStyle.apply(this, [mergeButton]);
          return mergeButton;
        })
        .map(({ element, position, ...rest }) => {
          let total = 0;
          const width =
            element.getBoundingClientRect().width + getMarginSize(element);
          if (position === 'left') {
            total = leftIndex + 1;
            leftMax += width;
          } else {
            total = rightIndex + 1;
            rightMax += width;
          }
          return {
            ...rest,
            width,
            total,
            element,
            position,
          };
        });
      this._slideRange = [-rightMax, leftMax];
      if (btnPos) {
        this.showButton(btnPos);
      }
    });
  }
  setContent(content?: HTMLElement | string) {
    if (this._destory) {
      return;
    }
    if (typeof content === 'string' && !content.match(/^[#|.].+/)) {
      this._contentEl.innerHTML = content;
      return;
    }
    try {
      let tempChild;
      if (typeof content === 'string') {
        tempChild = document.querySelector(content);
      } else {
        tempChild = content;
      }
      if (tempChild) {
        this._contentEl.innerHTML = '';
        this._contentEl.appendChild(tempChild);
      }
    } catch (e) {}
  }
  hideButton() {
    return new Promise<void>((resolve) => {
      if (this._destory || this._translateX === 0 || !this._buttons) {
        resolve();
        return;
      }
      this._translateX = 0;
      transform.apply(this, [0, 0]);
      // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
      onOnceTransitionEnd(this._contentEl, () => {
        resolve();
        // 如果当前处于按钮确认状态，隐藏之前需要先取消
        if (this._confirmIndex !== -1) {
          // 此时已经隐藏，this._translateX为0，无需过渡，duration设置为0
          cTransform.apply(this, [this._confirmIndex, false, 0, 0]);
          confirmStyle.apply(this, [this._confirmIndex]);
          this._confirmIndex = -1;
        }
        if (this._shown !== 'none') {
          this.trigger('hide', {
            shown: 'none',
            currentTarget: this._contentEl,
            timeStamp: Date.now(),
            sourceEvent: null,
          });
          this._shown = 'none';
        }
      });
    });
  }
  showButton(position: Buttonposition) {
    return new Promise<void>((resolve) => {
      if (this._destory || !this._buttons) {
        resolve();
        return;
      }
      const [slideMin, slideMax] = this._slideRange || [0, 0];
      const pos = slideMin === 0 ? 'left' : slideMax === 0 ? 'right' : position;
      const max = pos === 'left' ? slideMax : slideMin;
      if (this._translateX === max) {
        resolve();
        return;
      }
      const show = (rebSize: number = 0) => {
        const factor = pos === 'left' ? 1 : -1;
        const moveX = max + rebSize * factor;
        this._translateX = moveX;
        transform.apply(this, [moveX, 0]);
        if (!rebSize) {
          onOnceTransitionEnd(this._contentEl, () => {
            resolve();
            if (this._shown !== pos) {
              this.trigger('show', {
                shown: pos,
                currentTarget: this._contentEl,
                timeStamp: Date.now(),
                sourceEvent: null,
              });
              this._shown = pos;
            }
          });
        }
      };
      // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
      if (
        this.rebounce &&
        ((max > 0 && this._translateX < max) ||
          (max < 0 && this._translateX > max))
      ) {
        onOnceTransitionEnd(this._contentEl, () => show());
        show(SlideView.REBOUNCE_SIZE);
      } else {
        show();
      }
    });
  }
  toggleButton(position?: ButtonPosition) {
    if (this._destory) {
      return;
    }
    return this._translateX === 0
      ? this.showButton(position)
      : this.hideButton();
  }
  destory() {
    // 解除所有事件
    super.off();
    // 销毁底层事件
    if (this._agents) {
      this._agents.forEach((a) => a && a.destory());
      this._agents = null;
    }
    this._destory = true;
    this._buttons = null;
    this._slideRange = null;
    this._startPoint = null;
    // 删除元素，用户可以在调用该方法之前加一个删除动画
    const viewEl = this.element.parentNode as HTMLElement;
    if (viewEl.parentNode) {
      viewEl.parentNode.removeChild(viewEl);
    }
  }
}

export type ButtonPosition = 'left' | 'right';
export type ButtonStyle = 'round' | 'rect';
export type ButtonType = 'text' | 'icon' | 'image';

export type SlideViewButtonOption = {
  confirm?: {
    text?: string; // 按钮文字
    icon?: string; // 按钮图标
    color?: string; // 按钮文字图标颜色
    background?: string; //按钮背景颜色
    className?: string; // 按钮自定义样式
  }; // 按钮确认时的信息
  text?: string; // 按钮文字
  icon?: string; // 按钮图标
  color?: string; // 按钮文字图标颜色
  background?: string; //按钮背景颜色
  className?: string; // 按钮自定义样式
  position?: ButtonPosition; // 按钮位置
  collapse?: boolean; // 按钮点击后是否收起
  data?: any; //按钮携带数据
};

export type SlideViewOption = {
  container: HTMLElement | string; // 装载滑动删除的DOM容器
  content?: HTMLElement | string; // 滑动元素的子节点
  className?: string; // 类名控制样式
  buttons?: SlideViewButtonOption[]; // 按钮配置
  disable?: boolean; // 禁用按钮
  duration?: number; // 动画时间（毫秒级）
  throttle?: number; //按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  rebounce?: boolean; // 按钮滑出时是否有弹性效果
  buttonStyle?: ButtonStyle | { left?: ButtonStyle; right?: ButtonStyle }; // 按钮风格
  buttonFull?: boolean | { left?: boolean; right?: boolean }; // 最后一个按钮覆盖滑动
};

export type SlideViewEventType =
  | 'show'
  | 'hide'
  | 'press'
  | 'longPress'
  | 'doublePress'
  | 'buttonPress'
  | 'buttonConfirm';

export type SlideViewEvent = {
  shown?: ButtonPosition | 'none'; // 展示哪边的按钮
  index?: number; // 点击按钮在按钮集合里的索引
  data?: any; // 按钮携带的数据
} & IBaseEvent<HTMLElement, AgentEvent | null>;

export default SlideView;
