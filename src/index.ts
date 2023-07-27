/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 15:05:11
 * @Description: ******
 */
import { EventTarget } from '@huangjs888/gesture';
import { revokeDamping, performDamping } from '@huangjs888/damping';
import agent, {
  onOnceTransitionEnd,
  type AgentEvent,
  type IAgent,
} from './agent';
import {
  getIconType,
  addClass,
  removeClass,
  setStyle,
  cssInject,
  findTarget,
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
  cssInject(css);
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
  item: MergeActionItem,
  isConfirm: boolean = false,
) {
  const {
    wrapper,
    element,
    confirm = {}, // isConfirm为true,confirm必然存在
    ...rest
  } = item;
  let { text, icon, color, background, className } = rest;
  if (isConfirm) {
    // 如果icon不存在，则不存在该确认，如果icon存在，则取确认icon，若确认icon不存在，则仍然取icon
    icon = icon && (confirm.icon || icon);
    text = text && (confirm.text || text);
    color = color && (confirm.color || color);
    background = background && (confirm.background || background);
    className = className && (confirm.className || className);
  }
  setStyle(wrapper, {
    background: background || '',
    color: color || '',
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
    const iconEl = element.firstElementChild as HTMLElement;
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
    const textEl = element.lastElementChild as HTMLElement;
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
  const aTransform = ({ style, items }: MergeAction) => {
    let delta = 0;
    if (style === 'drawer') {
      delta = -this._translate;
    }
    // 前面已有按钮的占比距离
    let transformTotal = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const { wrapper, width, gap } = items[i];
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
          transformx = (width + gap[1] + transformTotal) * factor;
        }
        setStyle(wrapper, {
          transform: `translate3d(${transformx + delta}px, 0, 0)`,
          transition,
        });
      } else if (i > index) {
        let transformx = 0;
        if (translate === 0) {
          transformx = (width + gap[1] + transformTotal) * factor;
        }
        // 大于index的一定都是压在上面的，压在上面的需要收起，而小于index压在下面的不需要变化
        setStyle(wrapper, {
          transform: `translate3d(${transformx + delta}px, 0, 0)`,
          transition,
        });
      }
      transformTotal += width + gap[0] + gap[1];
    }
  };
  if (direction === 'left' && leftActions && !leftActions.disable) {
    aTransform(leftActions);
  }
  if (direction === 'right' && rightActions && !rightActions.disable) {
    aTransform(rightActions);
  }
};

const transform = function transform(
  this: SlideView,
  translate: number,
  duration: number = this.duration,
) {
  const { leftEl, rightEl, contentEl, leftActions, rightActions, timing } =
    this;
  if (
    !leftEl ||
    !rightEl ||
    !contentEl ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  let factor = 0;
  const transition = duration <= 0 ? '' : `transform ${duration}s ${timing} 0s`;
  const wTransition =
    duration <= 0
      ? ''
      : `width ${duration}s ${timing} 0s, transform ${duration}s ${timing} 0s`;
  const aTransform = ({
    style,
    items,
    element,
    width: tWidth,
    gap: tGap,
  }: MergeAction) => {
    let styleObj = {};
    let xMove = translate;
    let delta = 0;
    if (style === 'drawer') {
      setStyle(element, {
        width: Math.max(Math.abs(translate), tWidth),
        transform: `translate3d(${translate}px, 0, 0)`,
        transition: wTransition,
      });
      xMove = factor * Math.max(tWidth, Math.abs(translate));
      delta = -translate;
    }
    // 前面已有按钮的占比距离
    let transformTotal = 0;
    const len = items.length - 1;
    for (let i = len; i >= 0; i--) {
      const { wrapper, width, gap, fixedGap } = items[i];
      // 当前按钮需要滑出的占比距离
      const transformw = (width / (tWidth - tGap)) * (xMove - factor * tGap);
      const transformb = transformw + factor * gap[1];
      // 当前按钮滑出距离应该是占比距离+前面已有按钮的占比距离
      const transformx = transformb + transformTotal;
      if (fixedGap && wrapper.style.width !== '100%') {
        // 只有width不为100%时才设置具体宽度，因为overshoot的时候需要设置100%
        styleObj = {
          width: Math.max(Math.abs(transformw), width),
          transition: wTransition,
        };
      }
      // 左边或右边的最后一个按钮
      setStyle(wrapper, {
        transform: `translate3d(${
          (i === len && this._overshooting ? translate : transformx) + delta
        }px, 0, 0)`,
        transition,
        ...styleObj,
      });
      // 累计已滑出按钮的占比距离
      transformTotal += transformb + factor * gap[0];
    }
  };
  // move事件发生，放入下一帧执行（move的时候使用这个节能而且不抖动）
  window.requestAnimationFrame(() => {
    setStyle(contentEl, {
      transform: `translate3d(${translate}px, 0, 0)`,
      transition,
    });
    // 这里是左右都进行变换，还是说根据translate的正负来判断只变换某一边的呢（因为另一边处于隐藏状态无需变换耗能）？
    // 答案是都要进行变换，因为存在一种情况，即滑动太快，left的translate还未走到0（没有完全收起），下一把就right了。
    if (leftActions && !leftActions.disable) {
      factor = 1;
      aTransform(leftActions);
    }
    if (rightActions && !rightActions.disable) {
      factor = -1;
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
    if (actions && !actions.disable) {
      const item = actions.items[index];
      setStyle(item.element, {
        width: '',
      });
      confirmStyle(item);
    }
    this._confirming = null;
  }
};

const overshootChange = function (
  this: SlideView,
  actions: MergeAction | null,
) {
  if (actions && !actions.disable) {
    const item = actions.items[actions.items.length - 1];
    setStyle(item.wrapper, {
      width: this._overshooting ? '100%' : '',
    });
  }
};

const start = function start(this: SlideView, e: AgentEvent) {
  const { element, leftActions, rightActions, friction } = this;
  if (
    !element ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  // 每次start重新计算容器宽度和offsetLeft(防止屏幕变化)
  const { width, left } = element.getBoundingClientRect();
  this._width = width;
  this._offset = left;
  const { point } = e;
  this._isMoving = true;
  this._timestamp = 0;
  this._startAngle = 0;
  // 初始偏移量
  this._startOffset = this._translate;
  // 初始点
  this._startPoint = point;
  // 计算初始taranslate
  const actions =
    this._translate > 0
      ? leftActions
      : this._translate < 0
      ? rightActions
      : null;
  let startTranslate = 0;
  if (actions && !actions.disable) {
    const { overshoot, overshootFreeSize, width: tWidth } = actions;
    // 弹性尺寸临界点
    const criticalTranslate =
      ((overshoot
        ? Math.min(width, Math.max(width - overshootFreeSize, tWidth))
        : tWidth) *
        this._translate) /
      Math.abs(this._translate);
    if (Math.abs(this._translate) <= Math.abs(criticalTranslate)) {
      startTranslate = this._translate;
    } else {
      // 恢复_translate的弹性尺寸部分
      startTranslate =
        revokeDamping(this._translate - criticalTranslate, {
          expo: friction,
        }) + criticalTranslate;
    }
  }
  this._startTranslate = startTranslate;
};

const move = function move(this: SlideView, e: AgentEvent) {
  const { leftActions, rightActions, friction } = this;
  if (
    !this._isMoving ||
    !this._startPoint ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const { point: currentPoint } = e;
  const currentX = currentPoint[0] - this._startPoint[0];
  const currentY = currentPoint[1] - this._startPoint[1];
  if (this._startAngle === 0) {
    // 只在第一次移动事件的时候进行计算
    // 根据xy的长短来判断移动角度与45度的关系
    this._startAngle = Math.abs(currentX) - Math.abs(currentY) <= 0 ? -1 : 1;
  }
  // 只有角度小于45度(_startAngle为1)，才会开始移动
  // 只会在第一次触发的时候判断，后续如果移动过程中角度变化，则不会判断，会继续往下走
  // 这个判断是因为手势里默认移动距离在3px以内不算移动（手势里是移动距离，这里扩大到x方向距离）
  if (this._startAngle !== 1 || Math.abs(currentX) <= 3) {
    return;
  }
  // 滑动距离
  let translate = 0;
  let duration = 0;
  let currentTranslate = this._startTranslate + currentX;
  const actions =
    currentTranslate > 0
      ? leftActions
      : currentTranslate < 0
      ? rightActions
      : null;
  if (actions && !actions.disable) {
    const {
      overshoot,
      overshootEdgeSize,
      overshootFreeSize,
      width: tWidth,
    } = actions;
    const factor = currentTranslate / Math.abs(currentTranslate);
    const oaSize = factor * tWidth;
    const otSize =
      factor *
      Math.min(this._width, Math.max(this._width - overshootFreeSize, tWidth));
    const oeSize =
      factor * Math.min(this._width * 0.5, Math.max(0, overshootEdgeSize));
    // 可以overshoot的情况处理
    if (overshoot) {
      if (Math.abs(currentTranslate) < Math.abs(otSize)) {
        // 如果手指从容器一半之外开始移动，只要手指移动到接近边缘，就可以overshoot
        let deltaSize = 0;
        let moveEdge = false;
        const currentOffset = currentPoint[0] - this._offset;
        const startOffset =
          this._startPoint[0] - this._offset - this._startOffset;
        const maxOffset = this._width * 0.5;
        if (currentTranslate < 0) {
          deltaSize = currentOffset - Math.abs(oeSize);
          moveEdge = startOffset > maxOffset && deltaSize < 0;
        } else {
          deltaSize = currentOffset - (this._width - Math.abs(oeSize));
          moveEdge = startOffset < maxOffset && deltaSize > 0;
        }
        if (moveEdge) {
          currentTranslate = otSize + deltaSize;
          // 此时要重置初始点和初始translate
          this._startPoint = currentPoint;
          this._startTranslate = currentTranslate;
        }
      }
      const timestamp = Date.now();
      // currentTranslate和otSize一定是同正或同负，直接比较数值大小，即currentTranslate超出otSize范围
      if (Math.abs(currentTranslate) >= Math.abs(otSize)) {
        if (!this._overshooting) {
          this._timestamp = timestamp;
          this._overshooting = true;
          overshootChange.apply(this, [actions]);
          const index = actions.items.length - 1;
          const item = actions.items[index];
          if (item.confirm) {
            confirmStyle(item, true);
            this._confirming = {
              index,
              direction: factor > 0 ? 'left' : 'right',
            };
          }
        }
        translate =
          performDamping(currentTranslate - otSize, {
            expo: friction,
          }) + otSize;
        duration = Math.max(
          0,
          this.duration - (timestamp - this._timestamp) / 1000,
        );
      } else {
        if (this._overshooting) {
          this._timestamp = timestamp;
          this._overshooting = false;
          overshootChange.apply(this, [actions]);
          const index = actions.items.length - 1;
          const item = actions.items[index];
          if (item.confirm) {
            confirmStyle(item);
            this._confirming = null;
          }
        }
        translate = currentTranslate;
        duration = Math.max(
          0,
          this.duration / 2 - (timestamp - this._timestamp) / 1000,
        );
      }
    } else {
      // 不能overshoot的情况，按钮显示超出总宽度，则进行弹性尺寸
      // currentTranslate和oaSize一定是同正或同负，直接比较数值大小，即currentTranslate超出oaSize范围
      if (Math.abs(currentTranslate) >= Math.abs(oaSize)) {
        console.log(
          22,
          performDamping(currentTranslate - oaSize, {
            expo: friction,
          }),
        );
        translate =
          performDamping(currentTranslate - oaSize, {
            // max: rebounce * 2,
            expo: friction,
          }) + oaSize;
      } else {
        translate = currentTranslate;
      }
    }
    translate = Math.min(this._width, Math.max(-this._width, translate));
  } else {
    // 如果不存在或按钮被禁用，则不断更新初始点和初始translate
    this._startPoint = currentPoint;
    this._startTranslate = 0;
    translate = 0;
  }
  this._translate = translate;
  transform.apply(this, [translate, duration]);
  if (!this._overshooting) {
    confirmCancel.apply(this, []);
  }
  return;
};

const end = function end(this: SlideView, e: AgentEvent) {
  const { leftActions, rightActions } = this;
  if (
    !this._isMoving ||
    !this._startPoint ||
    this._startAngle !== 1 ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  this._isMoving = false;
  const startPoint = this._startPoint;
  const currentPoint = e.point;
  const delta = currentPoint[0] - startPoint[0];
  // 滑动距离为0（表示本身就是隐藏状态）或没有任何滑动（只是点了一下）不做任何操作
  // 这个判断是因为手势里默认移动距离在3px以内不算移动（手势里是移动距离，这里扩大到x方向距离）
  if (this._translate === 0 || Math.abs(delta) <= 3) {
    return;
  }
  const actions =
    this._translate > 0
      ? leftActions
      : this._translate < 0
      ? rightActions
      : null;
  if (actions && !actions.disable) {
    // 进行完全覆盖滑出事件
    if (this._overshooting) {
      const index = actions.items.length - 1;
      const item = actions.items[index];
      const translate =
        (this._translate * this._width) / Math.abs(this._translate);
      this._translate = translate;
      transform.apply(this, [translate]);
      this.emit(item.confirm ? 'buttonConfirm' : 'buttonPress', {
        index,
        data: item.data,
        currentTarget: item.wrapper,
        timestamp: Date.now(),
        sourceEvent: e,
      });
      return;
    }
    // 展开时，滑出的距离不足滑出阈值则不展开
    // 微信是只要往反方向滑就关闭，并且滑出之后，如果继续有弹性滑出，弹性滑出不足阈值也会关闭
    /* if (
      (this._translate > 0 && delta < 0) ||
      (this._translate < 0 && delta > 0) ||
      Math.abs(delta) < actions.threshold
    ) {
      this.hide();
      return;
    } */
    // 苹果是只有反方向滑到阈值之内才会关闭，其他不关闭
    /* if (Math.abs(this._translate) < actions.threshold) {
      this.hide();
      return;
    } */
    // 只要往反方向滑就关闭，其他不关闭
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
  const target = findTarget(
    sourceEvent,
    (t) => t !== currentTarget && t !== contentEl,
  );
  // 触发内容双按压事件
  if (target === contentEl) {
    // 收起时候则触发长按事件，未收起则收起
    if (_translate === 0) {
      this.emit('longPress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
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
  const target = findTarget(
    sourceEvent,
    (t) => t !== currentTarget && t !== contentEl,
  );
  // 触发内容双按压事件
  if (target === contentEl) {
    // 收起时候则触发双按事件，未收起则收起
    if (_translate === 0) {
      this.emit('doublePress', {
        currentTarget: contentEl,
        timestamp: Date.now(),
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
  const target = findTarget(
    sourceEvent,
    (t) =>
      t !== currentTarget && t !== contentEl && t !== leftEl && t !== rightEl,
  );
  // 触发内容元素按压事件
  if (target === contentEl) {
    // 没有使用this._direction判断，是因为该值变化是要动画结束后变化，this._translate变化是动画执行前
    // 使用this._translate判断可以保证，收起动画时点击可执行，展开动画执行时点击不可执行，this._direction正好相反
    // 收起时候则触发按压事件，未收起则收起
    if (_translate === 0) {
      this.emit('press', {
        currentTarget: contentEl,
        timestamp: Date.now(),
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
  const { element, leftActions, rightActions, rebounce } = this;
  if (
    this._translate === 0 ||
    !element ||
    ((!leftActions || leftActions.disable) &&
      (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const { sourceEvent, currentTarget } = event;
  const target = findTarget(
    sourceEvent,
    (t) => t !== currentTarget && !t.getAttribute('data-index'),
  );
  const index = +(target.getAttribute('data-index') || -1);
  const actions: MergeAction | null =
    direction === 'left' ? leftActions : rightActions;
  if (index < 0 || !actions || actions.disable) {
    return;
  }
  const elWidth = element.getBoundingClientRect().width;
  const factor = this._translate / Math.abs(this._translate);
  const confirm: Confirm = { index, direction };
  const item = actions.items[index];
  const overshoot = index === actions.items.length - 1 && actions.overshoot;
  let eventType: IEventType = 'buttonPress';
  if (
    this._confirming &&
    this._confirming.index === index &&
    this._confirming.direction === direction
  ) {
    if (overshoot) {
      confirmStyle(item);
      this._confirming = null;
    } else {
      // 点击按钮后隐藏按钮（隐藏按钮里已处理取消确认情况）
      if (item.collapse) {
        this.hide();
      } else {
        // 取消确认
        setStyle(item.element, {
          width: '',
        });
        cTransform.apply(this, [confirm]);
        confirmStyle(item);
        this._confirming = null;
      }
    }
  } else {
    if (overshoot) {
      if (!this._overshooting) {
        this._overshooting = true;
        const translate = factor * elWidth;
        this._translate = translate;
        transform.apply(this, [translate]);
        overshootChange.apply(this, [actions]);
      }
      if (item.confirm) {
        this._confirming = confirm;
        confirmStyle(item, true);
        eventType = 'buttonConfirm';
      }
    } else {
      if (item.confirm) {
        // 如果是仅有一个按钮，确认的时候宽度设置2倍变化，但是不能超过最大宽度
        let translate = this._translate;
        if (actions.items.length === 1) {
          translate = Math.min(Math.abs(2 * translate), elWidth) * factor;
        }
        // 设置回弹效果，第一个按钮没有
        if (
          rebounce > 0 &&
          index !== 0 /*  &&
          parseFloat(window.getComputedStyle(item.wrapper, null).width) ===
            elWidth */
        ) {
          onOnceTransitionEnd(item.wrapper, () => {
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
        setStyle(item.wrapper, {
          width: '',
        });
        setStyle(item.element, {
          width: Math.abs(translate),
        });
        this._confirming = confirm;
        confirmStyle(item, true);
        eventType = 'buttonConfirm';
      } else {
        // 无需确认的点击（如果collapse，就点击后隐藏按钮，否则不做任何处理）
        if (item.collapse) {
          this.hide();
        }
      }
    }
  }
  this.emit(eventType, {
    index,
    data: item.data,
    currentTarget: target,
    timestamp: Date.now(),
    sourceEvent: event,
  });
};

class SlideView extends EventTarget<IEventType, IEvent> {
  element: HTMLElement | null = null; // 滑动视图元素
  contentEl: HTMLElement | null = null; // 内容元素
  leftEl: HTMLElement | null = null; // 左按钮元素
  rightEl: HTMLElement | null = null; // 右按钮元素
  leftActions: MergeAction | null = null; // 按钮集合
  rightActions: MergeAction | null = null; // 按钮集合
  friction: number = 0.5; // 摩擦因子(0-1的值)
  rebounce: number = 12; // 弹性尺寸
  duration: number = 0.4; // 按钮滑出动画时间（秒级）
  timing: Timing = 'ease'; // 滑动时动画的函数
  _destory: boolean = false; // 是否销毁
  _direction: Direction = 'none'; // 当前展示的是哪个方向按钮
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
  _agents: IAgent | null = null;
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
  setContent(content: HTMLElement | string = '', dangerous?: boolean) {
    if (this._destory || !this.contentEl) {
      return;
    }
    // 注意XSS注入
    if (dangerous && typeof content === 'string') {
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
      this.hide().then(() => {
        // direction传其它，则属于无效设置
        if (
          this.leftActions &&
          (direction === 'both' || direction === 'left')
        ) {
          this.leftActions.disable = disable;
        }
        if (
          this.rightActions &&
          (direction === 'both' || direction === 'right')
        ) {
          this.rightActions.disable = disable;
        }
      });
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
          this.leftActions.width,
        );
      }
      if (
        this.rightActions &&
        (direction === 'both' || direction === 'right')
      ) {
        this.rightActions.threshold = Math.min(
          _threshold,
          this.rightActions.width,
        );
      }
    }
  }
  setActions(actions: IActionOption = {}, direction: Direction = 'both') {
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
        const tElement = addClass(
          document.createElement('div'),
          `hjs-slideview__actions ${className || ''}`,
        );
        parentEl.appendChild(tElement);
        let tWidth = 0;
        let tGap = 0;
        let newItems = items.map((item, index) => {
          const { gap = 0, fixedGap = false, text, icon } = item;
          const element = addClass(
            document.createElement('div'),
            'hjs-slideview__action',
          );
          element.setAttribute('data-index', String(index));
          if (icon) {
            element.appendChild(
              addClass(
                document.createElement(getIconType(icon)),
                'hjs-slideview__action__icon',
              ),
            );
          }
          if (text) {
            element.appendChild(
              addClass(
                document.createElement('span'),
                'hjs-slideview__action__text',
              ),
            );
          }
          const wrapper = addClass(
            document.createElement('div'),
            'hjs-slideview__action__wrapper',
          );
          wrapper.appendChild(element);
          tElement.appendChild(wrapper);
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
    const shown =
      this._translate > 0 ? 'left' : this._translate < 0 ? 'right' : 'none';
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
  toggle(direction: Direction = 'right') {
    return this._translate === 0 ? this.show(direction) : this.hide();
  }
  show(direction: Direction = 'right') {
    const { contentEl, rebounce, leftActions, rightActions } = this;
    if (
      this._destory ||
      !contentEl ||
      ((!leftActions || leftActions.disable) &&
        (!rightActions || rightActions.disable))
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
          overshootChange.apply(this, [
            this._translate > 0 ? leftActions : rightActions,
          ]);
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
      ((!leftActions || leftActions.disable) &&
        (!rightActions || rightActions.disable))
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
          overshootChange.apply(this, [
            this._translate > 0 ? leftActions : rightActions,
          ]);
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
    if (this._agents) {
      this._agents.destory();
      this._agents = null;
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

export type Direction = 'left' | 'right' | 'both' | 'none';

export type Timing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | `cubic-bezier(${number},${number},${number},${number})`;

export type ActionStyle = 'drawer' | 'accordion';

export type Confirm = {
  direction: Direction;
  index: number;
};

type MergeActionItem = {
  wrapper: HTMLElement; // 当前按钮包裹元素
  element: HTMLElement; // 当前按钮元素
  width: number; // 当前按钮的宽度
  gap: number[]; // 元素之间的间距
  fixedGap: boolean; //拉伸按钮时，是否固定间距
} & IActionItem;

type MergeAction = {
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
  currentTarget: HTMLElement;
  timestamp: number;
  sourceEvent: AgentEvent | null;
  direction?: Direction; // 滑出的是哪边的按钮
  index?: number; // 点击按钮在按钮集合里的索引
  data?: any; // 按钮携带的数据
};

export default SlideView;
