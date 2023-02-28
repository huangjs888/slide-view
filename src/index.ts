/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-28 14:16:55
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
  moveX: number,
  positive: boolean,
  status: number,
  duration: number,
  element: HTMLElement,
  buttons: ButtonOptions[],
  [slideMin, slideMax]: number[],
) {
  setStyle(element, {
    transform: `translate3d(${moveX}px, 0, 0)`,
    transition: duration <= 0 || status === 2 ? '' : `transform ${duration}s`,
  });
  // 前面已有按钮的占比距离
  let leftTransformTotal = 0;
  let rightTransformTotal = 0;
  for (let i = buttons.length - 1; i >= 0; i--) {
    const { element: btnEl, width, position = 'right', icon } = buttons[i];
    const btnChild = btnEl.firstChild as HTMLElement;
    // 当前按钮需要滑出的占比距离
    const transformb =
      (width / Math.abs(position === 'left' ? slideMax : slideMin)) * moveX;
    // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
    const transformx =
      transformb +
      (position === 'left' ? leftTransformTotal : rightTransformTotal);

    // 左边或右边的最后一个按钮
    if (
      (leftTransformTotal === 0 && position === 'left') ||
      (rightTransformTotal === 0 && position === 'right')
    ) {
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
const start = function start(this: SlideView, e: GestureEvent) {
  if (!this.buttons.length || this.disable) {
    return;
  }
  this.isMoving = true;
  this.startTX = this.translateX;
  this.startX = e.point[0];
  this.startY = e.point[1];
  this.slideAngle = 0;
};
const move = function move(this: SlideView, e: GestureEvent) {
  if (!this.buttons.length || this.disable || !this.isMoving) {
    return;
  }
  const pageX = e.point[0] - this.startX;
  const pageY = e.point[1] - this.startY;
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (this.slideAngle === 0) {
    this.slideAngle = Math.abs(pageX) - Math.abs(pageY);
  }
  if (this.slideAngle < 0) {
    return;
  }

  // 滑动距离
  let moveX = 0;
  let duration = 0;
  let status = 0;
  const slideX = this.startTX + pageX;
  const [slideMin, slideMax] = this.slideRange;
  if (!this.animating) {
    if (slideX < slideMin) {
      if (slideMin === 0) {
        // 如果最小等于0，表示只有左边按钮，则可以重置初始值
        this.startX = e.point[0];
        this.startY = e.point[1];
        this.startTX = this.translateX;
        moveX = 0;
      } else {
        // 滑动距离小于最小，弹性滑动
        moveX =
          (this.rebounce
            ? rebounceSize(slideX - Math.min(slideMin, this.startTX))
            : 0) + Math.min(slideMin, this.startTX);
        if (slideX <= -80 + slideMin) {
          this.animating = 1;
          this.now = 0;
        }
      }
    } else if (slideX <= slideMax) {
      // 滑动距离在最大最小之间，逐步滑动
      moveX = slideX;
    } else {
      if (slideMax === 0) {
        // 如果最大等于0，表示只有右边按钮，则可以重置初始值
        this.startX = e.point[0];
        this.startY = e.point[1];
        this.startTX = this.translateX;
        moveX = 0;
      } else {
        // 滑动距离大于最大，弹性滑动
        moveX =
          (this.rebounce
            ? rebounceSize(slideX - Math.max(slideMax, this.startTX))
            : 0) + Math.max(slideMax, this.startTX);
        if (slideX >= 80 + slideMax) {
          this.animating = 1;
          this.now = 0;
        }
      }
    }
  } else if (this.animating === 1) {
    if (slideX < slideMin) {
      moveX = (this.rebounce ? rebounceSize(slideX + 80 - slideMin) : 0) - 400;
    } else {
      moveX = (this.rebounce ? rebounceSize(slideX - 80 + slideMax) : 0) + 400;
    }
    if (!this.now) {
      this.now = Date.now();
    }
    duration = Math.max(0, this.duration - (Date.now() - this.now) / 1000);
    status = 1;
    if (
      (slideX < slideMin && slideX > -80 + slideMin) ||
      (slideX > slideMax && slideX < 80 + slideMax)
    ) {
      this.animating = 2;
      this.now = 0;
    }
  } else if (this.animating === 2) {
    moveX = slideX;
    if (!this.now) {
      this.now = Date.now();
    }
    duration = Math.max(0, this.duration / 2 - (Date.now() - this.now) / 1000);
    status = 2;
    if (slideX <= -80 + slideMin || slideX >= 80 + slideMax) {
      this.animating = 1;
      this.now = 0;
    } else if (slideX >= 0 || slideX <= 0) {
      this.startX = e.point[0];
      this.startY = e.point[1];
      this.startTX = this.translateX;
      this.animating = 0;
    }
  }
  const positive = moveX > this.translateX;
  this.translateX = moveX;
  transform(
    moveX,
    positive,
    status,
    duration,
    this.element,
    this.buttons,
    this.slideRange,
  );
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
    this.translateX === 0 ||
    (this.translateX < 0 &&
      (e.point[0] - this.startX >= 0 || this.translateX > -this.throttle)) ||
    (this.translateX > 0 &&
      (e.point[0] - this.startX <= 0 || this.translateX < this.throttle))
  ) {
    this.hideButton();
  } else {
    this.showButton(this.translateX > 0 ? 'left' : 'right');
  }
};

type IBuilder = {
  element: HTMLElement;
  destory: () => void;
};
type ButtonOptions = {
  element: HTMLElement; //当前按钮元素
  position?: 'left' | 'right'; // 按钮位置
  icon?: boolean; // 是否是图标
  width: number; // 当前按钮的宽度
  data?: any; // 按钮携带数据
};

class SlideView extends EventTarget<SlideViewEventType, SlideViewEvent> {
  static REBOUNCE_SIZE: number = 12; // 弹性尺寸
  slideAngle: number = 0; // 手指滑出时与水平角度值（非真实角度，只是xy差，反映是否小于45度）
  translateX: number = 0; // 元素当前滑出向量值
  slideRange: number[] = [0, 0]; // element逐步移动最大范围
  element: HTMLElement; // 触发滑动的元素
  buttons: ButtonOptions[] = []; // 按钮集合
  disable: boolean = false; // 禁止按钮滑出
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  throttle: number = 60; // 按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  rebounce: boolean = true; // 滑出时是否有弹性效果
  slideOut: boolean = false; // 按钮状态，已滑出（展开）
  isMoving: boolean = false; // 是否正在滑动
  startX: number = 0; // 手指放上后初始x值
  startY: number = 0; // 手指放上后初始y值
  startTX: number = 0; // 手指放上那一刻，translateX值
  gesture: IGesture | null = null;
  builder: IBuilder | null = null;
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
    this.builder = generate(
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
    this.element = this.builder.element;
    this.setContent(content);
    this.setButtons(buttons);
    this.gesture = gesture(this.element, {
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
    const leftBtnElement = this.element.previousSibling
      ?.firstChild as HTMLElement;
    leftBtnElement.innerHTML = '';
    const rightBtnElement = this.element.nextSibling?.firstChild as HTMLElement;
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
          padding: icon ? 0 : '0 16px',
          margin: icon ? '0 10px' : 0,
          borderRadius: icon
            ? !height
              ? '50%'
              : (typeof height === 'string' ? parseInt(height, 10) : height) / 2
            : 0,
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
          icon: !!icon,
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
      this.element.innerHTML = '';
      this.element.appendChild(tempChild);
    }
  }
  showButton(pos?: 'left' | 'right') {
    if (!this.buttons.length) {
      return;
    }
    /* if (!this.slideOut) {
      onOnceTransitionEnd(this.element, (e) => {
        const pool = this.events.show || [];
        pool.forEach((h) =>
          h({
            type: 'show',
            target: this.element,
            sourceEvent: e,
          }),
        );
      });
    } */
    const max = this.slideRange[pos === 'left' ? 1 : 0];
    const show = (delt: number = 0) => {
      const moveX = max + delt;
      const positive = moveX > this.translateX;
      this.translateX = moveX;
      transform(
        moveX,
        positive,
        0,
        this.duration,
        this.element,
        this.buttons,
        this.slideRange,
      );
    };
    // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
    if (this.rebounce && Math.abs(this.translateX) < Math.abs(max)) {
      show(SlideView.REBOUNCE_SIZE * (pos === 'left' ? 1 : -1));
      onOnceTransitionEnd(this.element, () => show());
    } else {
      show();
    }
  }
  hideButton() {
    if (!this.buttons.length) {
      return;
    }
    /* if (this.translateX) {
      onOnceTransitionEnd(this.element, (e) => {
        const pool = this.events.hide || [];
        pool.forEach((h) =>
          h({
            type: 'hide',
            target: this.element,
            sourceEvent: e,
          }),
        );
      });
    } */
    const positive = this.translateX < 0;
    this.translateX = 0;
    transform(
      0,
      positive,
      0,
      this.duration,
      this.element,
      this.buttons,
      this.slideRange,
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
