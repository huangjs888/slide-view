/* eslint-disable no-alert */
/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-15 16:58:56
 * @Description: ******
 */
import SlideView, {
  type SlideViewEvent,
  type SlideViewButtonOption,
} from '../src/index';
import './index.less';

let ID = 0;
let item: SlideView | null = null;
const getButtons = () => {
  const buttons: SlideViewButtonOptions[] = [];
  const form = document.querySelector('#button-form');
  if (form) {
    const formData = new FormData(form as HTMLFormElement);
    if (formData.get('left')) {
      const type = +(formData.get('leftType') || 0);
      const num = +(formData.get('leftNum') || 0);
      const slideout = formData.get('leftSlideOut');
      const confirm = formData.get('leftConfirm');
      for (let i = 0; i <= num; i++) {
        buttons.push(
          type === 1
            ? {
                position: 'left',
                className: `slide-item-${i + 1}`,
                icon: {
                  src:
                    i === 2
                      ? require('./icon/delete.png')
                      : i === 1
                      ? require('./icon/edit.png')
                      : require('./icon/set.png'),
                  className: `f f-${
                    i === 2 ? 'del' : i === 1 ? 'edit' : 'set'
                  }`,
                  width: 24,
                  height: 24,
                },
                width: 48,
                height: 48,
                background: '#fff',
                slideOut: !!slideout,
                confirm: !confirm
                  ? undefined
                  : {
                      className: `f f-${
                        i === 2 ? 'delO' : i === 1 ? 'editO' : 'setO'
                      }`,
                      src:
                        i === 2
                          ? require('./icon/delete-confirm.png')
                          : i === 1
                          ? require('./icon/edit-confirm.png')
                          : require('./icon/set-confirm.png'),
                    },
                data: { id: ++ID },
              }
            : {
                position: 'left',
                className: `slide-item-${i}`,
                color: '#fff',
                text: i === 2 ? '删除' : i === 1 ? '不显示' : '标记为已读',
                background:
                  i === 2 ? '#E75E58' : i === 1 ? '#EEA151' : '#3D83E5',
                slideOut: !!slideout,
                confirm: !confirm
                  ? undefined
                  : {
                      text:
                        i === 2
                          ? '确认确认确认确认确认确认删除'
                          : i === 1
                          ? '确认确认确认确认确认确认确认确认确认确认确认删除确认删除'
                          : '确认确认确认确认确认确认确认确认确认确认确认删除确认删除',
                    },
                data: { id: ++ID },
              },
        );
      }
    }
    if (formData.get('right')) {
      const type = +(formData.get('rightType') || 0);
      const num = +(formData.get('rightNum') || 0);
      const slideout = formData.get('rightSlideOut');
      const confirm = formData.get('rightConfirm');
      for (let i = 0; i <= num; i++) {
        buttons.push(
          type === 1
            ? {
                className: `slide-item-${i + 1}`,
                icon: {
                  src:
                    i === 2
                      ? require('./icon/delete.png')
                      : i === 1
                      ? require('./icon/edit.png')
                      : require('./icon/set.png'),
                  className: `f f-${
                    i === 2 ? 'del' : i === 1 ? 'edit' : 'set'
                  }`,
                  width: 24,
                  height: 24,
                },
                width: 48,
                height: 48,
                background: '#fff',
                slideOut: !!slideout,
                confirm: !confirm
                  ? undefined
                  : {
                      className: `f f-${
                        i === 2 ? 'delO' : i === 1 ? 'editO' : 'setO'
                      }`,
                      src:
                        i === 2
                          ? require('./icon/delete-confirm.png')
                          : i === 1
                          ? require('./icon/edit-confirm.png')
                          : require('./icon/set-confirm.png'),
                    },
                data: { id: ++ID },
              }
            : {
                className: `slide-item-${i}`,
                color: '#fff',
                text: i === 2 ? '删除' : i === 1 ? '不显示' : '标记为已读',
                background:
                  i === 2 ? '#E75E58' : i === 1 ? '#EEA151' : '#3D83E5',
                slideOut: !!slideout,
                confirm: !confirm
                  ? undefined
                  : {
                      text:
                        i === 2
                          ? '确认删除？'
                          : i === 1
                          ? '确认不显示？'
                          : '确认标为已读？',
                    },
                data: { id: ++ID, del: i === 2 },
              },
        );
      }
    }
  }
  return buttons;
};
const getContent = () => {
  const input = document.querySelector('#input') as HTMLInputElement;
  const cell = document.createElement('div');
  cell.classList.add('slide-view-cell');
  const span = document.createElement('span');
  span.innerText = input.value;
  cell.appendChild(span);
  return cell;
};
const create = document.querySelector('#create');
if (create) {
  create.addEventListener('click', () => {
    if (item) {
      item.destory();
      item = null;
    }
    const container = document.querySelectorAll('.slide-view-item')[1];
    const cell = document.createElement('div');
    cell.classList.add('slide-view-cell');
    const span = document.createElement('span');
    span.innerText = '滑动菜单示例';
    cell.appendChild(span);
    item = new SlideView({
      container: container as HTMLElement,
      className: 'slide-item-0',
      content: getContent(),
      buttons: getButtons(),
      disable: !!(disable?.firstChild as HTMLInputElement).checked,
      rebounce: !!(rebounce?.firstChild as HTMLInputElement).checked,
      fullSlide: !!(fullSlide?.firstChild as HTMLInputElement).checked,
      duration: +(duration?.previousSibling as HTMLInputElement).value,
      throttle: +(throttle?.previousSibling as HTMLInputElement).value,
    });
    const info = document.querySelector('#info') as HTMLElement;
    item.on('show', (e) => {
      info.innerHTML = `item-show:${e.shown}`;
      console.log(info.innerHTML);
    });
    item.on('hide', () => {
      info.innerHTML = 'item-hide';
      console.log(info.innerHTML);
    });
    item.on('buttonPress', (e: SlideViewEvent) => {
      info.innerHTML = 'item-buttonPress';
      if (item && e.data?.del) {
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
  });
}
const button = document.querySelector('#button');
if (button) {
  button.addEventListener('click', () => {
    if (!item) {
      window.alert('请先创建item...');
      return;
    }
    const buttons = getButtons();
    item.setButtons(buttons);
  });
}
const showRight = document.querySelector('#show-right');
if (showRight) {
  showRight.addEventListener('click', () => {
    if (!item) {
      return;
    }
    item.showButton('right');
  });
}
const showLeft = document.querySelector('#show-left');
if (showLeft) {
  showLeft.addEventListener('click', () => {
    if (!item) {
      return;
    }
    item.showButton('left');
  });
}
const hide = document.querySelector('#hide');
if (hide) {
  hide.addEventListener('click', () => {
    if (!item) {
      return;
    }
    item.hideButton();
  });
}
const fullSlide = document.querySelector('#fullSlide');
if (fullSlide) {
  fullSlide.addEventListener('click', (e) => {
    if (e.target === fullSlide.firstChild) {
      if (!item) {
        return;
      }
      item.setFullSlide(!!(fullSlide.firstChild as HTMLInputElement).checked);
    }
  });
}
const disable = document.querySelector('#disable');
if (disable) {
  disable.addEventListener('click', (e) => {
    if (e.target === disable.firstChild) {
      if (!item) {
        return;
      }
      item.setDisable(!!(disable.firstChild as HTMLInputElement).checked);
    }
  });
}
const rebounce = document.querySelector('#rebounce');
if (rebounce) {
  rebounce.addEventListener('click', (e) => {
    if (e.target === rebounce.firstChild) {
      if (!item) {
        return;
      }
      item.setRebounce(!!(rebounce.firstChild as HTMLInputElement).checked);
    }
  });
}
const throttle = document.querySelector('#throttle');
if (throttle) {
  throttle.addEventListener('click', () => {
    if (!item) {
      return;
    }
    const input = throttle.previousSibling as HTMLInputElement;
    item.setThrottle(+input.value);
  });
}
const duration = document.querySelector('#duration');
if (duration) {
  duration.addEventListener('click', () => {
    if (!item) {
      return;
    }
    const input = duration.previousSibling as HTMLInputElement;
    item.setDuration(+input.value);
  });
}
const content = document.querySelector('#content');
if (content) {
  content.addEventListener('click', () => {
    if (!item) {
      return;
    }
    item.setContent(getContent());
  });
}
const destory = document.querySelector('#destory');
if (destory) {
  destory.addEventListener('click', () => {
    if (!item) {
      return;
    }
    item.destory();
    item = null;
  });
}

const item2 = new SlideView({
  container: document.querySelectorAll('.slide-view-item')[0] as HTMLElement,
  className: 'test',
  content: '<div class="slide-view-cell"><span>滑动菜单示例OK</span></div>',
  buttonFull: true,
  buttons: [
    {
      confirm: {
        color: '#000',
        background: 'red',
        className: 'ttt',
        text: '确认标记为已读？',
        icon: require('./icon/delete-confirm.png'),
      },
      //text: '标记为已读',
      icon: require('./icon/delete.png'),
      color: '#fff',
      background: '#3D83E5',
      className: 'kkk',
      position: 'right',
      collapse: false,
      data: { id: -1 },
    },
    {
      confirm: {
        text: '确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示确认不显示',
        icon: require('./icon/delete-confirm.png'),
      },
      //text: '不显示',
      icon: require('./icon/delete.png'),
      color: '#fff',
      background: '#EEA151',
      className: 'kkk',
      position: 'right',
      collapse: false,
      data: { id: -1 },
    },
    {
      confirm: {
        text: '确认删除',
        icon: require('./icon/delete-confirm.png'),
      },
      //text: '删除',
      icon: require('./icon/delete.png'),
      color: '#fff',
      background: '#E75E58',
      className: 'kkk',
      position: 'right',
      collapse: true,
      data: { id: -1 },
    },
  ],
});
item2.on('buttonPress', (e: SlideViewEvent) => {
  if (e.data?.del) {
    const viewEl = item2.element.parentNode as HTMLElement;
    viewEl.style.opacity = '0';
    viewEl.style.transition = 'opacity 0.8s';
    setTimeout(() => {
      item2.destory();
    }, 800);
  }
});
item2.on('press', () => {
  item2.element.classList.add('active');
  location.href = '/';
});
