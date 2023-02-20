/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:15:13
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
  container: Element,
  handler: (t: SlideViewEventType, e: Event) => void,
  className?: string,
) {
  styleInject(css);
  const view = document.createElement('div');
  addClass(view, `hjs-slide-view ${className || ''}`);
  const element = document.createElement('div');
  addClass(element, 'hjs-slideview__left');
  const click = (e: Event) => handler('click', e);
  element.addEventListener('click', click);
  const rightElement = document.createElement('div');
  addClass(rightElement, 'hjs-slideview__right');
  const btnElement = document.createElement('div');
  addClass(btnElement, 'hjs-slideview__buttons');
  const btnClick = (e: Event) => handler('button-click', e);
  btnElement.addEventListener('click', btnClick);
  rightElement.appendChild(btnElement);
  view.appendChild(element);
  view.appendChild(rightElement);
  container.innerHTML = '';
  container.appendChild(view);
  return {
    element,
    destory: () => {
      element.removeEventListener('click', click);
      btnElement.removeEventListener('click', btnClick);
      container.innerHTML = '';
    },
  };
};

const start = function start(this: SlideView, e: GestureEvent) {
  if (!this.buttons.length || this.disable) {
    return;
  }
  this.isMoving = true;
  this.startX = e.point[0];
  this.startY = e.point[1];
  this.slideAngle = 0;
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
  // 滑动距离
  let movex;
  // 前面所有按钮的占比距离
  let transformTotal = 0;
  // 已经滑出来情况处理
  if (this.slideOut) {
    if (pagex < 0) {
      if (this.rebounce) {
        // 滑出情况向左滑动，小幅度弹性继续展开（后面松开时会恢复到最大展开值）
        movex = rebounceSize(pagex);
      } else {
        movex = 0;
      }
    } else {
      if (pagex <= this.maxWidth) {
        // 向右滑动收起
        movex = pagex;
      } else {
        /* if (this.rebounce) {
          // 弹性右滑
          movex = this.maxWidth + rebounceSize(pagex - this.maxWidth);
        } else {
          // 超过收起最大值之后，更新初始点值，同时标记为已收起
          this.startX = e.point[0];
          this.startY = e.point[1];
          this.slideOut = false;
          movex = this.maxWidth;
        } */
        // 超过收起最大值之后，更新初始点值，同时标记为已收起
        this.startX = e.point[0];
        this.startY = e.point[1];
        this.slideOut = false;
        movex = this.maxWidth;
      }
    }
    this.slideVector = -this.maxWidth + movex;
    setStyle(this.element, {
      transform: `translateX(${-this.maxWidth + movex}px)`,
      transition: '',
    });
    transformTotal = 0;
    for (let i = this.buttons.length - 1; i >= 0; i--) {
      // 当前按钮需要收起的占比距离
      const transform = (this.buttons[i].width / this.maxWidth) * movex;
      // 当前按钮收起距离应该是占比距离-当前按钮滑出的最大距离
      const transformx = -this.buttons[i].maxWidth + transform + transformTotal;
      setStyle(this.buttons[i].element, {
        transform: `translateX(${transformx}px)`,
        transition: '',
      });
      // 累计已收起按钮的占比距离
      transformTotal += transform;
    }
    return false; // 禁止垂直方向的滑动
  }
  // 需要滑出情况处理
  if (pagex > 0) {
    /* if (this.rebounce) {
      // 弹性距离
      movex = rebounceSize(pagex);
    } else {
      // 收起情况向右滑动，改变初始点值
      this.startX = e.point[0];
      this.startY = e.point[1];
      movex = 0;
    } */
    // 收起情况向右滑动，改变初始点值
    this.startX = e.point[0];
    this.startY = e.point[1];
    movex = 0;
  } else {
    if (pagex >= -this.maxWidth) {
      // 向左滑动展开
      movex = pagex;
    } else {
      if (this.rebounce) {
        // 向左滑动超过展开最大值之后，小幅度弹性继续展开（后面松开时会恢复到最大展开值）
        movex = rebounceSize(pagex + this.maxWidth) - this.maxWidth;
      } else {
        movex = -this.maxWidth;
      }
    }
  }
  this.slideVector = movex;
  setStyle(this.element, {
    transform: `translateX(${movex}px)`,
    transition: '',
  });
  transformTotal = 0;
  for (let i = this.buttons.length - 1; i >= 0; i--) {
    // 当前按钮需要滑出的占比距离
    const transform = (this.buttons[i].width / this.maxWidth) * movex;
    // 当前按钮滑出距离应该是占比距离+前面所有按钮的占比距离
    const transformx = transform + transformTotal;
    setStyle(this.buttons[i].element, {
      transform: `translateX(${transformx}px)`,
      transition: '',
    });
    // 累计已滑出按钮的占比距离
    transformTotal += transform;
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
  // 如果滑出的距离小于throttle，或者直接向右滑（出现于向右滑一点，但未完全收起的情况）则直接完全收起
  if (
    e.point[0] - this.startX > 0 ||
    Math.abs(e.point[0] - this.startX) < this.throttle
  ) {
    this.hideButton();
  } else {
    // 如果结束滑动时滑动的距离小于maxWidth，有回弹效果
    this.showButton();
  }
};

type IBuilder = {
  element: HTMLElement;
  destory: () => void;
};
type ButtonOptions = {
  element: HTMLElement; //当前按钮元素
  maxWidth: number; // 当前按钮滑出后展开的最大宽度（即当前按钮宽度和右边所有按钮宽度之和）
  width: number; // 当前按钮的宽度
  data?: any; // 按钮携带数据
};

class SlideView extends EventTarget<SlideViewEventType, SlideViewEvent> {
  static REBOUNCE_SIZE: number = 12; // 弹性尺寸
  element: HTMLElement; // 触发滑动的元素
  maxWidth: number = 0; // 滑出后展开的最大宽度（所有按钮的宽度和，无方向）
  buttons: ButtonOptions[] = []; // 按钮集合
  disable: boolean = false; // 禁止按钮滑出
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  throttle: number = 60; // 按钮滑出距离阈值（超过这个阈值时抬起后自动滑出，否则收起）
  rebounce: boolean = true; // 滑出时是否有弹性效果
  slideOut: boolean = false; // 按钮状态，已滑出（展开）
  slideVector: number = 0; // 滑出元素当前滑出距离（有方向）
  slideAngle: number = 0; // 手指滑出时与水平角度值（非真实角度，只是xy差，反映是否小于45度）
  isMoving: boolean = false; // 是否正在滑动
  startX: number = 0; // 手指放上后初始x值
  startY: number = 0; // 手指放上后初始y值
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
    let tempContainer;
    if (typeof container === 'string') {
      tempContainer = document.querySelector(container);
    } else {
      tempContainer = container;
    }
    if (!tempContainer || !(tempContainer instanceof HTMLElement)) {
      throw new Error('Please pass a container element...');
    }
    this.builder = generate(
      tempContainer,
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
    const btnElement = this.element.nextSibling?.firstChild as HTMLElement;
    btnElement.innerHTML = '';
    let maxWidth = 0;
    let actions: ButtonOptions[] = [];
    actions = (buttons || [])
      .map(
        (
          { className, icon, width, height, text, color, background, data },
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
            padding: icon ? 0 : '0px 46px 0 16px',
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
          btnElement.appendChild(btnWrap);
          return {
            delt: icon ? 0 : -30, // 右边距多了30，是为了弹性效果增加的
            element: btnWrap,
            data,
          };
        },
      )
      .reverse()
      .map(({ delt, element, data }) => {
        const width = element.getBoundingClientRect().width + delt;
        maxWidth += width;
        return {
          element,
          width,
          maxWidth,
          data,
        };
      })
      .reverse();
    this.maxWidth = maxWidth;
    this.buttons = actions;
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
  showButton() {
    if (!this.buttons.length) {
      return;
    }
    if (!this.slideOut) {
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
    }
    this.slideOut = true;
    const show = (delt: number = 0) => {
      this.slideVector = -this.maxWidth - delt;
      setStyle(this.element, {
        transform: `translate3d(${-this.maxWidth - delt}px, 0, 0)`,
        transition: `transform ${this.duration}s`,
      });
      let transformTotal = 0;
      for (let i = this.buttons.length - 1; i >= 0; i--) {
        // 当前按钮需要滑出的占比距离
        const transform =
          -(this.buttons[i].width / this.maxWidth) * (this.maxWidth + delt);
        // 当前按钮滑出距离应该是占比距离+前面所有按钮的占比距离
        const transformx = transform + transformTotal;
        setStyle(this.buttons[i].element, {
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition: `transform ${this.duration}s`,
        });
        // 累计已滑出按钮的占比距离
        transformTotal += transform;
      }
    };
    // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
    if (this.rebounce && Math.abs(this.slideVector) < this.maxWidth) {
      show(SlideView.REBOUNCE_SIZE);
      onOnceTransitionEnd(this.element, () => show());
    } else {
      show();
    }
  }
  hideButton() {
    if (!this.buttons.length) {
      return;
    }
    if (this.slideOut) {
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
    }
    this.slideOut = false;
    this.slideVector = 0;
    setStyle(this.element, {
      transform: 'translate3d(0, 0, 0)',
      transition: `transform ${this.duration}s`,
    });
    for (let i = this.buttons.length - 1; i >= 0; i--) {
      setStyle(this.buttons[i].element, {
        transform: 'translate3d(0, 0, 0)',
        transition: `transform ${this.duration}s`,
      });
    }
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
  data?: any; //按钮携带数据
};

export type SlideViewOptions = {
  container: Element | string; // 装载滑动删除的DOM容器
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
