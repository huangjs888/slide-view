/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-04 10:08:44
 * @Description: ******
 */

import { setStyle } from './util';
export const overshootChange = function overshootChange(actions) {
  if (actions && !actions.disable) {
    const item = actions.items[actions.items.length - 1];
    setStyle(item.wrapper, {
      width: this._overshooting ? '100%' : ''
    });
  }
};