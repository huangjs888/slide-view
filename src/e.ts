/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-27 14:53:13
 * @Description: ******
 */

import EventTarget from './event';
import gesture, { type GestureEvent, type IGesture } from './gesture';
import {
  addClass,
  rebounceSize,
  setStyle,
  styleInject,
  onOnceTransitionEnd,
  onOnceTransitionCancel,
} from './util';
import css from './css';

const generate = function generate(
  container: HTMLElement | string,
  handler: (t: SlideViewEventType, e: Event) => void,
  className?: string,
) {
  let tempContainer: HTMLElement | null;
  if (typeof container === 'string') {
    tempContainer = document.querySelector(container);
  } else {
    tempContainer = container;
  }
  if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
    throw new Error('Please pass a container element...');
  }
  styleInject(css);
  const view = document.createElement('div');
  addClass(view, `hjs-slide-view ${className || ''}`);
  const leftElement = document.createElement('div');
  addClass(leftElement, 'hjs-slideview__left');
  const leftBtnElement = document.createElement('div');
  addClass(leftBtnElement, 'hjs-slideview__buttons');
  const element = document.createElement('div');
  addClass(element, 'hjs-slideview__middle');
  const click = (e: Event) => handler('click', e);
  element.addEventListener('click', click);
  const rightElement = document.createElement('div');
  addClass(rightElement, 'hjs-slideview__right');
  const rightBtnElement = document.createElement('div');
  addClass(rightBtnElement, 'hjs-slideview__buttons');
  const btnClick = (e: Event) => handler('button-click', e);
  leftBtnElement.addEventListener('click', btnClick);
  rightBtnElement.addEventListener('click', btnClick);
  leftElement.appendChild(leftBtnElement);
  rightElement.appendChild(rightBtnElement);
  view.appendChild(leftElement);
  view.appendChild(element);
  view.appendChild(rightElement);
  tempContainer.innerHTML = '';
  tempContainer.appendChild(view);
  return {
    element,
    width: element.getBoundingClientRect().width,
    destory: () => {
      element.removeEventListener('click', click);
      leftBtnElement.removeEventListener('click', btnClick);
      rightBtnElement.removeEventListener('click', btnClick);
      if (tempContainer) {
        tempContainer.innerHTML = '';
      }
    },
  };
};
const transform = function transform(
  [slideMin, slideMax]: number[],
  movex: number,
  buttons: ButtonOptions[],
  element: HTMLElement,
  duration?: number,
) {
  setStyle(element, {
    transform: `translate3d(${movex}px, 0, 0)`,
    transition: !duration ? '' : `transform ${duration}s`,
  });
  // 前面已有按钮的占比距离
  let leftTransformTotal = 0;
  let rightTransformTotal = 0;
  for (let i = buttons.length - 1; i >= 0; i--) {
    const { element: btnEl, width, position } = buttons[i];
    // 当前按钮需要滑出的占比距离
    const transformb =
      (width / Math.abs(position === 'left' ? slideMax : slideMin)) * movex;
    // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
    const transformx =
      transformb +
      (position === 'left' ? leftTransformTotal : rightTransformTotal);
    setStyle(btnEl, {
      transform: `translate3d(${transformx}px, 0, 0)`,
      transition: !duration ? '' : `transform ${duration}s`,
    });
    // 累计已滑出按钮的占比距离
    if (position === 'left') {
      leftTransformTotal += transformb;
    } else {
      rightTransformTotal += transformb;
    }
  }
};
const slideSize = 80;
const start = function start(this: SlideView, e: GestureEvent) {
  if (!this.buttons.length || this.disable) {
    return;
  }
  this.isMoving = true;
  this.startV = this.slideVector;
  this.startX = e.point[0];
  this.startY = e.point[1];
  this.slideAngle = 0;
};
const transformK = (
  [slideMin, slideMax]: number[],
  movex: number,
  buttons: ButtonOptions[],
  element: HTMLElement,
  duration?: number,
  last?: boolean,
) => {
  setStyle(element, {
    transform: `translateX(${movex}px)`,
    transition: `transform ${last ? 0 : duration}s`,
  });
  let transformTotal = 0;
  for (let i = buttons.length - 1; i >= 0; i--) {
    const { element: btnEl, width } = buttons[i];
    // 当前按钮需要滑出的占比距离
    const transformb = (width / Math.abs(slideMin)) * movex;
    // 当前按钮滑出距离应该是占比距离+前面所有按钮的占比距离
    const transformx = transformb + transformTotal;
    if (i === buttons.length - 1) {
      setStyle(btnEl, {
        transform: `translateX(${!last ? movex : transformx}px)`,
        transition: `transform ${duration}s`,
      });
    } else {
      setStyle(btnEl, {
        transform: `translateX(${transformx}px)`,
        transition: `transform ${last ? 0 : duration}s`,
      });
    }
    // 累计已滑出按钮的占比距离
    transformTotal += transformb;
  }
};
const move = function move(this: SlideView, e: GestureEvent) {
  if (!this.buttons.length || this.disable || !this.isMoving) {
    return;
  }
  const pagex = e.point[0] - this.startX;
  const pagey = e.point[1] - this.startY;
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (this.slideAngle === 0) {
    this.slideAngle = Math.abs(pagex) - Math.abs(pagey);
  }
  if (this.slideAngle < 0) {
    return;
  }

  setStyle(this.buttons[this.buttons.length - 1].element.firstChild, {
    paddingRight: '1000px',
  });

  // 滑动距离
  let movex = 0;
  const slideDis = this.startV + pagex;
  const [slideMin, slideMax] = this.slideRange;
  if (!this.animating) {
    if (slideDis < slideMin) {
      if (slideMin === 0) {
        // 如果最小等于0，表示只有左边按钮，则可以重置初始值
        this.startX = e.point[0];
        this.startY = e.point[1];
        this.startV = this.slideVector;
        movex = 0;
      } else {
        // 滑动距离小于最小，弹性滑动
        movex =
          (this.rebounce
            ? rebounceSize(slideDis - Math.min(slideMin, this.startV))
            : 0) + Math.min(slideMin, this.startV);
        if (slideDis < -80 + slideMin) {
          this.animating = 1;
        }
      }
    } else if (slideDis < slideMax) {
      // 滑动距离在最大最小之间，逐步滑动
      movex = slideDis;
    } else {
      if (slideMax === 0) {
        // 如果最大等于0，表示只有右边按钮，则可以重置初始值
        this.startX = e.point[0];
        this.startY = e.point[1];
        this.startV = this.slideVector;
        movex = 0;
      } else {
        // 滑动距离大于最大，弹性滑动
        movex =
          (this.rebounce
            ? rebounceSize(slideDis - Math.max(slideMax, this.startV))
            : 0) + Math.max(slideMax, this.startV);
      }
    }
    this.slideVector = movex;
    transform(this.slideRange, movex, this.buttons, this.container.element);
  } else if (this.animating === 1) {
    movex = -400;
    this.slideVector = movex;
    this.animating = 2;
    this.now = Date.now();
    transformK(
      this.slideRange,
      movex,
      this.buttons,
      this.container.element,
      this.duration,
    );
    console.log(11111, this.duration);
  } else if (this.animating === 2) {
    movex = (this.rebounce ? rebounceSize(slideDis + 80 - slideMin) : 0) - 400;
    this.slideVector = movex;
    const duration = this.duration - (Date.now() - this.now) / 1000;
    transformK(
      this.slideRange,
      movex,
      this.buttons,
      this.container.element,
      duration <= 0 ? 0 : duration,
    );
    console.log(22222, duration);
    if (slideDis > -80 + slideMin) {
      this.animating = 3;
    }
  } else if (this.animating === 3) {
    movex = slideDis;
    this.slideVector = movex;
    this.animating = 4;
    this.now = Date.now();
    transformK(
      this.slideRange,
      movex,
      this.buttons,
      this.container.element,
      this.duration / 2,
      true,
    );
    console.log(33333, this.duration);
  }
  // 最后一个按钮按钮动画过程中
  else if (this.animating === 4) {
    movex = slideDis;
    this.slideVector = movex;
    const duration = this.duration / 2 - (Date.now() - this.now) / 1000;
    transformK(
      this.slideRange,
      movex,
      this.buttons,
      this.container.element,
      duration <= 0 ? 0 : duration,
      true,
    );
    console.log(44444, duration);
    if (slideDis >= 0) {
      this.startX = e.point[0];
      this.startY = e.point[1];
      this.startV = this.slideVector;
      this.animating = 0;
    } else if (slideDis < -80 + slideMin) {
      this.animating = 1;
    }
  }
  return false; // 禁止垂直方向的滑动
};
const end = function end(this: SlideView, e: GestureEvent) {
  if (
    !this.buttons.length ||
    this.disable ||
    !this.isMoving ||
    this.slideAngle < 0
  ) {
    return;
  }
  this.isMoving = false;
  this.slideAngle = 0;
  this.animating = 0;
  /* if (this.coverage) {
    const pool = this.events['button-click'] || [];
    const index = this.buttons.length - 1;
    pool.forEach((h) =>
      h({
        type: 'button-click',
        index,
        target: this.buttons[index].element,
        data: this.buttons[index].data,
        sourceEvent: e.sourceEvent,
      }),
    );
    this.showButton();
    return;
  } */
  if (
    this.slideVector === 0 ||
    (this.slideVector < 0 &&
      (e.point[0] - this.startX >= 0 || this.slideVector > -this.throttle)) ||
    (this.slideVector > 0 &&
      (e.point[0] - this.startX <= 0 || this.slideVector < this.throttle))
  ) {
    this.hideButton();
  } else {
    this.showButton(this.slideVector > 0 ? 'left' : 'right');
  }
};

type IElement = {
  element: HTMLElement;
  width: number;
  destory: () => void;
};
type ButtonOptions = {
  element: HTMLElement; //当前按钮元素
  position?: 'left' | 'right'; // 按钮位置
  width: number; // 当前按钮的宽度
  data?: any; // 按钮携带数据
};

class SlideView extends EventTarget<SlideViewEventType, SlideViewEvent> {
  static REBOUNCE_SIZE: number = 12; // 弹性尺寸
  slideAngle: number = 0; // 手指滑出时与水平角度值（非真实角度，只是xy差，反映是否小于45度）
  slideVector: number = 0; // 元素当前滑出向量值
  slideRange: number[] = [0, 0]; // element逐步移动最大范围
  buttons: ButtonOptions[] = []; // 按钮集合
  disable: boolean = false; // 禁止按钮滑出
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  throttle: number = 60; // 按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  rebounce: boolean = true; // 滑出时是否有弹性效果
  slideOut: boolean = false; // 按钮状态，已滑出（展开）
  isMoving: boolean = false; // 是否正在滑动
  startX: number = 0; // 手指放上后初始x值
  startY: number = 0; // 手指放上后初始y值
  startV: number = 0; // 手指放上那一刻，slideVector值
  gesture: IGesture;
  container: IElement;
  constructor(options: SlideViewOptions) {
    super();
    const {
      container,
      className,
      content,
      buttons,
      disable,
      duration,
      throttle,
      rebounce = true,
    } = options;

    this.container = generate(
      container,
      (t: SlideViewEventType, e: Event) => {
        let target = e.currentTarget as HTMLElement;
        let index = 1;
        let event: SlideViewEvent = {
          type: t,
          target,
          sourceEvent: e,
        };
        if (t === 'button-click') {
          target = e.target as HTMLElement;
          while (
            target !== e.currentTarget &&
            !target.getAttribute('data-index')
          ) {
            target = target.parentNode as HTMLElement;
          }
          index = +(target.getAttribute('data-index') || -1);
          event = {
            ...event,
            target,
            index,
            data: this.buttons[index]?.data,
          };
        }
        if (index >= 0) {
          const pool = this.events[t] || [];
          pool.forEach((h) => h(event));
        }
      },
      className,
    );
    this.setContent(content);
    this.setButtons(buttons);
    this.gesture = gesture(this.container.element, {
      start: start.bind(this),
      move: move.bind(this),
      end: end.bind(this),
    });
    this.disable = disable || false;
    this.duration = (duration || 400) / 1000;
    this.throttle = throttle || 40;
    this.rebounce = rebounce;
  }
  setDisable(disable: boolean = true) {
    this.disable = disable;
  }
  setRebounce(rebounce: boolean = true) {
    this.rebounce = rebounce;
  }
  setDuration(duration: number = 0) {
    this.duration = duration / 1000;
  }
  setThrottle(throttle: number = 0) {
    this.throttle = throttle;
  }
  setButtons(buttons?: SlideViewButtonOptions[]) {
    // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
    this.hideButton();
    const leftBtnElement = this.container.element.previousSibling
      ?.firstChild as HTMLElement;
    leftBtnElement.innerHTML = '';
    const rightBtnElement = this.container.element.nextSibling
      ?.firstChild as HTMLElement;
    rightBtnElement.innerHTML = '';
    let leftMax = 0;
    let rightMax = 0;
    this.buttons = (buttons || []).map(
      (
        {
          className,
          icon,
          width,
          height,
          text,
          color,
          background,
          position,
          data,
        },
        index,
      ) => {
        const btnWrap = document.createElement('div');
        addClass(btnWrap, `hjs-slideview__btn__wrap ${className || ''}`);
        btnWrap.setAttribute('data-index', String(index));
        const btn = document.createElement('div');
        addClass(btn, 'hjs-slideview__btn');
        setStyle(btn, {
          color,
          background,
          width: width || '100%',
          height: height || '100%',
          padding: icon ? 0 : '0px 16px 0 16px',
          borderRadius: icon ? '50%' : 0,
        });
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
            addClass(btnImg, cls || '');
            btn.appendChild(btnImg);
          } else {
            const btnI = document.createElement('i');
            setStyle(btnI, { width, height });
            addClass(btnI, cls || '');
            btn.appendChild(btnI);
          }
        } else {
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
        if (position === 'left') {
          leftMax += btnWidth;
        } else {
          rightMax += btnWidth;
        }
        return {
          width: btnWidth,
          element: btnWrap,
          position,
          data,
        };
      },
    );
    this.slideRange = [-rightMax, leftMax];
  }
  setContent(content?: HTMLElement | string) {
    let tempChild;
    if (typeof content === 'string') {
      tempChild = document.querySelector(content);
    } else {
      tempChild = content;
    }
    if (tempChild) {
      this.container.element.innerHTML = '';
      this.container.element.appendChild(tempChild);
    }
  }
  showButton(pos?: 'left' | 'right') {
    if (!this.buttons.length) {
      return;
    }
    /* if (!this.slideOut) {
      onOnceTransitionEnd(this.container.element, (e) => {
        const pool = this.events.show || [];
        pool.forEach((h) =>
          h({
            type: 'show',
            target: this.container.element,
            sourceEvent: e,
          }),
        );
      });
    } */
    const sMax = this.slideRange[pos === 'left' ? 1 : 0];
    const show = (delt: number = 0) => {
      this.slideVector = sMax + delt;
      transform(
        this.slideRange,
        sMax + delt,
        this.buttons,
        this.container.element,
        this.duration,
      );
    };
    // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
    if (this.rebounce && Math.abs(this.slideVector) < Math.abs(sMax)) {
      show(SlideView.REBOUNCE_SIZE * (pos === 'left' ? 1 : -1));
      onOnceTransitionEnd(this.container.element, () => show());
    } else {
      show();
    }
  }
  hideButton() {
    if (!this.buttons.length) {
      return;
    }
    /* if (this.slideVector) {
      onOnceTransitionEnd(this.container.element, (e) => {
        const pool = this.events.hide || [];
        pool.forEach((h) =>
          h({
            type: 'hide',
            target: this.container.element,
            sourceEvent: e,
          }),
        );
      });
    } */
    this.slideVector = 0;
    transform(
      this.slideRange,
      0,
      this.buttons,
      this.container.element,
      this.duration,
    );
  }
  toggleButton() {
    this.slideOut ? this.hideButton() : this.showButton();
  }
  destory() {
    // 解除所有事件
    super.off();
    // 解除手势事件
    this.gesture?.destory();
    // 解除创建者
    this.builder?.destory();
  }
}

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
  color?: string; // 按钮文字图标颜色
  background?: string; //背景颜色
  position?: 'left' | 'right'; // 按钮位置
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
};

export type SlideViewEventType = 'show' | 'hide' | 'click' | 'button-click';

export type SlideViewEvent = {
  type: SlideViewEventType;
  target: HTMLElement;
  sourceEvent: Event;
  index?: number;
  data?: any;
};

export default SlideView;
