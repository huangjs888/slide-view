/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-22 10:32:41
 * @Description: ******
 */
import SlideView, {
  type Timing,
  type ActionStyle,
  type IEvent,
  type IActionOption,
} from '../src/index';
import './index.less';

let ID = 0;
let item: SlideView | null = null;

const form = document.querySelector('#actions-form') as HTMLFormElement;
const info = document.querySelector('#info') as HTMLElement;
const create = document.querySelector('#create') as HTMLElement;
const destory = document.querySelector('#destory') as HTMLElement;
const actions = document.querySelector('#actions') as HTMLElement;
const showLeft = document.querySelector('#show-left') as HTMLElement;
const showRight = document.querySelector('#show-left') as HTMLElement;
const hide = document.querySelector('#hide') as HTMLElement;
const content = document.querySelector('#content') as HTMLElement;
const inputContent = document.querySelector(
  '#input-content',
) as HTMLInputElement;
const rebounce = document.querySelector('#rebounce') as HTMLElement;
const inputRebounce = document.querySelector(
  '#input-rebounce',
) as HTMLInputElement;
const friction = document.querySelector('#friction') as HTMLElement;
const inputFriction = document.querySelector(
  '#input-friction',
) as HTMLInputElement;
const duration = document.querySelector('#duration') as HTMLElement;
const inputDuration = document.querySelector(
  '#input-duration',
) as HTMLInputElement;
const timing = document.querySelector('#timing') as HTMLElement;
const inputTiming = document.querySelector(
  '#input-timing',
) as HTMLSelectElement;
const leftDisable = document.querySelector('#leftDisable') as HTMLElement;
const inputLeftDisable = document.querySelector(
  '#input-leftDisable',
) as HTMLInputElement;
const leftThreshold = document.querySelector('#leftThreshold') as HTMLElement;
const inputLeftThreshold = document.querySelector(
  '#input-leftThreshold',
) as HTMLInputElement;
const leftOvershoot = document.querySelector('#leftOvershoot') as HTMLElement;
const inputLeftOvershoot = document.querySelector(
  '#input-leftOvershoot',
) as HTMLInputElement;
const rightDisable = document.querySelector('#rightDisable') as HTMLElement;
const inputRightDisable = document.querySelector(
  '#input-rightDisable',
) as HTMLInputElement;
const rightThreshold = document.querySelector('#rightThreshold') as HTMLElement;
const inputRightThreshold = document.querySelector(
  '#input-rightThreshold',
) as HTMLInputElement;
const rightOvershoot = document.querySelector('#rightOvershoot') as HTMLElement;
const inputRightOvershoot = document.querySelector(
  '#input-rightOvershoot',
) as HTMLInputElement;
const bgMap = ['#3478F3', '#F19A39', '#EA4D3E'];
const bgConfirmMap = ['#3478F3', '#F19A39', '#EA4D3E'];
const textMap = ['标记已读', '不显示', '删除'];
const textConfirmMap = ['确定标记', '确定不显示', '确定删除'];
const iconMap = [
  require('./icon/set.png'),
  require('./icon/edit.png'),
  require('./icon/delete.png'),
];
const iconConfirmMap = [
  require('./icon/set-confirm.png'),
  require('./icon/edit-confirm.png'),
  require('./icon/delete-confirm.png'),
];
const getActions = (): {
  left?: IActionOption;
  right?: IActionOption;
} => {
  const formData = new FormData(form);
  let leftActions: IActionOption | undefined;
  if (formData.get('left')) {
    const cdelete = !!formData.get('leftDelete');
    const collapse = !!formData.get('leftCollapse');
    const number = +(formData.get('leftNum') || 1);
    const text = +(formData.get('leftText') || 3);
    const confirmText = !!formData.get('leftConfirmText');
    const confirmColor = !!formData.get('leftConfirmColor');
    const confirmBg = !!formData.get('leftConfirmBg');
    const style = (formData.get('leftStyle') || 'rect') as ActionStyle;
    const disable = !!formData.get('leftDisable');
    const threshold = +(formData.get('leftThreshold') || 0);
    const overshoot = !!formData.get('leftOvershoot');
    const overshootStartRatio = +(formData.get('leftOvershootStartRatio') || 0);
    const overshootEndRatio = +(formData.get('leftOvershootEndRatio') || 0);
    const clampWidthRatio = +(formData.get('leftClampWidthRatio') || 0);
    const items = [];
    for (let i = 1; i <= number; i++) {
      const id = ++ID;
      items.push({
        className: `action-${id}-${i}`,
        icon: text === 1 || text === 3 ? iconMap[i] : undefined,
        text: text === 2 || text === 3 ? textMap[i] : undefined,
        color: '#fff',
        background: bgMap[i],
        confirm:
          confirmText || confirmColor || confirmBg
            ? {
                className: `action-confirm-${id}-${i}`,
                icon:
                  confirmText && (text === 1 || text === 3)
                    ? iconConfirmMap[i]
                    : undefined,
                text:
                  confirmText && (text === 2 || text === 3)
                    ? textConfirmMap[i]
                    : undefined,
                color: confirmColor ? '#2C2C2C' : undefined,
                background: confirmBg ? bgConfirmMap[i] : undefined,
              }
            : undefined,
        collapse: collapse,
        data: { id, del: i === number && cdelete },
      });
    }
    leftActions = {
      className: 'leftAction',
      style: style,
      disable: disable,
      threshold: threshold,
      overshoot: overshoot,
      overshootStartRatio: overshootStartRatio,
      overshootEndRatio: overshootEndRatio,
      clampWidthRatio: clampWidthRatio,
      items,
    };
  }
  let rightActions: IActionOption | undefined;
  if (formData.get('right')) {
    const cdelete = !!formData.get('rightDelete');
    const collapse = !!formData.get('rightCollapse');
    const number = +(formData.get('rightNum') || 1);
    const text = +(formData.get('rightText') || 3);
    const confirmText = !!formData.get('rightConfirmText');
    const confirmColor = !!formData.get('rightConfirmColor');
    const confirmBg = !!formData.get('rightConfirmBg');
    const style = (formData.get('rightStyle') || 'rect') as ActionStyle;
    const disable = !!formData.get('rightDisable');
    const threshold = +(formData.get('rightThreshold') || 0);
    const overshoot = !!formData.get('rightOvershoot');
    const overshootStartRatio = +(
      formData.get('rightOvershootStartRatio') || 0
    );
    const overshootEndRatio = +(formData.get('rightOvershootEndRatio') || 0);
    const clampWidthRatio = +(formData.get('rightClampWidthRatio') || 0);
    const items = [];
    for (let i = 1; i <= number; i++) {
      const id = ++ID;
      items.push({
        className: `action-${id}-${i}`,
        icon: text === 1 || text === 3 ? iconMap[i] : undefined,
        text: text === 2 || text === 3 ? textMap[i] : undefined,
        color: '#fff',
        background: bgMap[i],
        confirm:
          confirmText || confirmColor || confirmBg
            ? {
                className: `action-confirm-${id}-${i}`,
                icon:
                  confirmText && (text === 1 || text === 3)
                    ? iconConfirmMap[i]
                    : undefined,
                text:
                  confirmText && (text === 2 || text === 3)
                    ? textConfirmMap[i]
                    : undefined,
                color: confirmColor ? '#2C2C2C' : undefined,
                background: confirmBg ? bgConfirmMap[i] : undefined,
              }
            : undefined,
        collapse: collapse,
        data: { id, del: i === number && cdelete },
      });
    }
    rightActions = {
      className: 'rightAction',
      style: style,
      disable: disable,
      threshold: threshold,
      overshoot: overshoot,
      overshootStartRatio: overshootStartRatio,
      overshootEndRatio: overshootEndRatio,
      clampWidthRatio: clampWidthRatio,
      items,
    };
  }
  return { left: leftActions, right: rightActions };
};
const getContent = (): HTMLElement => {
  const cell = document.createElement('div');
  cell.classList.add('slide-view-cell');
  const span = document.createElement('span');
  span.innerText = inputContent.value;
  cell.appendChild(span);
  return cell;
};

create.onclick = () => {
  if (item) {
    item.destory();
    item = null;
  }
  const as = getActions();
  item = new SlideView({
    container: document.querySelectorAll('.slide-view-item')[0] as HTMLElement,
    className: 'slideview-action',
    content: getContent(),
    friction: +inputFriction.value,
    rebounce: +inputRebounce.value,
    duration: +inputDuration.value,
    timing: inputTiming.value as Timing,
    leftActions: as.left,
    rightActions: as.right,
  });
  item.on('show', (e) => {
    info.innerHTML = `item-show:${e.direction}`;
    console.log(info.innerHTML);
  });
  item.on('hide', () => {
    info.innerHTML = 'item-hide';
    console.log(info.innerHTML);
  });
  item.on('buttonPress', (e: IEvent) => {
    info.innerHTML = 'item-buttonPress';
    if (item && item.element && e.data && e.data.del) {
      const viewEl = item.element.parentNode as HTMLElement;
      viewEl.style.opacity = '1';
      window.requestAnimationFrame(() => {
        viewEl.style.opacity = '0';
        viewEl.style.transition = 'opacity 0.8s';
        viewEl.ontransitionend = (ee) => {
          if (ee.target === viewEl && ee.propertyName === 'opacity') {
            viewEl.ontransitionend = null;
            item && item.destory();
          }
        };
      });
    }
  });
  item.on('buttonConfirm', () => {
    info.innerHTML = 'item-buttonConfirm';
    console.log(info.innerHTML);
  });
  item.on('press', () => {
    info.innerHTML = 'item-press';
    console.log(info.innerHTML);
  });
  item.on('longPress', () => {
    info.innerHTML = 'item-longPress';
    console.log(info.innerHTML);
  });
  item.on('doublePress', () => {
    info.innerHTML = 'item-doublePress';
    console.log(info.innerHTML);
  });
};
actions.onclick = () => {
  if (!item) {
    return;
  }
  const as = getActions();
  if (as.left) {
    item.setActions(as.left);
  }
  if (as.right) {
    item.setActions(as.right);
  }
};
destory.onclick = () => {
  if (!item) {
    return;
  }
  item.destory();
  item = null;
};
content.onclick = () => {
  if (!item) {
    return;
  }
  item.setContent(getContent());
};
rebounce.onclick = () => {
  if (!item) {
    return;
  }
  item.setRebounce(+inputRebounce.value);
};
friction.onclick = () => {
  if (!item) {
    return;
  }
  item.setFriction(+inputFriction.value);
};
duration.onclick = () => {
  if (!item) {
    return;
  }
  item.setDuration(+inputDuration.value);
};
timing.onclick = () => {
  if (!item) {
    return;
  }
  item.setTiming(inputTiming.value as Timing);
};
leftThreshold.onclick = () => {
  if (!item) {
    return;
  }
  item.setThreshold(+inputLeftThreshold.value, 'left');
};
rightThreshold.onclick = () => {
  if (!item) {
    return;
  }
  item.setThreshold(+inputRightThreshold.value, 'right');
};
leftDisable.onclick = () => {
  if (!item) {
    return;
  }
  item.setDisable(inputLeftDisable.checked, 'left');
};
rightDisable.onclick = () => {
  if (!item) {
    return;
  }
  item.setDisable(inputRightDisable.checked, 'right');
};
leftOvershoot.onclick = () => {
  if (!item) {
    return;
  }
  item.setOvershoot(inputLeftOvershoot.checked, 'left');
};
rightOvershoot.onclick = () => {
  if (!item) {
    return;
  }
  item.setOvershoot(inputRightOvershoot.checked, 'right');
};
showLeft.onclick = () => {
  if (!item) {
    return;
  }
  item.show('left');
};
showRight.onclick = () => {
  if (!item) {
    return;
  }
  item.show('right');
};
hide.onclick = () => {
  if (!item) {
    return;
  }
  item.hide();
};
