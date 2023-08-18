/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 16:03:00
 * @Description: ******
 */
import SlideView, { type Timing, type IEvent, type IActionOption } from '../src/index';
import './index.less';

let ID = 0;
let item: SlideView | null = null;
const container = document.querySelectorAll('.slide-view-item')[0] as HTMLElement;
const form = document.querySelector('#actions-form') as HTMLFormElement;
const info = document.querySelector('#info') as HTMLElement;
const create = document.querySelector('#create') as HTMLElement;
const destory = document.querySelector('#destory') as HTMLElement;
const actions = document.querySelector('#actions') as HTMLElement;
const showLeft = document.querySelector('#show-left') as HTMLElement;
const showRight = document.querySelector('#show-right') as HTMLElement;
const hide = document.querySelector('#hide') as HTMLElement;
const content = document.querySelector('#content') as HTMLElement;
const inputContent = document.querySelector('#input-content') as HTMLInputElement;
const rebounce = document.querySelector('#rebounce') as HTMLElement;
const inputRebounce = document.querySelector('#input-rebounce') as HTMLInputElement;
const friction = document.querySelector('#friction') as HTMLElement;
const inputFriction = document.querySelector('#input-friction') as HTMLInputElement;
const duration = document.querySelector('#duration') as HTMLElement;
const inputDuration = document.querySelector('#input-duration') as HTMLInputElement;
const timing = document.querySelector('#timing') as HTMLElement;
const inputTiming = document.querySelector('#input-timing') as HTMLSelectElement;
const leftDisable = document.querySelector('#leftDisable') as HTMLElement;
const inputLeftDisable = document.querySelector('#input-leftDisable') as HTMLInputElement;
const leftThreshold = document.querySelector('#leftThreshold') as HTMLElement;
const inputLeftThreshold = document.querySelector('#input-leftThreshold') as HTMLInputElement;
const leftOvershoot = document.querySelector('#leftOvershoot') as HTMLElement;
const inputLeftOvershoot = document.querySelector('#input-leftOvershoot') as HTMLInputElement;
const rightDisable = document.querySelector('#rightDisable') as HTMLElement;
const inputRightDisable = document.querySelector('#input-rightDisable') as HTMLInputElement;
const rightThreshold = document.querySelector('#rightThreshold') as HTMLElement;
const inputRightThreshold = document.querySelector('#input-rightThreshold') as HTMLInputElement;
const rightOvershoot = document.querySelector('#rightOvershoot') as HTMLElement;
const inputRightOvershoot = document.querySelector('#input-rightOvershoot') as HTMLInputElement;
const bgMap = ['#EA4D3E', '#F19A39', '#3478F3'];
const bgConfirmMap = ['#C7C6CB', '#C7C6CB', '#C7C6CB'];
const textMap = ['删除', '设旗标', '立即回复'];
const textConfirmMap = ['确定删除', '确定设旗标', '确定回复'];
const iconMap = [
  require('./icon/delete.png'),
  require('./icon/flag.png'),
  require('./icon/reply.png'),
];
const iconConfirmMap = [
  require('./icon/delete-confirm.png'),
  require('./icon/flag-confirm.png'),
  require('./icon/reply-confirm.png'),
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
    const style = formData.get('leftStyle') || 'rect';
    const disable = !!formData.get('leftDisable');
    const threshold = +(formData.get('leftThreshold') || 0);
    const overshoot = !!formData.get('leftOvershoot');
    const overshootEdgeSize = +(formData.get('leftOvershootEdgeSize') || 0);
    const overshootFreeSize = +(formData.get('leftOvershootFreeSize') || 0);
    const items: any = [];
    for (let i = number; i > 0; i--) {
      const id = ++ID;
      items.push({
        className: `action-${id}-${i}`,
        icon: text === 1 || text === 3 ? iconMap[i - 1] : undefined,
        text: text === 2 || text === 3 ? textMap[i - 1] : undefined,
        color: '#fff',
        background: bgMap[i - 1],
        confirm:
          confirmText || confirmColor
            ? {
                className: `action-confirm-${id}-${i}`,
                icon:
                  confirmColor && (text === 1 || text === 3) ? iconConfirmMap[i - 1] : undefined,
                text: confirmText && (text === 2 || text === 3) ? textConfirmMap[i - 1] : undefined,
                color: confirmColor ? bgMap[i - 1] : undefined,
                background: confirmColor ? bgConfirmMap[i - 1] : undefined,
              }
            : undefined,
        collapse: collapse,
        gap: style === 'drawer' ? [i === 3 ? 0 : 1, i === 1 ? 0 : 1] : style === 'round' ? 10 : 0,
        fixedGap: style === 'drawer',
        data: { id, del: i === 1 && cdelete },
      });
    }
    leftActions = {
      className: `leftAction-${style}`,
      style: style === 'drawer' ? 'drawer' : 'accordion',
      disable,
      threshold,
      overshoot,
      overshootEdgeSize,
      overshootFreeSize,
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
    const style = formData.get('rightStyle') || 'rect';
    const disable = !!formData.get('rightDisable');
    const threshold = +(formData.get('rightThreshold') || 0);
    const overshoot = !!formData.get('rightOvershoot');
    const overshootEdgeSize = +(formData.get('rightOvershootEdgeSize') || 0);
    const overshootFreeSize = +(formData.get('rightOvershootFreeSize') || 0);
    const items: any = [];
    for (let i = number; i > 0; i--) {
      const id = ++ID;
      items.push({
        className: `action-${id}-${i}`,
        icon: text === 1 || text === 3 ? iconMap[i - 1] : undefined,
        text: text === 2 || text === 3 ? textMap[i - 1] : undefined,
        color: '#fff',
        background: bgMap[i - 1],
        confirm:
          confirmText || confirmColor
            ? {
                className: `action-confirm-${id}-${i}`,
                icon:
                  confirmColor && (text === 1 || text === 3) ? iconConfirmMap[i - 1] : undefined,
                text: confirmText && (text === 2 || text === 3) ? textConfirmMap[i - 1] : undefined,
                color: confirmColor ? bgMap[i - 1] : undefined,
                background: confirmColor ? bgConfirmMap[i - 1] : undefined,
              }
            : undefined,
        collapse: collapse,
        gap: style === 'drawer' ? [i === 3 ? 0 : 1, i === 1 ? 0 : 1] : style === 'round' ? 10 : 0,
        fixedGap: style === 'drawer',
        data: { id, del: i === 1 && cdelete },
      });
    }
    rightActions = {
      className: `rightAction-${style}`,
      style: style === 'drawer' ? 'drawer' : 'accordion',
      disable,
      threshold,
      overshoot,
      overshootEdgeSize,
      overshootFreeSize,
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
    ID = 0;
  }
  const as = getActions();
  item = new SlideView({
    container,
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
    info.innerHTML = `item-buttonPress: ${e.data && e.data.id}`;
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
            viewEl.style.opacity = '1';
            viewEl.style.transition = '';
          }
        };
      });
    }
  });
  item.on('buttonConfirm', (e: IEvent) => {
    info.innerHTML = `item-buttonConfirm: ${e.data && e.data.id}`;
    console.log(info.innerHTML);
  });
  item.on('press', () => {
    container.classList.add('active');
    info.innerHTML = 'item-press';
    console.log(info.innerHTML);
  });
  item.on('longPress', () => {
    container.classList.remove('active');
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
  // 如果某一个没有按钮，会删除
  item.setActions(as.left, 'left');
  item.setActions(as.right, 'right');
};
destory.onclick = () => {
  if (!item) {
    return;
  }
  item.destory();
  item = null;
  ID = 0;
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

create.click();
