/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-13 09:34:21
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
  addClass,
  removeClass,
  setStyle,
  styleInject,
} from './util';
import css from './css';

const generate = function generate(
  container: HTMLElement | string,
  className?: string,
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
  const view = addClass(
    document.createElement('div'),
    `hjs-slide-view ${className || ''}`,
  );
  const element = addClass(
    document.createElement('div'),
    'hjs-slideview__middle',
  );
  const leftElement = addClass(
    document.createElement('div'),
    'hjs-slideview__left',
  );
  leftElement.appendChild(
    addClass(document.createElement('div'), 'hjs-slideview__buttons'),
  );
  const rightElement = addClass(
    document.createElement('div'),
    'hjs-slideview__right',
  );
  rightElement.appendChild(
    addClass(document.createElement('div'), 'hjs-slideview__buttons'),
  );
  view.appendChild(leftElement);
  view.appendChild(element);
  view.appendChild(rightElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(view);
  return element;
};

const confirmStyle = function (
  ele: HTMLElement,
  confirm: boolean,
  icon: boolean,
  position: ButtonPosition,
  { text, otext, src, osrc, cls, ocls = '' }: IConfirm,
) {
  if (!icon) {
    (ele.firstChild as HTMLElement).innerText = String(
      !confirm ? otext : text || otext,
    );
    setStyle(ele, {
      justifyContent: confirm
        ? 'center'
        : position === 'left'
        ? 'flex-end'
        : 'flex-start',
    });
  } else {
    osrc &&
      ((ele.firstChild as HTMLImageElement).src = !confirm
        ? osrc
        : src || osrc);
    addClass(
      removeClass(ele, confirm ? ocls : cls || ocls),
      !confirm ? ocls : cls || ocls,
    );
  }
};

const cTransform = function cTransform(
  this: SlideView,
  index: number,
  confirm: boolean,
  rebSize: number = 0,
  duration: number = this.duration,
) {
  const { element, _buttons, _translateX } = this;
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 在下一侦进行动画过渡
  window.requestAnimationFrame(() => {
    // 前面已有按钮的滑动距离
    const transformTotal = {
      left: 0,
      right: 0,
    };
    for (let i = _buttons.length - 1; i >= 0; i--) {
      const {
        element: btnEl,
        width,
        icon,
        position,
        indexPos,
        confirm: confirmInfo,
      } = _buttons[i];
      // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translateX等于0了，所以无需再判断
      const factor =
        _translateX === 0 ? 0 : _translateX / Math.abs(_translateX);
      const multi = indexPos === 'first-last' ? 2 : 1;
      if (i === index) {
        let transformx = 0;
        if (confirm) {
          transformx = multi * _translateX + rebSize * factor;
        } else {
          transformx = (width + transformTotal[position]) * factor;
        }
        setStyle(btnEl, {
          width: confirm ? Math.abs(transformx) : width,
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition:
            duration <= 0 ? '' : `width ${duration}s, transform ${duration}s`,
        });
        // 如果是仅有一个按钮，确认的时候宽度设置2倍变化
        if (multi === 2) {
          setStyle(element, {
            transform: `translate3d(${
              confirm ? multi * _translateX : _translateX
            }px, 0, 0)`,
            transition: duration <= 0 ? '' : `transform ${duration}s`,
          });
        }
        // 如果是icon类型，需要对子元素处理宽度变换
        const btnChild = btnEl.firstChild as HTMLElement;
        if (icon) {
          setStyle(btnChild, {
            width: confirm ? '100%' : width - 20, // 减去20是因为按钮子元素的margin左右最初值是10
            transition: duration <= 0 ? '' : `width ${duration}s`,
          });
        }
        confirmInfo &&
          confirmStyle(btnChild, confirm, icon, position, confirmInfo);
      } else if (i > index) {
        let transformx = 0;
        if (!confirm) {
          transformx = (width + transformTotal[position]) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        setStyle(btnEl, {
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
  const { element, _buttons, _slideRange } = this;
  const [slideMin, slideMax] = _slideRange || [0, 0];
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 在下一侦进行动画过渡
  window.requestAnimationFrame(() => {
    setStyle(element, {
      transform: `translate3d(${moveX}px, 0, 0)`,
      transition: duration <= 0 || status === 2 ? '' : `transform ${duration}s`,
    });
    // 前面已有按钮的占比距离
    const transformTotal = {
      left: 0,
      right: 0,
    };
    for (let i = _buttons.length - 1; i >= 0; i--) {
      const { element: btnEl, width, indexPos, position, icon } = _buttons[i];
      // 当前按钮需要滑出的占比距离
      const transformb =
        (width / Math.abs(position === 'left' ? slideMax : slideMin)) * moveX;
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      const transformx = transformb + transformTotal[position];
      // 左边或右边的最后一个按钮
      const mWidth = Math.max(Math.abs(transformb), width);
      if (indexPos === 'last' || indexPos === 'first-last') {
        if (icon) {
          setStyle(btnEl.firstChild as HTMLElement, {
            [`padding-${position}`]:
              (status === 1 ? Math.abs(moveX) : width) - width,
            transition: duration <= 0 ? '' : `padding-${position} ${duration}s`,
          });
        }
        setStyle(btnEl, {
          width: (status === 1 ? Math.abs(moveX) : mWidth) + (icon ? 0 : 1), // 1px闪动问题
          transform: `translate3d(${
            status === 1 ? moveX : transformx
          }px, 0, 0)`,
          transition:
            duration <= 0 ? '' : `transform ${duration}s, width ${duration}s`,
        });
      } else {
        setStyle(btnEl, {
          width: mWidth + (icon ? 0 : 1), // 1px闪动问题
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition:
            duration <= 0 || status === 2
              ? ''
              : `transform ${duration}s, width ${duration}s`,
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
      if (this.fullSlide) {
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
      if (this.fullSlide) {
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
  if (this.fullSlide && this._slideStatus === 1) {
    const index = this._buttons.findIndex(
      ({ indexPos, position }) =>
        (indexPos === 'last' || indexPos === 'first-last') &&
        ((this._translateX > 0 && position === 'left') ||
          (this._translateX < 0 && position === 'right')),
    );
    buttonSlide.apply(this, [e, index]);
  } else if (
    this._translateX === 0 ||
    // 这个判断是因为手势里默认移动距离在3px以内不算移动
    getDistance(this._startPoint, e.point) < 3 ||
    (this._translateX < 0 &&
      (e.point[0] - this._startPoint[0] >= 0 ||
        this._translateX > -this.throttle)) ||
    (this._translateX > 0 &&
      (e.point[0] - this._startPoint[0] <= 0 ||
        this._translateX < this.throttle))
  ) {
    this.hideButton();
  } else {
    this.showButton(this._translateX > 0 ? 'left' : 'right');
  }
  this._isMoving = false;
  this._startTX = 0;
  this._startPoint = [0, 0];
  this._slideAngle = 0;
  this._slideStatus = 0;
  this._timeStamp = 0;
};

const press = function press(this: SlideView, e: AgentEvent) {
  // 事件只发生于按钮收起隐藏情况
  // 没有使用this._shown判断，是因为该值变化是要动画结束后变化，this._translateX变化是动画执行前
  // 使用this._translateX判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._shown正好相反
  if (this._translateX === 0) {
    this.trigger('press', {
      currentTarget: this.element,
      timeStamp: Date.now(),
      sourceEvent: e,
    });
  }
};

const longPress = function longPress(this: SlideView, e: AgentEvent) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('longPress', {
      currentTarget: this.element,
      timeStamp: Date.now(),
      sourceEvent: e,
    });
  }
};

const doublePress = function doublePress(this: SlideView, e: AgentEvent) {
  // 事件只发生于按钮收起隐藏情况
  if (this._translateX === 0) {
    this.trigger('doublePress', {
      currentTarget: this.element,
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
    const { element, indexPos, icon, confirm, slideOut, data } =
      this._buttons[index];
    // 最后一个按钮单独处理
    if (this.fullSlide && (indexPos === 'last' || indexPos === 'first-last')) {
      buttonSlide.apply(this, [e, index, target]);
      return;
    }
    // 如果是再次确认或者首次无需确认，则直接执行
    let type: SlideViewEventType | null = 'buttonPress';
    // 确认后二次点击
    if (this._confirmIndex === index) {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (slideOut) {
        this.hideButton();
      } else {
        // 取消确认
        cTransform.apply(this, [index, false]);
        this._confirmIndex = -1;
      }
    } else if (this._confirmIndex === -1) {
      // 当前没有确认的情况
      // 首次点击需要确认
      if (confirm) {
        this._confirmIndex = index;
        // 设置回弹效果，第一个按钮和图标按钮不需要
        if (this.rebounce && !icon && indexPos !== 'first') {
          onOnceTransitionEnd(element, () => {
            // 该事件执行时确保当前还处于确认状态，否则不能再执行
            if (this._confirmIndex === index) {
              cTransform.apply(this, [index, true]);
            }
          });
          cTransform.apply(this, [index, true, SlideView.REBOUNCE_SIZE]);
        } else {
          cTransform.apply(this, [index, true]);
        }
        type = 'buttonConfirm';
      }
      // 无需确认的点击（如果slideOut，就点击后隐藏按钮，否则不做任何处理）
      else if (slideOut) {
        this.hideButton();
      }
    } else {
      // 此时其它按钮正处于确认情况，本按钮的点击无效
      type = null;
    }
    if (type) {
      this.trigger(type, {
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
  const { element, confirm, icon, position, slideOut, data } =
    this._buttons[index];
  let type: SlideViewEventType | null = 'buttonPress';
  // 滑满之后二次点击
  if (this._confirmIndex === index) {
    // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
    if (slideOut) {
      this.hideButton();
    } else {
      confirm &&
        confirmStyle(
          element.firstChild as HTMLElement,
          true,
          icon,
          position,
          confirm,
        );
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
      confirmStyle(
        element.firstChild as HTMLElement,
        true,
        icon,
        position,
        confirm,
      );
      this._confirmIndex = index;
      type = 'buttonConfirm';
    } else {
      // 无确认滑满情况
      if (slideOut) {
        this.hideButton();
      } else {
        // 应该不做任何事情，因为这样的按钮一般用于destory，没必要再show
        // this.showButton(this._translateX > 0 ? 'left' : 'right');
      }
    }
  } else {
    // 此时其它按钮正处于确认情况，本按钮的点击无效
    type = null;
  }
  if (type) {
    this.trigger(type, {
      index,
      data,
      currentTarget: target || element,
      timeStamp: Date.now(),
      sourceEvent: event,
    });
  }
};

type IConfirm = {
  otext?: string | number;
  text?: string | number;
  osrc?: string;
  src?: string;
  ocls?: string;
  cls?: string;
};

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
  fullSlide: boolean = false; // 是否启用最后一个按钮覆盖滑动
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
  _buttons:
    | {
        element: HTMLElement; //当前按钮元素
        width: number; // 当前按钮的宽度
        icon: boolean; // 是否是图标类型
        position: ButtonPosition; // 按钮位置
        indexPos: 'first' | 'last' | 'first-last' | 'middle'; // 按钮在菜单中是第一个还是最后一个
        slideOut: boolean; // 按钮点击后是否隐藏按钮
        confirm?: IConfirm; // 是否有再次确认操作
        data?: any; // 按钮携带数据
      }[]
    | null = null; // 按钮集合
  _agents: IAgent[] | null = null;
  constructor(options: SlideViewOptions) {
    super();
    const {
      container,
      className,
      content,
      buttons,
      duration,
      throttle,
      rebounce = true,
      disable = false,
      fullSlide = false,
    } = options;
    this.element = generate(container, className);
    this._agents = [
      agent(this.element, {
        start: start.bind(this),
        move: move.bind(this),
        end: end.bind(this),
        press: press.bind(this),
        longPress: longPress.bind(this),
        doublePress: doublePress.bind(this),
      }),
    ];
    this.setContent(content);
    this.setButtons(buttons);
    this.disable = disable || false;
    this.duration = (duration || 400) / 1000;
    this.throttle = throttle || 40;
    this.rebounce = rebounce;
    this.fullSlide = fullSlide;
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
  setFullSlide(fullSlide: boolean = true) {
    if (this._destory) {
      return;
    }
    this.fullSlide = fullSlide;
  }
  setButtons(buttons?: SlideViewButtonOptions[]) {
    if (this._destory) {
      return;
    }
    const btnPos: ButtonPosition | null =
      this._translateX === 0 ? null : this._translateX > 0 ? 'left' : 'right';
    // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
    this.hideButton().then(() => {
      const leftBtnElement = (this.element.previousSibling &&
        this.element.previousSibling.firstChild) as HTMLElement;
      leftBtnElement.innerHTML = '';
      // 绑定左边按钮事件
      if (this._agents && !this._agents[1]) {
        this._agents[1] = agent(leftBtnElement, {
          press: buttonPress.bind(this),
        });
      }
      const rightBtnElement = (this.element.nextSibling &&
        this.element.nextSibling.firstChild) as HTMLElement;
      rightBtnElement.innerHTML = '';
      // 绑定右边按钮事件
      if (this._agents && !this._agents[2]) {
        this._agents[2] = agent(rightBtnElement, {
          press: buttonPress.bind(this),
        });
      }
      let leftMax = 0;
      let rightMax = 0;
      let firstLeftIndex = -1;
      let firstRightIndex = -1;
      let lastLeftIndex = -1;
      let lastRightIndex = -1;
      this._buttons = (buttons || []).map(
        (
          {
            className,
            icon,
            width,
            height,
            text,
            confirm,
            color,
            background,
            position = 'right',
            slideOut = true,
            data,
          },
          index,
        ) => {
          const btnWrap = addClass(
            document.createElement('div'),
            `hjs-slideview__btn__wrap ${className || ''}`,
          );
          btnWrap.setAttribute('data-index', String(index));
          const btn = setStyle(
            addClass(document.createElement('div'), 'hjs-slideview__btn'),
            {
              color,
              width: width || '100%',
              height: height || '100%',
              margin: `0 ${icon ? 10 : 16}px`,
              justifyContent: icon
                ? 'center'
                : position === 'left'
                ? 'flex-end'
                : 'flex-start',
              background: !icon ? 'transparent' : background,
              borderRadius: icon
                ? !height
                  ? '50%'
                  : (typeof height === 'string'
                      ? parseInt(height, 10)
                      : height) / 2
                : 0,
            },
          );
          const btnConfirm: IConfirm | undefined = !confirm ? undefined : {};
          if (icon) {
            const { src, className: cls, width: w, height: h } = icon;
            if (btnConfirm && confirm) {
              btnConfirm.ocls = cls;
              btnConfirm.cls = confirm.className;
            }
            let btnIcon = null;
            if (src) {
              if (btnConfirm && confirm) {
                btnConfirm.osrc = src;
                btnConfirm.src = confirm.src;
              }
              btnIcon = document.createElement('img');
              btnIcon.src = src;
            } else {
              btnIcon = document.createElement('i');
            }
            btn.appendChild(
              setStyle(addClass(btnIcon, cls || ''), {
                width: w,
                height: h,
              }),
            );
          } else {
            if (btnConfirm && confirm) {
              btnConfirm.otext = text;
              btnConfirm.text = confirm.text;
            }
            const btnText = document.createElement('span');
            btnText.innerText = String(text);
            btn.appendChild(btnText);
          }
          btnWrap.appendChild(btn);
          if (position === 'left') {
            leftBtnElement.appendChild(btnWrap);
          } else {
            rightBtnElement.appendChild(btnWrap);
          }
          const btnWidth = btnWrap.getBoundingClientRect().width;
          setStyle(btnWrap, {
            width: btnWidth,
            background: icon ? 'transparent' : background,
          });
          if (position === 'left') {
            leftMax += btnWidth;
            if (firstLeftIndex === -1) {
              firstLeftIndex = index;
            }
            lastLeftIndex = index;
          } else {
            rightMax += btnWidth;
            if (firstRightIndex === -1) {
              firstRightIndex = index;
            }
            lastRightIndex = index;
          }
          return {
            element: btnWrap,
            width: btnWidth,
            position,
            slideOut,
            icon: !!icon,
            confirm: btnConfirm,
            indexPos: 'middle',
            data,
          };
        },
      );
      if (firstLeftIndex === lastLeftIndex && firstLeftIndex !== -1) {
        this._buttons[firstLeftIndex].indexPos = 'first-last';
      } else {
        if (firstLeftIndex !== -1) {
          this._buttons[firstLeftIndex].indexPos = 'first';
        }
        if (lastLeftIndex !== -1) {
          this._buttons[lastLeftIndex].indexPos = 'last';
        }
      }
      if (firstRightIndex === lastRightIndex && firstRightIndex !== -1) {
        this._buttons[firstRightIndex].indexPos = 'first-last';
      } else {
        if (firstRightIndex !== -1) {
          this._buttons[firstRightIndex].indexPos = 'first';
        }
        if (lastRightIndex !== -1) {
          this._buttons[lastRightIndex].indexPos = 'last';
        }
      }
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
      this.element.innerHTML = content;
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
        this.element.innerHTML = '';
        this.element.appendChild(tempChild);
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
      onOnceTransitionEnd(this.element, () => {
        resolve();
        // 如果当前处于按钮确认状态，隐藏之前需要先取消
        if (this._confirmIndex !== -1) {
          // 此时已经隐藏，this._translateX为0，无需过渡，duration设置为0
          cTransform.apply(this, [this._confirmIndex, false, 0, 0]);
          this._confirmIndex = -1;
        }
        if (this._shown !== 'none') {
          this.trigger('hide', {
            shown: 'none',
            currentTarget: this.element,
            timeStamp: Date.now(),
            sourceEvent: null,
          });
          this._shown = 'none';
        }
      });
    });
  }
  showButton(position: ButtonPosition = 'right') {
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
          onOnceTransitionEnd(this.element, () => {
            resolve();
            if (this._shown !== pos) {
              this.trigger('show', {
                shown: pos,
                currentTarget: this.element,
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
        onOnceTransitionEnd(this.element, () => show());
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

export type SlideViewButtonOptions = {
  className?: string; // 类名控制样式
  icon?: {
    src?: string;
    className?: string; // 类名控制样式（一般使用字体icon时，可以设置这个）
    width?: string | number; // 图标宽度
    height?: string | number; // 图标高度
  };
  width?: string | number; // 背景宽度
  height?: string | number; // 背景高度
  text?: string | number; // 按钮文本
  confirm?: { text?: string | number; src?: string; className?: string }; // 点击时确认内容
  color?: string; // 按钮文字图标颜色
  background?: string; //背景颜色
  position?: ButtonPosition; // 按钮位置
  slideOut?: boolean; // 按钮点击后是否隐藏按钮
  data?: any; //按钮携带数据
};

export type SlideViewOptions = {
  container: HTMLElement | string; // 装载滑动删除的DOM容器
  content?: HTMLElement | string; // 滑动元素的子节点
  buttons?: SlideViewButtonOptions[]; // 按钮配置
  className?: string; // 类名控制样式
  disable?: boolean; // 禁用
  duration?: number; // 动画时间（毫秒级）
  throttle?: number; //按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  rebounce?: boolean; // 滑出时是否有弹性效果
  fullSlide?: boolean; // 最后一个按钮覆盖滑动
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
