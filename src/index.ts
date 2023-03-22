/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-21 16:58:34
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

const generateEl = function generateEl(
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
  const viewElement = addClass(
    document.createElement('div'),
    `hjs-slideview ${className || ''}`,
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
  actionStyle: ActionStyle,
  actionItem: MergeActionItem,
  isConfirm: boolean = false,
) {
  const {
    wrapElement,
    element,
    confirm = {}, // isConfirm为true，confirm必然存在
    ...rest
  } = actionItem;
  let { text, icon, color, background, className } = rest;
  if (isConfirm) {
    // 如果icon不存在，则不存在该确认，如果icon存在，则取确认icon，若确认icon不存在，则仍然取icon
    icon = icon && (confirm.icon || icon);
    text = text && (confirm.text || text);
    color = color && (confirm.color || color);
    background = background && (confirm.background || background);
    className = className && (confirm.className || className);
  }
  setStyle(element, {
    color: color || 'inherit',
    background: background || 'inherit',
    boxShadow:
      actionStyle === 'round'
        ? `0px 0px 9px -2px ${background || 'inherit'}`
        : 'none',
  });
  if (actionStyle !== 'round') {
    setStyle(wrapElement, {
      background: background || 'inherit',
    });
  }
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
  confirm: Confirm,
  translate: number = 0,
) {
  const { contentEl, leftActions, rightActions, duration, timing } = this;
  if (
    !contentEl ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const transition = duration <= 0 ? '' : `transform ${duration}s ${timing} 0s`;
  const { index, direction } = confirm;
  // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translate等于0了，所以无需再判断
  const factor =
    this._translate === 0 ? 0 : this._translate / Math.abs(this._translate);
  const aTransform = ({ items }: MergeAction) => {
    // 前面已有按钮的占比距离
    let transformTotal = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const { wrapElement, width } = items[i];
      if (items.length === 1) {
        // 如果是仅有一个按钮，确认的时候设置2倍变化
        setStyle(contentEl, {
          transform: `translate3d(${
            translate !== 0 ? translate : this._translate
          }px, 0, 0)`,
          transition,
        });
      }
      if (i === index) {
        let transformx = 0;
        if (translate !== 0) {
          transformx = translate;
        } else {
          transformx = (width + transformTotal) * factor;
        }
        setStyle(wrapElement, {
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition,
        });
      } else if (i > index) {
        let transformx = 0;
        if (translate === 0) {
          transformx = (width + transformTotal) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        setStyle(wrapElement, {
          transform: `translate3d(${transformx}px, 0, 0)`,
          transition,
        });
      }
      transformTotal += width;
    }
  };
  // 放入下一帧执行
  window.requestAnimationFrame(() => {
    if (direction === 'left' && leftActions) {
      aTransform(leftActions);
    }
    if (direction === 'right' && rightActions) {
      aTransform(rightActions);
    }
  });
};

const transform = function transform(
  this: SlideView,
  translate: number,
  duration: number = this.duration,
) {
  const { contentEl, leftActions, rightActions, timing } = this;
  if (
    !contentEl ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const transition = duration <= 0 ? '' : `transform ${duration}s ${timing} 0s`;
  const aTransform = ({ items, totalWidth }: MergeAction) => {
    // 前面已有按钮的占比距离
    let transformTotal = 0;
    const len = items.length - 1;
    for (let i = len; i >= 0; i--) {
      const { wrapElement, width } = items[i];
      // 当前按钮需要滑出的占比距离
      const transformb = (width / totalWidth) * translate;
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      const transformx = transformb + transformTotal;
      // 左边或右边的最后一个按钮
      setStyle(wrapElement, {
        transform: `translate3d(${
          i === len && this._overshooting ? translate : transformx
        }px, 0, 0)`,
        transition,
      });
      // 累计已滑出按钮的占比距离
      transformTotal += transformb;
    }
  };
  // 放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(() => {
    setStyle(contentEl, {
      transform: `translate3d(${translate}px, 0, 0)`,
      transition,
    });
    // 这里是左右都进行变换，还是说根据translate的正负来判断只变换某一边的呢（因为另一边处于隐藏状态无需变换耗能）？
    // 答案是都要进行变换，因为存在一种情况，即滑动太快，left的translate还未走到0（没有完全收起），下一把就right了。
    if (leftActions) {
      aTransform(leftActions);
    }
    if (rightActions) {
      aTransform(rightActions);
    }
  });
};

const confirmCancel = function (this: SlideView) {
  // 如果当前处于按钮确认状态，隐藏之前需要先取消
  if (this._confirming) {
    // 因为hide的时候会进行变换，所以不需要再cTransform
    const { index, direction } = this._confirming;
    const actions =
      direction === 'left'
        ? this.leftActions
        : direction === 'right'
        ? this.rightActions
        : null;
    if (actions) {
      const item = actions.items[index];
      if (index !== actions.items.length - 1 || !this._overshooting) {
        setStyle(item.element, {
          width: item.width - item.margin,
        });
      }
      confirmStyle(actions.style, item);
    }
    this._confirming = null;
  }
};

const start = function start(this: SlideView, e: AgentEvent) {
  const { leftActions, rightActions } = this;
  if (
    (!leftActions || leftActions.disable) &&
    (!rightActions || rightActions.disable)
  ) {
    return;
  }
  const { point } = e;
  this._isMoving = true;
  this._startPoint = point;
  this._startTranslate = this._translate;
  this._timeStamp = 0;
};

const move = function move(this: SlideView, e: AgentEvent) {
  const { leftActions, rightActions, elWidth, friction } = this;
  if (
    !this._isMoving ||
    !this._startPoint ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const { point: currentPoint, sourceEvent } = e;
  const currentX = currentPoint[0] - this._startPoint[0];
  const currentY = currentPoint[1] - this._startPoint[1];
  // 左侧45度角为界限，大于45度则允许水平滑动
  if (Math.abs(currentX) - Math.abs(currentY) < 0) {
    return;
  }
  // 滑动距离
  let translate = 0;
  let duration = 0;
  const currentTranslate = this._startTranslate + currentX;
  const actions =
    currentTranslate > 0
      ? leftActions
      : currentTranslate < 0
      ? rightActions
      : null;
  if (actions && !actions.disable) {
    const vector = currentTranslate / Math.abs(currentTranslate);
    const overshoot = actions.overshoot;
    const overshootStart = vector * actions.overshootStart;
    const overshootEnd = vector * actions.overshootEnd;
    const expandTranslate = vector * actions.totalWidth;
    if (overshoot) {
      const timeStamp =
        sourceEvent instanceof MouseEvent
          ? sourceEvent.timeStamp
          : sourceEvent.sourceEvent.timeStamp;
      // currentTranslate和overshootStart一定是同正或同负，直接比较数值大小，即currentTranslate超出overshootStart范围
      if (Math.abs(currentTranslate) >= Math.abs(overshootStart)) {
        if (!this._overshooting) {
          this._timeStamp = timeStamp;
          this._overshooting = true;
          const { element, margin } = actions.items[actions.items.length - 1];
          setStyle(element, {
            width: actions.style === 'round' ? elWidth - margin : 'auto',
          });
        }
        translate =
          rebounceSize(currentTranslate - overshootStart, friction) +
          overshootEnd;
        duration = Math.max(
          0,
          this.duration - (timeStamp - this._timeStamp) / 1000,
        );
      } else {
        if (this._overshooting) {
          this._timeStamp = timeStamp;
          this._overshooting = false;
          const { element, width, margin } =
            actions.items[actions.items.length - 1];
          setStyle(element, {
            width: width - margin,
          });
        }
        translate = currentTranslate;
        duration = Math.max(
          0,
          this.duration / 2 - (timeStamp - this._timeStamp) / 1000,
        );
      }
    } else {
      // currentTranslate和expandTranslate一定是同正或同负，直接比较数值大小，即currentTranslate超出expandTranslate范围
      if (Math.abs(currentTranslate) >= Math.abs(expandTranslate)) {
        // 这里不能根据数值大小来比较，因为this._startTranslate和expandTranslate不一定是同正或同负
        const _expandTranslate =
          currentTranslate < 0
            ? Math.min(expandTranslate, this._startTranslate)
            : Math.max(expandTranslate, this._startTranslate);
        translate =
          rebounceSize(currentTranslate - _expandTranslate, friction) +
          _expandTranslate;
      } else {
        translate = currentTranslate;
      }
      duration = 0;
    }
  } else {
    this._startPoint = currentPoint;
    this._startTranslate = this._translate;
    this._timeStamp = 0;
    translate = 0;
    duration = 0;
  }
  translate = Math.min(elWidth, Math.max(-elWidth, translate));
  this._translate = translate;
  transform.apply(this, [translate, duration]);
  confirmCancel.apply(this, []);
  return false; // 禁止垂直方向的滑动
};

const end = function end(this: SlideView, e: AgentEvent) {
  const { leftActions, rightActions } = this;
  if (
    !this._isMoving ||
    !this._startPoint ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const startPoint = this._startPoint;
  const currentPoint = e.point;
  this._isMoving = false;
  this._startTranslate = 0;
  this._startPoint = null;
  this._timeStamp = 0;
  // 滑动距离为0（表示本身就是隐藏状态）或没有任何滑动（只是点了一下）不做任何操作
  // 这个判断是因为手势里默认移动距离在3px以内不算移动
  if (this._translate === 0 || getDistance(startPoint, currentPoint) < 3) {
    return;
  }
  const actions =
    this._translate > 0
      ? leftActions
      : this._translate < 0
      ? rightActions
      : null;
  if (actions) {
    // 进行覆盖滑出行为
    if (this._overshooting) {
      buttonSlide.apply(this, [
        e,
        {
          index: actions.items.length - 1,
          direction: this._translate > 0 ? 'left' : 'right',
        },
      ]);
      return;
    }
    // 右边按钮展示状态下往右滑动了，或者右边按钮未展示情况下，左滑出的距离不足滑出阈值
    const delta = currentPoint[0] - startPoint[0];
    if (
      (this._translate > 0 && delta < 0) ||
      (this._translate < 0 && delta > 0) ||
      Math.abs(this._translate) < actions.threshold
    ) {
      this.hide();
      return;
    }
  }
  // 其它情况均为展示按钮
  this.show(this._translate > 0 ? 'left' : 'right');
};

const longPress = function longPress(this: SlideView, e: AgentEvent) {
  const { contentEl, _translate } = this;
  const { sourceEvent, currentTarget } = e;
  let target = (
    sourceEvent instanceof MouseEvent
      ? sourceEvent.target
      : sourceEvent.sourceEvent.target
  ) as HTMLElement;
  while (target !== currentTarget && target !== contentEl) {
    target = target.parentNode as HTMLElement;
  }
  // 触发内容双按压事件
  if (target === contentEl) {
    // 收起时候则触发长按事件，未收起则收起
    if (_translate === 0) {
      this.trigger('longPress', {
        currentTarget: contentEl,
        timeStamp: Date.now(),
        sourceEvent: e,
      });
    } else {
      this.hide();
    }
  }
};

const doublePress = function doublePress(this: SlideView, e: AgentEvent) {
  const { contentEl, _translate } = this;
  const { sourceEvent, currentTarget } = e;
  let target = (
    sourceEvent instanceof MouseEvent
      ? sourceEvent.target
      : sourceEvent.sourceEvent.target
  ) as HTMLElement;
  while (target !== currentTarget && target !== contentEl) {
    target = target.parentNode as HTMLElement;
  }
  // 触发内容双按压事件
  if (target === contentEl) {
    // 收起时候则触发双按事件，未收起则收起
    if (_translate === 0) {
      this.trigger('doublePress', {
        currentTarget: contentEl,
        timeStamp: Date.now(),
        sourceEvent: e,
      });
    } else {
      this.hide();
    }
  }
};

const press = function press(this: SlideView, e: AgentEvent) {
  const { contentEl, leftEl, rightEl, _translate } = this;
  const { sourceEvent, currentTarget } = e;
  let target = (
    sourceEvent instanceof MouseEvent
      ? sourceEvent.target
      : sourceEvent.sourceEvent.target
  ) as HTMLElement;
  while (
    target !== currentTarget &&
    target !== contentEl &&
    target !== leftEl &&
    target !== rightEl
  ) {
    target = target.parentNode as HTMLElement;
  }
  // 触发内容元素按压事件
  if (target === contentEl) {
    // 没有使用this._direction判断，是因为该值变化是要动画结束后变化，this._translate变化是动画执行前
    // 使用this._translate判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._direction正好相反
    // 收起时候则触发按压事件，未收起则收起
    if (_translate === 0) {
      this.trigger('press', {
        currentTarget: contentEl,
        timeStamp: Date.now(),
        sourceEvent: e,
      });
    } else {
      this.hide();
    }
  }
  // 触发左边按钮按压事件
  else if (target === leftEl) {
    buttonPress.apply(this, [e, 'left']);
  }
  // 触发右边按钮按压事件
  else if (target === rightEl) {
    buttonPress.apply(this, [e, 'right']);
  }
};

const buttonPress = function buttonPress(
  this: SlideView,
  event: AgentEvent,
  direction: Direction,
) {
  const { _confirming, leftActions, rightActions, elWidth, rebounce } = this;
  if (
    this._translate === 0 ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const { sourceEvent, currentTarget } = event;
  let target = (
    sourceEvent instanceof MouseEvent
      ? sourceEvent.target
      : sourceEvent.sourceEvent.target
  ) as HTMLElement;
  while (target !== currentTarget && !target.getAttribute('data-index')) {
    target = target.parentNode as HTMLElement;
  }
  const index = +(target.getAttribute('data-index') || -1);
  const actions: MergeAction | null =
    direction === 'left' ? leftActions : rightActions;
  if (index < 0 || !actions || actions.disable) {
    return;
  }
  const confirm: Confirm = { index, direction };
  const item = actions.items[index];
  // 最后一个按钮单独处理
  if (index === actions.items.length - 1 && actions.overshoot) {
    this._overshooting = true;
    setStyle(item.element, {
      width: actions.style === 'round' ? elWidth - item.margin : 'auto',
    });
    buttonSlide.apply(this, [event, confirm, target]);
    return;
  }
  let eventType: IEventType = 'buttonPress';
  // 确认之后二次点击（确保当前点击的即是正在确认的）
  if (
    _confirming &&
    _confirming.index === index &&
    _confirming.direction === direction
  ) {
    // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
    if (item.collapse) {
      this.hide();
    } else {
      // 取消确认
      setStyle(item.element, {
        width: item.width - item.margin,
      });
      confirmStyle(actions.style, item);
      cTransform.apply(this, [confirm]);
      this._confirming = null;
    }
  } else {
    if (item.confirm) {
      // 如果是仅有一个按钮，确认的时候宽度设置2倍变化，但是不能超过最大宽度
      let translate = this._translate;
      if (actions.items.length === 1) {
        translate =
          (Math.min(Math.abs(2 * this._translate), this.elWidth) * translate) /
          Math.abs(translate);
      }
      this._confirming = confirm;
      setStyle(item.element, {
        width: Math.abs(translate) - item.margin,
      });
      confirmStyle(actions.style, item, true);
      // 设置回弹效果，第一个按钮和圆型按钮不需要
      if (rebounce > 0 && actions.style !== 'round' && index !== 0) {
        onOnceTransitionEnd(item.wrapElement, () => {
          // 该事件执行时确保当前还处于确认状态，否则不能再执行
          if (
            this._confirming &&
            this._confirming.index === confirm.index &&
            this._confirming.direction === confirm.direction
          ) {
            cTransform.apply(this, [confirm, translate]);
          }
        });
        cTransform.apply(this, [
          confirm,
          translate + (rebounce * translate) / Math.abs(translate),
        ]);
      } else {
        cTransform.apply(this, [confirm, translate]);
      }
      eventType = 'buttonConfirm';
    } else {
      // 无需确认的点击（如果collapse，就点击后隐藏按钮，否则不做任何处理）
      if (item.collapse) {
        this.hide();
      }
    }
  }
  this.trigger(eventType, {
    index,
    data: item.data,
    currentTarget: target,
    timeStamp: Date.now(),
    sourceEvent: event,
  });
};

const buttonSlide = function buttonSlide(
  this: SlideView,
  event: AgentEvent,
  confirm: Confirm,
  target?: HTMLElement,
) {
  const { _translate, elWidth, _confirming, leftActions, rightActions } = this;
  const { index, direction } = confirm;
  const actions =
    direction === 'left'
      ? leftActions
      : direction === 'right'
      ? rightActions
      : null;
  if (_translate === 0 || !actions || actions.disable) {
    return;
  }
  const item = actions.items[index];
  let eventType: IEventType = 'buttonPress';
  // overshoot之后二次点击（确保当前点击的即是正在确认的）
  if (
    _confirming &&
    _confirming.index === index &&
    _confirming.direction === direction
  ) {
    confirmStyle(actions.style, item);
    this._confirming = null;
    // 确认后只做取消确认的样式改变，不做收起的改变（忽略了collapse）后续行为交给用户，让其决定否调用hide或show
  } else {
    // 无论是否确认都需要overshoot
    const translate = (_translate * elWidth) / Math.abs(_translate);
    // 已经overshoot的情况就不需要再overshoot
    if (this._translate !== translate) {
      this._translate = translate;
      transform.apply(this, [translate]);
    }
    // 需要确认，触发确认事件
    if (item.confirm) {
      this._confirming = confirm;
      confirmStyle(actions.style, item, true);
      eventType = 'buttonConfirm';
    } else {
      // 不做收起的改变（忽略了collapse）后续行为交给用户，让其决定否调用hide或show
    }
  }
  this.trigger(eventType, {
    index,
    data: item.data,
    currentTarget: target || item.element,
    timeStamp: Date.now(),
    sourceEvent: event,
  });
};

class SlideView extends EventTarget<
  HTMLElement,
  AgentEvent | null,
  IEventType,
  IEvent
> {
  element: HTMLElement | null; // 滑动视图元素
  contentEl: HTMLElement | null; // 内容元素
  leftEl: HTMLElement | null; // 左按钮元素
  rightEl: HTMLElement | null; // 右按钮元素
  leftActions: MergeAction | null = null; // 按钮集合
  rightActions: MergeAction | null = null; // 按钮集合
  friction: number = 0.5; // 摩擦因子(0-1的值)
  rebounce: number = 12; // 弹性尺寸
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  timing: Timing = 'ease'; // 滑动时动画的函数
  elWidth: number = 0; // 视图宽度
  _destory: boolean = false; //是否销毁
  _direction: Direction = 'none'; // 当前展示的是哪个方向按钮
  _confirming: Confirm | null = null; // 当前正在确认的按钮
  _overshooting: boolean = false; // 当前是否处于overshoot状态
  _translate: number = 0; // 元素当前位移值
  _startTranslate: number = 0; // 手指放上那一刻，translate值
  _startPoint: number[] | null = null; // 手指放上后初始点
  _timeStamp: number = 0; // 移动时的时间戳
  _isMoving: boolean = false; // 是否正在滑动
  _agents: IAgent | null;
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
    const [element, contentEl, leftEl, rightEl] = generateEl(
      container,
      className,
    );
    this.element = element;
    this.elWidth = element.getBoundingClientRect().width;
    this.contentEl = contentEl;
    this.leftEl = leftEl;
    this.rightEl = rightEl;
    this.setContent(content);
    this.setFriction(friction);
    this.setRebounce(rebounce);
    this.setDuration(duration);
    this.setTiming(timing);
    this.setActions(leftActions, 'left');
    this.setActions(rightActions, 'right');
    this._agents = agent(element, {
      start: start.bind(this),
      move: move.bind(this),
      end: end.bind(this),
      press: press.bind(this),
      longPress: longPress.bind(this),
      doublePress: doublePress.bind(this),
    });
  }
  setContent(content: HTMLElement | string = '') {
    if (this._destory || !this.contentEl) {
      return;
    }
    if (typeof content === 'string' && !content.match(/^[#|.].+/)) {
      this.contentEl.innerHTML = content;
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
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(tempChild);
      }
    } catch (e) {}
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
  setTiming(timing: Timing = 'ease') {
    if (this._destory) {
      return;
    }
    // timing: 不传为默认值ease
    this.timing = timing;
  }
  setDisable(disable: boolean = true, direction: Direction = 'both') {
    if (this._destory) {
      return;
    }
    // disable: 不传为默认值true，传非布尔，则无效设置
    if (typeof disable === 'boolean') {
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.disable = disable;
      }
      if (
        this.rightActions &&
        (direction === 'both' || direction === 'right')
      ) {
        this.rightActions.disable = disable;
      }
    }
  }
  setOvershoot(overshoot: boolean = true, direction: Direction = 'both') {
    if (this._destory) {
      return;
    }
    // overshoot: 不传为默认值true，传非布尔，则无效设置
    if (typeof overshoot === 'boolean') {
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.overshoot = overshoot;
      }
      if (
        this.rightActions &&
        (direction === 'both' || direction === 'right')
      ) {
        this.rightActions.overshoot = overshoot;
      }
    }
  }
  setThreshold(threshold: number = 40, direction: Direction = 'both') {
    if (this._destory) {
      return;
    }
    // overshoot: 不传为默认值40，传小于0的都为0，传非数字，则无效设置
    if (typeof threshold === 'number') {
      const _threshold = Math.max(0, threshold);
      // direction传其它，则属于无效设置
      if (this.leftActions && (direction === 'both' || direction === 'left')) {
        this.leftActions.threshold = Math.min(
          _threshold,
          this.leftActions.totalWidth,
        );
      }
      if (
        this.rightActions &&
        (direction === 'both' || direction === 'right')
      ) {
        this.rightActions.threshold = Math.min(
          _threshold,
          this.rightActions.totalWidth,
        );
      }
    }
  }
  setActions(actions: IActionOption = {}, direction: Direction = 'both') {
    if (this._destory) {
      return;
    }
    // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
    const _setActions = (_direction: 'left' | 'right') => {
      const parentEl = this[`${_direction}El`];
      if (!parentEl) {
        return;
      }
      const shown =
        this._translate > 0 ? 'left' : this._translate < 0 ? 'right' : 'none';
      // 重新设置按钮时应该先收起（因为刚插入的按钮是没有transform的，当然可以根据收起状态来计算，不想计算了）
      this.hide().then(() => {
        parentEl.innerHTML = '';
        this[`${_direction}Actions`] = null;
        if (actions.items && actions.items.length > 0) {
          const {
            className,
            style = 'rect',
            threshold = 40,
            disable = false,
            overshoot = false,
            overshootStartRatio = 0.75,
            overshootEndRatio = 0.95,
            clampWidthRatio = 0.85,
            items,
          } = actions;
          const actionEl = addClass(
            document.createElement('div'),
            `hjs-slideview__actions hjs-slideview__actions__${style} ${
              className || ''
            }`,
          );
          parentEl.appendChild(actionEl);
          let totalWidth = 0;
          let newItems = items.map((item, index) => {
            const { text, icon } = item;
            const wrapEl = addClass(
              document.createElement('div'),
              'hjs-slideview__action__wrap',
            );
            const itemEl = addClass(
              document.createElement('div'),
              'hjs-slideview__action',
            );
            itemEl.setAttribute('data-index', String(index));
            if (icon) {
              itemEl.appendChild(
                addClass(
                  document.createElement(getIconType(icon)),
                  'hjs-slideview__action__icon',
                ),
              );
            }
            if (text) {
              itemEl.appendChild(
                addClass(
                  document.createElement('span'),
                  'hjs-slideview__action__text',
                ),
              );
            }
            wrapEl.appendChild(itemEl);
            actionEl.appendChild(wrapEl);
            const actionItem: MergeActionItem = {
              ...item,
              wrapElement: wrapEl,
              element: itemEl,
              width: 0,
              margin: 0,
            };
            // 设置非确认时的样式和内容
            confirmStyle(style, actionItem);
            const margin = getMarginSize(itemEl);
            const width = itemEl.getBoundingClientRect().width + margin;
            totalWidth += width;
            return {
              ...actionItem,
              width,
              margin,
            };
          });
          // 按钮总宽度不能大于总内容宽度的clampWidthRatio
          const clampWidth = Math.min(
            this.elWidth * clampWidthRatio,
            totalWidth,
          );
          newItems = newItems.map((item) => {
            const { element, width, margin } = item;
            const newWidth = (clampWidth * width) / totalWidth;
            setStyle(element, { width: newWidth - margin });
            return {
              ...item,
              width: newWidth,
            };
          });
          totalWidth = clampWidth;
          const overshootStart = Math.min(
            Math.max(totalWidth, overshootStartRatio * this.elWidth),
            this.elWidth,
          );
          const overshootEnd = Math.min(
            Math.max(totalWidth, overshootEndRatio * this.elWidth),
            this.elWidth,
          );
          this[`${_direction}Actions`] = {
            style,
            disable,
            overshoot,
            overshootStart: overshootStart,
            overshootEnd: Math.max(overshootEnd, overshootStart),
            threshold: Math.min(Math.max(0, threshold), totalWidth),
            items: newItems,
            totalWidth,
          };
          if (shown !== 'none') {
            this.show(shown);
          }
        }
      });
    };
    // direction传其它，则属于无效设置
    if (direction === 'both' || direction === 'left') {
      _setActions('left');
    }
    if (direction === 'both' || direction === 'right') {
      _setActions('right');
    }
  }
  toggle(direction: Direction = 'right') {
    if (this._destory) {
      return;
    }
    return this._translate === 0 ? this.show(direction) : this.hide();
  }
  show(direction: Direction = 'right') {
    return new Promise<void>((resolve) => {
      const { contentEl, rebounce, leftActions, rightActions } = this;
      if (
        this._destory ||
        !contentEl ||
        ((!leftActions || leftActions.disable) &&
          (!rightActions || rightActions.disable))
      ) {
        resolve();
        return;
      }
      let __direction = direction;
      if (!leftActions || leftActions.disable) {
        __direction = 'right';
      }
      if (!rightActions || rightActions.disable) {
        __direction = 'left';
      }
      const actions = __direction === 'left' ? leftActions : rightActions;
      const factor = __direction === 'left' ? 1 : -1;
      const maxTranslate = !actions ? 0 : actions.totalWidth * factor;
      if (this._translate === maxTranslate) {
        resolve();
        return;
      }
      const show = (rebSize: number = 0) => {
        const translate = maxTranslate + rebSize;
        this._overshooting = false;
        this._translate = translate;
        transform.apply(this, [translate]);
        confirmCancel.apply(this, []);
        if (!rebSize) {
          onOnceTransitionEnd(contentEl, () => {
            resolve();
            if (this._direction !== __direction) {
              this.trigger('show', {
                direction: __direction,
                currentTarget: contentEl,
                timeStamp: Date.now(),
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
    return new Promise<void>((resolve) => {
      const { contentEl, leftActions, rightActions } = this;
      if (
        this._destory ||
        this._translate === 0 ||
        !contentEl ||
        ((!leftActions || leftActions.disable) &&
          (!rightActions || rightActions.disable))
      ) {
        resolve();
        return;
      }
      this._overshooting = false;
      this._translate = 0;
      transform.apply(this, [0]);
      // 在收起动画期间，连续执行隐藏方法，会主动cancel上一次transition，保证只执行最后一次
      onOnceTransitionEnd(contentEl, () => {
        resolve();
        // hide在隐藏之后再处理confirm
        confirmCancel.apply(this, []);
        if (this._direction !== 'none') {
          this.trigger('hide', {
            direction: 'none',
            currentTarget: contentEl,
            timeStamp: Date.now(),
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
    if (this._agents) {
      this._agents.destory();
      this._agents = null;
    }
    if (this.element) {
      // 删除元素，用户可以在调用该方法之前加一个删除动画
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
    this.contentEl = null;
    this.leftEl = null;
    this.rightEl = null;
    this.leftActions = null;
    this.rightActions = null;
    this._confirming = null;
    this._startPoint = null;
    this._destory = true;
  }
}

export type Direction = 'left' | 'right' | 'both' | 'none';

export type Timing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | `cubic-bezier(${number},${number},${number},${number})`;

export type ActionStyle = 'round' | 'rect';

export type Confirm = {
  direction: Direction;
  index: number;
};

type MergeActionItem = {
  wrapElement: HTMLElement; //当前按钮包装元素
  element: HTMLElement; //当前按钮元素
  width: number; // 当前按钮的宽度
  margin: number; // 当前按钮的左右margin和
} & IActionItem;

type MergeAction = {
  style: ActionStyle; // 按钮风格
  disable: boolean; // 禁用按钮
  threshold: number; // 阈值（超过这个阈值时抬起后所有按钮自动滑出，否则收起）
  overshoot: boolean; // 滑动超出(仅限最后一个按钮)
  overshootStart: number; // 超过这个尺寸时进行overshoot
  overshootEnd: number; // overshoot时直接滑动到对应尺寸
  totalWidth: number; // 所有按钮展开情况下总宽度
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
  data?: any; //按钮携带数据
};

export type IActionOption = {
  className?: string; // 按钮自定义样式
  style?: ActionStyle; // 按钮风格
  disable?: boolean; // 禁用按钮
  threshold?: number; // 阈值（超过这个阈值时抬起后所有按钮自动滑出，否则收起）
  overshoot?: boolean; // 滑动超出(仅限最后一个按钮)
  overshootStartRatio?: number; // 超过这个比例时进行overshoot
  overshootEndRatio?: number; // overshoot时直接滑动到对应的比例
  clampWidthRatio?: number; // 所有按钮展开情况下总宽度不能超过这个比例
  items?: IActionItem[]; // 按钮配置
};

export type IOption = {
  className?: string; // 滑动组件类名控制样式
  container: HTMLElement | string; // 装载滑动组件的DOM容器
  content?: HTMLElement | string; // 滑动组件的子节点
  friction?: number; // 摩擦因子(0-1的值)
  rebounce?: number; // 弹性尺寸
  duration?: number; // 滑动时动画的时间（秒级）
  timing?: Timing; // 滑动时动画的函数
  leftActions?: IActionOption;
  rightActions?: IActionOption;
};

export type IEventType =
  | 'show'
  | 'hide'
  | 'press'
  | 'longPress'
  | 'doublePress'
  | 'buttonPress'
  | 'buttonConfirm';

export type IEvent = {
  direction?: Direction; // 滑出的是哪边的按钮
  index?: number; // 点击按钮在按钮集合里的索引
  data?: any; // 按钮携带的数据
} & IBaseEvent<HTMLElement, AgentEvent | null>;

export default SlideView;
