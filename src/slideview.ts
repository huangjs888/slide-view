/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-13 15:00:36
 * @Description: ******
 */

import EventTarget from '@huangjs888/gesture/emitter';
import type { IGestureEvent } from '@huangjs888/gesture';
import { type IElement, getElement, createElement, cssInject } from '@huangjs888/lightdom';
import bindGesture, { onOnceTransitionEnd } from './events';
import { transform } from './transform';
import { overshootChange } from './overshoot';
import { confirmStyle, confirmCancel } from './confirm';
import { getIconType } from './util';
import css from './css';

cssInject('hjs-slide-view-style', css);

class SlideView extends EventTarget<IType, IEvent> {
  element: HTMLElement | null = null; // 滑动视图元素
  contentEl: HTMLElement | null = null; // 内容元素
  leftEl: HTMLElement | null = null; // 左按钮元素
  rightEl: HTMLElement | null = null; // 右按钮元素
  leftActions: MergeAction | null = null; // 按钮集合
  rightActions: MergeAction | null = null; // 按钮集合
  friction: number = 0.5; // 摩擦因子(0-1的值)
  rebounce: number = 12; // 弹性尺寸
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  timing: ITiming = 'ease'; // 滑动时动画的函数
  _destory: boolean = false; // 是否销毁
  _direction: IDirection = 'none'; // 当前展示的是哪个方向按钮
  _confirming: Confirm | null = null; // 当前正在确认的按钮
  _overshooting: boolean = false; // 当前是否处于overshoot状态
  _translate: number = 0; // 元素当前位移值
  _width: number = 0; // 视图宽度
  _offset: number = 0; // 手指放上后滑动视图元素距离屏幕左边距离即offsetLeft
  _startOffset: number = 0; // 手指放上那一刻，translate值
  _startTranslate: number = 0; // 手指放上那一刻，translate未经rebounceSize的值
  _startPoint: number[] | null = null; // 手指放上后初始点
  _startAngle: number = 0; // 移动时的角度与45度的关系
  _timestamp: number = 0; // 移动时的时间戳
  _isMoving: boolean = false; // 是否正在滑动
  _unbind: (() => void) | null;

  constructor(options: IOption) {
    super();
    const {
      className,
      container,
      content,
      friction,
      rebounce,
      duration,
      timing,
      leftActions,
      rightActions,
    } = options;
    const tempContainer = getElement(container);
    if (!tempContainer) {
      throw new Error('Please pass in a valid container element...');
    }
    const element = (this.element = createElement(
      {
        className: ['hjs-slideview', className || ''],
      },
      [
        (this.leftEl = createElement({
          className: 'hjs-slideview__left',
        }) as HTMLElement),
        (this.rightEl = createElement({
          className: 'hjs-slideview__right',
        }) as HTMLElement),
        (this.contentEl = createElement({
          className: 'hjs-slideview__content',
        }) as HTMLElement),
      ],
      tempContainer,
    ) as HTMLElement);
    const gesture = bindGesture.apply(this, [element]);
    this.setContent(content);
    this.setFriction(friction);
    this.setRebounce(rebounce);
    this.setDuration(duration);
    this.setTiming(timing);
    this.setActions(leftActions, 'left');
    this.setActions(rightActions, 'right');
    // 浏览器窗口变化重置
    const resize = () => {
      const { width, left } = element.getBoundingClientRect();
      this._width = width;
      this._offset = left;
    };
    window.addEventListener('resize', resize);
    this._unbind = () => {
      gesture.destory();
      window.removeEventListener('resize', resize);
    };
    resize();
  }
  setContent(content: IElement, dangerous?: boolean) {
    if (this._destory || !this.contentEl) {
      return;
    }
    // 注意XSS注入
    if (dangerous && typeof content === 'string') {
      this.contentEl.innerHTML = content;
      return;
    }
    const tempChild = getElement(content);
    if (tempChild) {
      this.contentEl.innerHTML = '';
      this.contentEl.appendChild(tempChild);
    }
  }
  setFriction(friction: number = 0.5) {
    if (this._destory) {
      return;
    }
    // friction: 不传为默认值0.5，传小于0的都为0，大于1的都为1，传非数字，则属于无效设置
    if (typeof friction === 'number') {
      this.friction = Math.min(1, Math.max(0, friction));
    }
  }
  setRebounce(rebounce: number = 12) {
    if (this._destory) {
      return;
    }
    // rebounce: 不传为默认值12，传小于0的都为0，传非数字，则属于无效设置
    if (typeof rebounce === 'number') {
      this.rebounce = Math.max(0, rebounce);
    }
  }
  setDuration(duration: number = 0.4) {
    if (this._destory) {
      return;
    }
    // duration: 不传为默认值0.4，传小于0的都为0，传非数字，则属于无效设置
    if (typeof duration === 'number') {
      this.duration = Math.max(0, duration);
    }
  }
  setTiming(timing: ITiming = 'ease') {
    if (this._destory) {
      return;
    }
    // timing: 不传为默认值ease
    this.timing = timing;
  }
  setDisable(disable: boolean = true, direction: IDirection = 'both') {
    if (this._destory) {
      return;
    }
    // disable: 不传为默认值true，传非布尔，则无效设置
    if (typeof disable === 'boolean') {
      this.hide().then(() => {
        // direction传其它，则属于无效设置
        if (this.leftActions && (direction === 'both' || direction === 'left')) {
          this.leftActions.disable = disable;
        }
        if (this.rightActions && (direction === 'both' || direction === 'right')) {
          this.rightActions.disable = disable;
        }
      });
    }
  }
  setOvershoot(overshoot: boolean = true, direction: IDirection = 'both') {
    if (this._destory) {
      return;
    }
    // overshoot: 不传为默认值true，传非布尔，则无效设置
    if (typeof overshoot === 'boolean') {
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.overshoot = overshoot;
      }
      if (this.rightActions && (direction === 'both' || direction === 'right')) {
        this.rightActions.overshoot = overshoot;
      }
    }
  }
  setThreshold(threshold: number = 40, direction: IDirection = 'both') {
    if (this._destory) {
      return;
    }
    // overshoot: 不传为默认值40，传小于0的都为0，传非数字，则无效设置
    if (typeof threshold === 'number') {
      const _threshold = Math.max(0, threshold);
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.threshold = Math.min(_threshold, this.leftActions.width);
      }
      if (this.rightActions && (direction === 'both' || direction === 'right')) {
        this.rightActions.threshold = Math.min(_threshold, this.rightActions.width);
      }
    }
  }
  setActions(actions: IActionOption = {}, direction: IDirection = 'both') {
    if (this._destory || direction === 'none') {
      return;
    }
    // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
    const _setActions = (_direction: 'left' | 'right') => {
      const parentEl = this[`${_direction}El`];
      if (!parentEl) {
        return;
      }
      parentEl.innerHTML = '';
      this[`${_direction}Actions`] = null;
      if (actions.items && actions.items.length > 0) {
        const {
          className,
          style = 'accordion',
          disable = false,
          overshoot = false,
          overshootEdgeSize = 80,
          overshootFreeSize = 30,
          threshold = 40,
          items,
        } = actions;
        const tElement = createElement(
          {
            className: ['hjs-slideview__actions', className || ''],
          },
          null,
          parentEl,
        ) as HTMLElement;
        let tWidth = 0;
        let tGap = 0;
        let newItems = items.map((item, index) => {
          const { gap = 0, fixedGap = false, text, icon } = item;
          const element = createElement(
            {
              className: 'hjs-slideview__action',
              attrs: {
                dataIndex: String(index),
              },
            },
            [
              icon
                ? createElement(getIconType(icon), {
                    className: 'hjs-slideview__action__icon',
                  })
                : null,
              text
                ? createElement('span', {
                    className: 'hjs-slideview__action__text',
                  })
                : null,
            ],
          ) as HTMLElement;
          const wrapper = createElement(
            {
              className: 'hjs-slideview__action__wrapper',
            },
            element,
            tElement,
          ) as HTMLElement;
          const tItem: MergeActionItem = {
            ...item,
            wrapper,
            element,
            width: 0,
            gap: [0, 0],
            fixedGap,
          };
          // 设置非确认时的样式和内容
          confirmStyle(tItem);
          const { width } = element.getBoundingClientRect();
          let leftGap = 0;
          let rightGap = 0;
          if (typeof gap === 'number') {
            leftGap = gap;
            rightGap = gap;
          } else {
            [leftGap, rightGap] = gap;
          }
          leftGap = Math.min(width, Math.max(leftGap, 0));
          rightGap = Math.min(width, Math.max(rightGap, 0));
          tWidth += width + leftGap + rightGap;
          tGap += leftGap + rightGap;
          return {
            ...tItem,
            gap: [leftGap, rightGap],
            fixedGap: leftGap === 0 && rightGap === 0 ? false : fixedGap, // 左右gap都为0的情况，gudinggap无意义
            width,
          };
        });
        this[`${_direction}Actions`] = {
          style,
          disable,
          overshoot,
          overshootFreeSize,
          overshootEdgeSize,
          threshold: Math.min(tWidth, Math.max(threshold, 0)),
          element: tElement,
          width: tWidth,
          gap: tGap,
          items: newItems,
        };
      }
    };
    const _setActionsAfterCollapse = (_direction: 'left' | 'right') => {
      // 重新设置按钮时应该先收起
      this.hide().then(() => {
        _setActions(_direction);
        this.show(_direction);
      });
    };
    const shown = this._translate > 0 ? 'left' : this._translate < 0 ? 'right' : 'none';
    if (direction === 'both') {
      if (shown !== 'none') {
        _setActionsAfterCollapse(shown);
      }
      if (shown !== 'left') {
        _setActions('left');
      }
      if (shown !== 'right') {
        _setActions('right');
      }
    } else {
      if (shown === direction) {
        _setActionsAfterCollapse(direction);
      } else {
        _setActions(direction);
      }
    }
  }
  toggle(direction: IDirection = 'right') {
    return this._translate === 0 ? this.show(direction) : this.hide();
  }
  show(direction: IDirection = 'right') {
    const { contentEl, rebounce, leftActions, rightActions } = this;
    if (
      this._destory ||
      !contentEl ||
      ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable))
    ) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      let __direction = direction;
      if (!leftActions || leftActions.disable) {
        __direction = 'right';
      }
      if (!rightActions || rightActions.disable) {
        __direction = 'left';
      }
      const actions = __direction === 'left' ? leftActions : rightActions;
      const factor = __direction === 'left' ? 1 : -1;
      const maxTranslate = !actions ? 0 : actions.width * factor;
      if (this._translate === maxTranslate) {
        resolve();
        return;
      }
      const show = (rebSize: number = 0) => {
        const translate = maxTranslate + rebSize;
        this._translate = translate;
        transform.apply(this, [translate]);
        if (this._overshooting) {
          this._overshooting = false;
          overshootChange.apply(this, [this._translate > 0 ? leftActions : rightActions]);
        }
        confirmCancel.apply(this, []);
        if (!rebSize) {
          onOnceTransitionEnd(contentEl, () => {
            resolve();
            if (this._direction !== __direction) {
              this.emit('show', {
                direction: __direction,
                currentTarget: contentEl,
                timestamp: Date.now(),
                sourceEvent: null,
              });
              this._direction = __direction;
            }
          });
        }
      };
      // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
      if (
        rebounce > 0 &&
        ((maxTranslate > 0 && this._translate < maxTranslate) ||
          (maxTranslate < 0 && this._translate > maxTranslate))
      ) {
        onOnceTransitionEnd(contentEl, () => show());
        show(rebounce * factor);
      } else {
        show();
      }
    });
  }
  hide() {
    const { contentEl, leftActions, rightActions } = this;
    if (
      this._destory ||
      this._translate === 0 ||
      !contentEl ||
      ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable))
    ) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this._translate = 0;
      transform.apply(this, [0]);
      // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
      onOnceTransitionEnd(contentEl, () => {
        resolve();
        if (this._overshooting) {
          this._overshooting = false;
          overshootChange.apply(this, [this._translate > 0 ? leftActions : rightActions]);
        }
        confirmCancel.apply(this, []);
        if (this._direction !== 'none') {
          this.emit('hide', {
            direction: 'none',
            currentTarget: contentEl,
            timestamp: Date.now(),
            sourceEvent: null,
          });
          this._direction = 'none';
        }
      });
    });
  }
  destory() {
    // 解除所有事件
    super.off();
    // 销毁底层事件
    if (this._unbind) {
      this._unbind();
      this._unbind = null;
    }
    this._destory = true;
    this.leftActions = null;
    this.rightActions = null;
    this._confirming = null;
    this._startPoint = null;
    this.contentEl = null;
    this.leftEl = null;
    this.rightEl = null;
    if (this.element) {
      // 删除元素，用户可以在调用该方法之前加一个删除动画
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
  }
}

export type IDirection = 'left' | 'right' | 'both' | 'none';

export type ITiming =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | `cubic-bezier(${number},${number},${number},${number})`;

export type ActionStyle = 'drawer' | 'accordion';

export type Confirm = {
  direction: IDirection;
  index: number;
};

export type MergeActionItem = {
  wrapper: HTMLElement; // 当前按钮包裹元素
  element: HTMLElement; // 当前按钮元素
  width: number; // 当前按钮的宽度
  gap: number[]; // 元素之间的间距
  fixedGap: boolean; //拉伸按钮时，是否固定间距
} & IActionItem;

export type MergeAction = {
  style: ActionStyle; // 按钮展示的风格
  disable: boolean; // 禁用按钮
  threshold: number; // 阈值（超过这个阈值时抬起后所有按钮自动滑出，否则收起）
  overshoot: boolean; // 滑动超出(仅限最后一个按钮)
  overshootFreeSize: number; // overshoot后，总宽度剩余部分
  overshootEdgeSize: number; // 手指滑动到接近屏幕边缘尺寸（小于这个尺寸就overshoot）
  element: HTMLElement; // 所有按钮父元素
  width: number; // 按钮父元素宽度，即所有按钮宽度加间距宽度
  gap: number; // 元素之间的间距之和
  items: MergeActionItem[]; // 按钮配置
};

export type IActionItem = {
  className?: string; // 按钮自定义样式
  text?: string; // 按钮文字
  icon?: string; // 按钮图标（会根据传入的字符串形式判断是img还是svg元素或是字体icon）
  color?: string; // 按钮文字图标颜色（img图标除外）
  background?: string; //按钮背景颜色
  confirm?: {
    // 按钮在确认的时候替代的内容样式，不传则没有确认环节，只传{}则有确认环节，但内容样式不改变
    className?: string; // 按钮自定义样式
    text?: string; // 按钮文字
    icon?: string; // 按钮图标
    color?: string; // 按钮文字图标颜色
    background?: string; //按钮背景颜色
  }; // 按钮确认时的信息
  collapse?: boolean; // 按钮点击后是否收起
  gap?: number | number[]; // 元素左右间距
  fixedGap?: boolean; //拉伸按钮时，是否固定间距
  data?: any; //按钮携带数据
};

export type IActionOption = {
  className?: string; // 按钮自定义样式
  style?: ActionStyle; // 按钮展示的风格
  disable?: boolean; // 禁用按钮
  threshold?: number; // 阈值（超过这个阈值时抬起后所有按钮自动滑出，否则收起）
  overshoot?: boolean; // 滑动超出(仅限最后一个按钮)
  overshootEdgeSize?: number; // 手指滑动到接近屏幕边缘尺寸（小于这个尺寸就overshoot）
  overshootFreeSize?: number; // 滑动出来的尺寸占据组件容器尺寸之后的剩余尺寸（小于这个尺寸就overshoot）
  items?: IActionItem[]; // 按钮配置
};

export type IOption = {
  className?: string; // 滑动组件类名控制样式
  container: IElement; // 装载滑动组件的DOM容器
  content?: IElement; // 滑动组件的子节点
  friction?: number; // 摩擦因子(0-1的值)
  rebounce?: number; // 弹性尺寸
  duration?: number; // 滑动时动画的时间（秒级）
  timing?: ITiming; // 滑动时动画的函数
  leftActions?: IActionOption;
  rightActions?: IActionOption;
};

export type IType =
  | 'show'
  | 'hide'
  | 'press'
  | 'longPress'
  | 'doublePress'
  | 'buttonPress'
  | 'buttonConfirm';

export type IEvent = {
  currentTarget: HTMLElement;
  timestamp: number;
  sourceEvent: IGestureEvent | null;
  direction?: IDirection; // 滑出的是哪边的按钮
  index?: number; // 点击按钮在按钮集合里的索引
  data?: any; // 按钮携带的数据
};

export default SlideView;
