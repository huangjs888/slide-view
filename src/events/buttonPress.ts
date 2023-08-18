/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:10:02
 * @Description: ******
 */

import { type GEvent } from '@huangjs888/gesture';
import { onOnceTransitionEnd } from './index';
import { type Direction, type MergeAction, type Confirm, type IType } from '../index';
import type SlideView from '../index';
import { transform, cTransform } from '../transform';
import { overshootChange } from '../overshoot';
import { confirmStyle } from '../confirm';
import { setStyle, findTarget } from '../util';

export default function buttonPress(this: SlideView, event: GEvent, direction: Direction) {
  const { element, leftActions, rightActions, rebounce } = this;
  if (
    this._translate === 0 ||
    !element ||
    ((!leftActions || leftActions.disable) && (!rightActions || rightActions.disable))
  ) {
    return;
  }
  const { sourceEvent, currentTarget } = event;
  const target = findTarget(
    sourceEvent,
    (t) => t !== currentTarget && !t.getAttribute('data-index'),
  );
  const index = +(target.getAttribute('data-index') || -1);
  const actions: MergeAction | null = direction === 'left' ? leftActions : rightActions;
  if (index < 0 || !actions || actions.disable) {
    return;
  }
  const elWidth = this._width;
  const factor = this._translate / Math.abs(this._translate);
  const confirm: Confirm = { index, direction };
  const item = actions.items[index];
  const overshoot = index === actions.items.length - 1 && actions.overshoot;
  let eventType: IType = 'buttonPress';
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
}
