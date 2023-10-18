/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-18 10:40:33
 * @Description: ******
 */

import { setStyle } from '@huangjs888/lightdom';
import type SlideView from './slideview';
import { type IMergeAction, type IConfirm } from './slideview';

export const cTransform = function cTransform(
  this: SlideView,
  confirm: IConfirm,
  translate: number = 0,
) {
  const { contentEl, leftActions, rightActions, duration, timing } = this;
  if (
    !contentEl ||
    ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const transition = duration <= 0 ? '' : `transform ${duration}s ${timing} 0s`;
  const { index, direction } = confirm;
  // 这里注意：在调用hideButton隐藏按钮之后再执行该恢复方法，_translate等于0了，所以无需再判断
  const factor = this._translate === 0 ? 0 : this._translate / Math.abs(this._translate);
  const aTransform = ({ style, items }: IMergeAction) => {
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
          transform: `translate3d(${translate !== 0 ? translate : this._translate}px, 0, 0)`,
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

export const transform = function transform(
  this: SlideView,
  translate: number,
  duration: number = this.duration,
) {
  const { leftEl, rightEl, contentEl, leftActions, rightActions, timing } = this;
  if (
    !leftEl ||
    !rightEl ||
    !contentEl ||
    ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable))
  ) {
    return;
  }
  let factor = 0;
  const transition = duration <= 0 ? '' : `transform ${duration}s ${timing} 0s`;
  const wTransition =
    duration <= 0 ? '' : `width ${duration}s ${timing} 0s, transform ${duration}s ${timing} 0s`;
  const aTransform = ({ style, items, element, width: tWidth, gap: tGap }: IMergeAction) => {
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
    this.emit('transform', {
      currentTarget: contentEl,
      timestamp: Date.now(),
      sourceEvent: null,
      data: {
        translate,
      },
    });
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
