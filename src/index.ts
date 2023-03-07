/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-07 14:03:23
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
  setStyle,
  styleInject,
} from './util';
import css from './css';

const generate = function generate(
  container: HTMLElement | string,
  className?: string,
) {
  let tempContainer: HTMLElement | null;
  if (typeof container === 'string') {
    tempContainer = document.querySelector(container);
  } else {
    tempContainer = container;
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

const cTransform = function cTransform(
  this: SlideView,
  index: number,
  confirm: boolean,
  rebSize: number = 0,
  duration: number = this.duration,
) {
  const { _buttons, _translateX } = this;
  if (!_buttons || !_buttons.length) {
    return;
  }
  // 前面已有按钮的滑动距离
  let leftTransformTotal = 0;
  let rightTransformTotal = 0;
  for (let i = _buttons.length - 1; i >= 0; i--) {
    const { element: btnEl, width, position, slideOut } = _buttons[i];
    const factor = _translateX === 0 ? 0 : _translateX / Math.abs(_translateX);
    if (i === index) {
      // 当前的按钮将进行变换展示
      const btnChild = btnEl.firstChild as HTMLElement;
      setStyle(btnChild.firstChild as HTMLElement, {
        display: confirm ? 'none' : 'block',
      });
      setStyle(btnChild.lastChild as HTMLElement, {
        display: confirm ? 'block' : 'none',
      });
      const transformx = confirm
        ? _translateX
        : factor *
          (width +
            (position === 'left' ? leftTransformTotal : rightTransformTotal));
      setStyle(btnEl, {
        width: confirm
          ? Math.abs(_translateX + rebSize * factor)
          : duration > 0 && !slideOut
          ? width
          : 'auto',
        transform: `translate3d(${transformx + rebSize * factor}px, 0, 0)`,
        transition:
          duration <= 0 ? '' : `width ${duration}s, transform ${duration}s`,
      });
      if (!confirm && !slideOut && duration > 0) {
        // 因为width直接设置auto，是没有动画过程的
        onOnceTransitionEnd(btnEl, () =>
          setStyle(btnEl, {
            width: 'auto',
          }),
        );
      }
    } else if (i > index) {
      // 注意，这里不分position，因为大于index的都是压在上面的，压在下面的不需要变换
      // 压在上面的收起
      const transformx = confirm
        ? 0
        : factor *
          (width +
            (position === 'left' ? leftTransformTotal : rightTransformTotal));
      setStyle(btnEl, {
        transform: `translate3d(${transformx}px, 0, 0)`,
        transition: duration <= 0 ? '' : `transform ${duration}s`,
      });
    }
    if (position === 'left') {
      leftTransformTotal += width;
    } else {
      rightTransformTotal += width;
    }
  }
};

const transform = function transform(
  this: SlideView,
  moveX: number,
  positive: boolean,
  status: number,
  duration: number = this.duration,
) {
  const { element, _buttons, _slideRange } = this;
  const [slideMin, slideMax] = _slideRange || [0, 0];
  if (!_buttons || !_buttons.length) {
    return;
  }
  setStyle(element, {
    transform: `translate3d(${moveX}px, 0, 0)`,
    transition: duration <= 0 || status === 2 ? '' : `transform ${duration}s`,
  });
  // 前面已有按钮的占比距离
  let leftTransformTotal = 0;
  let rightTransformTotal = 0;
  for (let i = _buttons.length - 1; i >= 0; i--) {
    const { element: btnEl, width, lastOne, position, icon } = _buttons[i];
    const btnChild = btnEl.firstChild as HTMLElement;
    // 当前按钮需要滑出的占比距离
    const transformb =
      (width / Math.abs(position === 'left' ? slideMax : slideMin)) * moveX;
    // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
    const transformx =
      transformb +
      (position === 'left' ? leftTransformTotal : rightTransformTotal);
    // 左边或右边的最后一个按钮
    // (leftTransformTotal === 0 && position === 'left') ||  (rightTransformTotal === 0 && position === 'right')
    if (lastOne) {
      if (!icon) {
        setStyle(btnChild, {
          [`padding-${position}`]:
            (Math.abs(transformb) <= width
              ? 0
              : Math.abs(status === 1 ? moveX : transformx) - width) + 16,
          transition:
            duration <= 0
              ? ''
              : `padding-${position} ${duration}s ease ${
                  duration *
                  (positive ? 1 : -1) *
                  (position === 'right' ? 1 : -1)
                }s`,
        });
      } else {
        setStyle(btnChild, {
          [`padding-${position}`]:
            Math.abs(transformb) > width && status === 1
              ? Math.abs(moveX) - width
              : 0,
          transition: duration <= 0 ? '' : `padding-${position} ${duration}s`,
        });
      }
      setStyle(btnEl, {
        transform: `translate3d(${status === 1 ? moveX : transformx}px, 0, 0)`,
        transition: duration <= 0 ? '' : `transform ${duration}s`,
      });
    } else {
      if (!icon) {
        setStyle(btnChild, {
          [`padding-${position}`]:
            (Math.abs(transformb) <= width ? 0 : Math.abs(transformx) - width) +
            16,
          transition:
            duration <= 0 || status === 2
              ? ''
              : `padding-${position} ${duration}s ease ${
                  duration *
                  (positive ? 1 : -1) *
                  (position === 'right' ? 1 : -1)
                }s`,
        });
      }
      setStyle(btnEl, {
        transform: `translate3d(${transformx}px, 0, 0)`,
        transition:
          duration <= 0 || status === 2 ? '' : `transform ${duration}s`,
      });
    }
    // 累计已滑出按钮的占比距离
    if (position === 'left') {
      leftTransformTotal += transformb;
    } else {
      rightTransformTotal += transformb;
    }
  }
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
        const elWidth = this.element.getBoundingClientRect().width;
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
        const elWidth = this.element.getBoundingClientRect().width;
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
  const positive = moveX > this._translateX;
  this._translateX = moveX;
  transform.apply(this, [moveX, positive, this._slideStatus, duration]);
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
      ({ lastOne, position }) =>
        lastOne &&
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
    const { lastOne, confirm, slideOut, data } = this._buttons[index];
    // 最后一个按钮单独处理
    if (this.fullSlide && lastOne) {
      buttonSlide.apply(this, [e, index, target]);
      return;
    }
    // 如果是再次确认或者首次无需确认，则直接执行
    let type: SlideViewEventType = 'buttonPress';
    if (this._confirmIndex === index || !confirm) {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (slideOut) {
        this.hideButton();
      } else {
        cTransform.apply(this, [index, false]);
        this._confirmIndex = -1;
      }
    } else {
      // 当前事件需要确认，设置回弹效果
      if (this.rebounce) {
        cTransform.apply(this, [index, true, SlideView.REBOUNCE_SIZE]);
        onOnceTransitionEnd(this._buttons[index].element, () => {
          cTransform.apply(this, [index, true]);
        });
      } else {
        cTransform.apply(this, [index, true]);
      }
      this._confirmIndex = index;
      type = 'buttonConfirm';
    }
    this.trigger(type, {
      index,
      data,
      currentTarget: target,
      timeStamp: Date.now(),
      sourceEvent: e,
    });
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
  let type: SlideViewEventType = 'buttonPress';
  const { element, confirm, slideOut, data } = this._buttons[index];
  // 此时是滑满之后的二次点击
  if (this._confirmIndex === index) {
    if (slideOut) {
      this.hideButton();
    } else {
      this.showButton(this._translateX > 0 ? 'left' : 'right');
      this._confirmIndex = -1;
    }
  }
  // 此时是滑动到最满，或者点最后一个按钮，滑满
  else {
    const moveX =
      (this._translateX > 0 ? 1 : -1) *
      this.element.getBoundingClientRect().width;
    const positive = this._translateX < moveX;
    this._translateX = moveX;
    transform.apply(this, [moveX, positive, 1]);
    if (confirm) {
      type = 'buttonConfirm';
      this._confirmIndex = index;
    }
  }
  this.trigger(type, {
    index,
    data,
    currentTarget: target || element,
    timeStamp: Date.now(),
    sourceEvent: event,
  });
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
  _shown: boolean = false; // 按钮状态，已滑出（展开）
  _destory: boolean = false;
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
    | null
    | {
        element: HTMLElement; //当前按钮元素
        width: number; // 当前按钮的宽度
        lastOne: boolean; // 是否是最后一个按钮
        position?: ButtonPosition; // 按钮位置
        slideOut?: boolean; // 按钮点击后是否隐藏按钮
        icon?: boolean; // 是否是图标
        confirm?: boolean; // 是否有再次确认操作
        data?: any; // 按钮携带数据
      }[] = null; // 按钮集合
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
      disable = false,
      rebounce = true,
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
    this._destory = false;
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
      const leftBtnElement = this.element.previousSibling
        ?.firstChild as HTMLElement;
      leftBtnElement.innerHTML = '';
      if (this._agents && !this._agents[1]) {
        this._agents[1] = agent(leftBtnElement, {
          press: buttonPress.bind(this),
        });
      }
      const rightBtnElement = this.element.nextSibling
        ?.firstChild as HTMLElement;
      rightBtnElement.innerHTML = '';
      if (this._agents && !this._agents[2]) {
        this._agents[2] = agent(rightBtnElement, {
          press: buttonPress.bind(this),
        });
      }
      let leftMax = 0;
      let rightMax = 0;
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
            confirmText,
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
              background,
              width: width || '100%',
              height: height || '100%',
              padding: icon ? 0 : '0 16px',
              margin: icon ? '0 10px' : 0,
              borderRadius: icon
                ? !height
                  ? '50%'
                  : (typeof height === 'string'
                      ? parseInt(height, 10)
                      : height) / 2
                : 0,
            },
          );
          if (icon) {
            const { src, className: cls, width: w, height: h } = icon;
            if (src) {
              const btnImg = document.createElement('img');
              btnImg.src = src;
              if (typeof w === 'string') {
                btnImg.width = parseInt(w, 10);
              } else if (typeof w === 'number') {
                btnImg.width = w;
              }
              if (typeof h === 'string') {
                btnImg.height = parseInt(h, 10);
              } else if (typeof h === 'number') {
                btnImg.height = h;
              }
              btn.appendChild(addClass(btnImg, cls || ''));
            } else {
              btn.appendChild(
                setStyle(addClass(document.createElement('i'), cls || ''), {
                  width,
                  height,
                }),
              );
            }
          } else {
            const btnText = document.createElement('span');
            btnText.innerText = String(text);
            btn.appendChild(btnText);
            if (confirmText) {
              const btnCText = document.createElement('span');
              btnCText.innerText = String(confirmText);
              setStyle(btnCText, { display: 'none' });
              btn.appendChild(btnCText);
            }
          }
          btnWrap.appendChild(btn);
          if (position === 'left') {
            leftBtnElement.appendChild(btnWrap);
          } else {
            rightBtnElement.appendChild(btnWrap);
          }
          const btnWidth = btnWrap.getBoundingClientRect().width;
          if (position === 'left') {
            leftMax += btnWidth;
            lastLeftIndex = index;
          } else {
            rightMax += btnWidth;
            lastRightIndex = index;
          }
          return {
            element: btnWrap,
            width: btnWidth,
            position,
            slideOut,
            icon: !!icon,
            confirm: !!confirmText,
            lastOne: false,
            data,
          };
        },
      );
      if (lastLeftIndex !== -1) {
        this._buttons[lastLeftIndex].lastOne = true;
      }
      if (lastRightIndex !== -1) {
        this._buttons[lastRightIndex].lastOne = true;
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
  }
  hideButton() {
    return new Promise<void>((resolve) => {
      if (this._destory || !this._buttons) {
        resolve();
        return;
      }
      if (this._translateX === 0 && this._shown) {
        resolve();
        this.trigger('hide', {
          currentTarget: this.element,
          timeStamp: Date.now(),
          sourceEvent: null,
        });
        this._shown = false;
        return;
      }
      const positive = this._translateX < 0;
      this._translateX = 0;
      transform.apply(this, [0, positive, 0]);
      onOnceTransitionEnd(this.element, () => {
        resolve(); // 如果当前处于按钮确认状态，隐藏之前需要先取消
        if (this._confirmIndex !== -1) {
          cTransform.apply(this, [this._confirmIndex, false]);
          this._confirmIndex = -1;
        }
        if (this._shown) {
          this.trigger('hide', {
            currentTarget: this.element,
            timeStamp: Date.now(),
            sourceEvent: null,
          });
          this._shown = false;
        }
      });
    });
  }
  showButton(position?: ButtonPosition) {
    return new Promise<void>((resolve) => {
      if (this._destory) {
        resolve();
        return;
      }
      const [slideMin, slideMax] = this._slideRange || [0, 0];
      const pos = slideMin === 0 ? 'left' : slideMax === 0 ? 'right' : position;
      const max = pos === 'left' ? slideMax : slideMin;
      if (this._translateX === max && !this._shown) {
        resolve();
        this.trigger('show', {
          currentTarget: this.element,
          timeStamp: Date.now(),
          sourceEvent: null,
        });
        this._shown = true;
        return;
      }
      const show = (rebSize: number = 0) => {
        const factor = pos === 'left' ? 1 : -1;
        const moveX = max + rebSize * factor;
        const positive = moveX > this._translateX;
        this._translateX = moveX;
        transform.apply(this, [moveX, positive, 0]);
        if (!rebSize) {
          onOnceTransitionEnd(this.element, () => {
            resolve();
            if (!this._shown) {
              this.trigger('show', {
                currentTarget: this.element,
                timeStamp: Date.now(),
                sourceEvent: null,
              });
              this._shown = true;
            }
          });
        }
      };
      // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
      if (this.rebounce && Math.abs(this._translateX) < Math.abs(max)) {
        show(SlideView.REBOUNCE_SIZE);
        onOnceTransitionEnd(this.element, () => show());
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
    this._agents?.forEach((a) => a && a.destory());
    this._agents = null;
    this._destory = true;
    this._buttons = null;
    this._slideRange = null;
    this._startPoint = null;
    // 删除元素，用户可以在调用该方法之前加一个删除动画
    const viewEl = this.element.parentNode as HTMLElement;
    viewEl.parentNode?.removeChild(viewEl);
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
  confirmText?: string | number; // 点击时确认文字
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
  index?: number;
  data?: any;
} & IBaseEvent<HTMLElement, AgentEvent | null>;

export default SlideView;
