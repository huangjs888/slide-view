/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-16 16:01:23
 * @Description: ******
 */

import { Gesture } from '@huangjs888/gesture';
import longTap from './longTap';
import tap from './tap';
import doubleTap from './doubleTap';
import pointerStart from './pointerStart';
import pointerMove from './pointerMove';
import pointerEnd from './pointerEnd';
import type SlideView from '../slideview';

export function bindGesture(this: SlideView, element: HTMLElement) {
  // 绑定手势
  const gesture = new Gesture(element);
  gesture.on('pointerStart', pointerStart.bind(this));
  gesture.on('pointerMove', pointerMove.bind(this));
  gesture.on('pointerEnd', pointerEnd.bind(this));
  gesture.on('tap', tap.bind(this));
  gesture.on('longTap', longTap.bind(this));
  gesture.on('doubleTap', doubleTap.bind(this));
  return gesture;
}

/*
  1、如果在一个事件循环内多次设置transition，只会执行性最后一次，前面的会忽略。如果在多次串联（不同的事件循环内）设置transition时，如果属性和值都无任何变化，则后续的设置会忽略，如果不一样，除了第一次，后续的transition会保留上次动画最后一帧（下次动画也从该帧开始）的结果与新设置的动画值比较，相同则不执行动画，不同则执行动画（且从），而不是每次动画都与初始节点比较，初始节点执行。

  2、delay这个参数注意：正值，等待delay秒之后，从初始开始执行动画，到结束，花费duration时间。负值，无等待立马执行，从中间某节点开始执行动画，到结束位置，花费duration去掉delay负数的时间。其中中间某节点就是如果按照正常执行时用掉delay时间所应该到达的节点处。

  3、如果在一个固定时间内需要不停的改变transition属性值，直到时间用完变成无transition，此时可以在每次动画时算出与第一次动画开始时的时间差，然后用这个固定时间减去时间差，设置在当前动画的duration上，直到为0时去掉transition即可（这样做动画会连贯丝滑）。

  4、一些属性可以设置百分比或者不设置值（'','none','auto'）等，而不是具体的数值的时候，此时设置transition，并不会发生动画（比如宽度从auto到100px是瞬间到达），可以在设置transition之前先设一个具体值，比如0或1，但是，这里注意，需要把设置transition的语句放在下一个事件循环（比如setTimeout）内，但最好的是放在requestAnimationFrame，或者在语句之前调用一次布局信息（比如获取宽度值），其实就是强迫浏览器重绘：浏览器通常还会在两种情况下会产生样式变更事件，一是满足屏幕刷新频率（requestAnimationFrame），二是当 JS 脚本需要获取最新的样式布局信息时。这种情况也适用于对隐藏的元素进行动画，动画后再隐藏，可以监听transitionend，在事件内隐藏。
  https://blog.csdn.net/weixin_45189747/article/details/97790805
  http://aihongxin.com/6652.html

  5、 实现串联动画：使用animation，定义好需要的动画，想怎么玩怎么玩，缺点是无法动态设置值，如果需要动态设置值，只能用js动态添加、修改css3的@keyframes。使用transition，监听transitionend，在事件内再执行新动画，缺点是动画复杂，事件串联复杂，并且要做好判断，绑定、解绑，防止事件重复执行，或者无法串联执行，另外cancel后不会再执行。使用transitionend注意以下几点：
  https://zhuanlan.zhihu.com/p/481680437

  1、如果监听元素有多个属性都有transition，transitionend会在多个属性完成后多次触发。
  解决方法：通过注册时提供实际监控的属性值与事件触发时e.propertyName比较来控制执行哪个。

  2、如果监听元素的children也有transition，transitionend也会在children的transition完成后处触发。
  解决方法：可以通过判断e.target === element或e.currentTarget来判断是不是当前监听元素。

  3、快速连续触发设置transition事件，可以在动画未执行完触发的transitioncancel事件内解绑上一次的transitionend，保证只有当前这次的transitionend可运行，同时当前transitionend执行后也解绑当前的保证只会执行一次。
  但是存在一种概率较低的情况：过渡动画刚执行完毕（即不会触发transitioncancel），本次transitionend还没来得及触发执行（因为transitionend触发和最后一帧动画结束并不是同一事件循环），此时设置transition的方法抢先执行进来设置过渡动画，这个时候上一次的transitionend事件是无法被清掉的。
  解决方法：在每次注册transitionend时把之前已绑定transitionend事件全部清掉，同时当前transitionend执行后解绑。可以通过元素属性事件注册，而不使用addEventListener，即element.ontransitionend = ()=>{}，因为这种注册方式，永远都是替换掉上一次的事件，只有当前这一个。
*/
export function onOnceTransitionEnd(
  ele: HTMLElement,
  transitionEnd: (e: TransitionEvent) => void,
  propertyName: string = 'transform',
) {
  if (ele) {
    ele.ontransitionend = (e: TransitionEvent) => {
      // 阻止冒泡及后续事件触发
      e.stopImmediatePropagation();
      // 只有触发事件的目标元素与绑定的目标元素一致，同时触发事件的属性与需要的属性相同，才会执行事件并解绑
      if (e.target === ele && e.propertyName === propertyName) {
        ele.ontransitionend = null;
        transitionEnd(e);
      }
    };
  }
  return ele;
}
