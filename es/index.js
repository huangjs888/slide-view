function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 16:00:29
 * @Description: ******
 */
import { EventTarget } from '@huangjs888/gesture';
import bindGesture, { onOnceTransitionEnd } from './events';
import generateEl from './dom';
import { transform } from './transform';
import { overshootChange } from './overshoot';
import { confirmStyle, confirmCancel } from './confirm';
import { getIconType, addClass } from './util';
class SlideView extends EventTarget {
  constructor(options) {
    super();
    this.element = null;
    // 滑动视图元素
    this.contentEl = null;
    // 内容元素
    this.leftEl = null;
    // 左按钮元素
    this.rightEl = null;
    // 右按钮元素
    this.leftActions = null;
    // 按钮集合
    this.rightActions = null;
    // 按钮集合
    this.friction = 0.5;
    // 摩擦因子(0-1的值)
    this.rebounce = 12;
    // 弹性尺寸
    this.duration = 0.4;
    // 按钮滑出动画时间（秒级）
    this.timing = 'ease';
    // 滑动时动画的函数
    this._destory = false;
    // 是否销毁
    this._direction = 'none';
    // 当前展示的是哪个方向按钮
    this._confirming = null;
    // 当前正在确认的按钮
    this._overshooting = false;
    // 当前是否处于overshoot状态
    this._translate = 0;
    // 元素当前位移值
    this._width = 0;
    // 视图宽度
    this._offset = 0;
    // 手指放上后滑动视图元素距离屏幕左边距离即offsetLeft
    this._startOffset = 0;
    // 手指放上那一刻，translate值
    this._startTranslate = 0;
    // 手指放上那一刻，translate未经rebounceSize的值
    this._startPoint = null;
    // 手指放上后初始点
    this._startAngle = 0;
    // 移动时的角度与45度的关系
    this._timestamp = 0;
    // 移动时的时间戳
    this._isMoving = false;
    // 是否正在滑动
    this._gesture = null;
    this._removeResize = null;
    const {
      className,
      container,
      content,
      friction,
      rebounce,
      duration,
      timing,
      leftActions,
      rightActions
    } = options;
    const [element, contentEl, leftEl, rightEl] = generateEl(container, className);
    this._gesture = bindGesture.apply(this, [element]);
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
    // 浏览器窗口变化重置
    const resize = () => {
      const {
        width,
        left
      } = element.getBoundingClientRect();
      this._width = width;
      this._offset = left;
    };
    window.addEventListener('resize', resize);
    this._removeResize = () => {
      window.removeEventListener('resize', resize);
    };
    resize();
  }
  setContent(content = '', dangerous) {
    if (this._destory || !this.contentEl) {
      return;
    }
    // 注意XSS注入
    if (dangerous && typeof content === 'string') {
      this.contentEl.innerHTML = content;
      return;
    }
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
  }
  setFriction(friction = 0.5) {
    if (this._destory) {
      return;
    }
    // friction: 不传为默认值0.5，传小于0的都为0，大于1的都为1，传非数字，则属于无效设置
    if (typeof friction === 'number') {
      this.friction = Math.min(1, Math.max(0, friction));
    }
  }
  setRebounce(rebounce = 12) {
    if (this._destory) {
      return;
    }
    // rebounce: 不传为默认值12，传小于0的都为0，传非数字，则属于无效设置
    if (typeof rebounce === 'number') {
      this.rebounce = Math.max(0, rebounce);
    }
  }
  setDuration(duration = 0.4) {
    if (this._destory) {
      return;
    }
    // duration: 不传为默认值0.4，传小于0的都为0，传非数字，则属于无效设置
    if (typeof duration === 'number') {
      this.duration = Math.max(0, duration);
    }
  }
  setTiming(timing = 'ease') {
    if (this._destory) {
      return;
    }
    // timing: 不传为默认值ease
    this.timing = timing;
  }
  setDisable(disable = true, direction = 'both') {
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
  setOvershoot(overshoot = true, direction = 'both') {
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
  setThreshold(threshold = 40, direction = 'both') {
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
  setActions(actions = {}, direction = 'both') {
    if (this._destory || direction === 'none') {
      return;
    }
    // actions: 不传为默认值{}，不传，传其它，只要没有items的，都认为是删除按钮
    const _setActions = _direction => {
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
          items
        } = actions;
        const tElement = addClass(document.createElement('div'), `hjs-slideview__actions ${className || ''}`);
        parentEl.appendChild(tElement);
        let tWidth = 0;
        let tGap = 0;
        let newItems = items.map((item, index) => {
          const {
            gap = 0,
            fixedGap = false,
            text,
            icon
          } = item;
          const element = addClass(document.createElement('div'), 'hjs-slideview__action');
          element.setAttribute('data-index', String(index));
          if (icon) {
            element.appendChild(addClass(document.createElement(getIconType(icon)), 'hjs-slideview__action__icon'));
          }
          if (text) {
            element.appendChild(addClass(document.createElement('span'), 'hjs-slideview__action__text'));
          }
          const wrapper = addClass(document.createElement('div'), 'hjs-slideview__action__wrapper');
          wrapper.appendChild(element);
          tElement.appendChild(wrapper);
          const tItem = _extends({}, item, {
            wrapper,
            element,
            width: 0,
            gap: [0, 0],
            fixedGap
          });
          // 设置非确认时的样式和内容
          confirmStyle(tItem);
          const {
            width
          } = element.getBoundingClientRect();
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
          return _extends({}, tItem, {
            gap: [leftGap, rightGap],
            fixedGap: leftGap === 0 && rightGap === 0 ? false : fixedGap,
            // 左右gap都为0的情况，gudinggap无意义
            width
          });
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
          items: newItems
        };
      }
    };
    const _setActionsAfterCollapse = _direction => {
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
  toggle(direction = 'right') {
    return this._translate === 0 ? this.show(direction) : this.hide();
  }
  show(direction = 'right') {
    const {
      contentEl,
      rebounce,
      leftActions,
      rightActions
    } = this;
    if (this._destory || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
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
      const show = (rebSize = 0) => {
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
                sourceEvent: null
              });
              this._direction = __direction;
            }
          });
        }
      };
      // 设置回弹效果并且已滑动宽度小于最大宽度时才有弹性效果
      if (rebounce > 0 && (maxTranslate > 0 && this._translate < maxTranslate || maxTranslate < 0 && this._translate > maxTranslate)) {
        onOnceTransitionEnd(contentEl, () => show());
        show(rebounce * factor);
      } else {
        show();
      }
    });
  }
  hide() {
    const {
      contentEl,
      leftActions,
      rightActions
    } = this;
    if (this._destory || this._translate === 0 || !contentEl || (!leftActions || leftActions.disable) && (!rightActions || rightActions.disable)) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
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
            sourceEvent: null
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
    if (this._gesture) {
      this._gesture.destory();
      this._gesture = null;
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
export default SlideView;