/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:08:44
 * @Description: ******
 */

import { setStyle } from '@huangjs888/lightdom';
import type SlideView from './slideview';
import { type IMergeAction } from './slideview';

export const overshootChange = function (this: SlideView, actions: IMergeAction | null) {
  if (actions && !actions.disable) {
    const item = actions.items[actions.items.length - 1];
    setStyle(item.wrapper, {
      width: this._overshooting ? '100%' : '',
    });
  }
};
