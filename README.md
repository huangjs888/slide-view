<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-20 10:49:03
 * @Description: ******
-->
## slide-view
H5列表左右滑动操作
### 使用方法
```html
  <body>
    <h2>左滑删除示例</h2>
    <div class="slide-view-example">
      <div class="slide-view-item"></div>
      <div class="slide-view-item"></div>
    </div>
    <div class="operate">
      <button id="show">Show First</button>
      <button id="hide">Hide First</button>
      <button id="toggle">Toggle Second</button>
      <button id="setDisable">setDisable</button>
      <button id="setRebounce">setRebounce</button>
      <button id="setThrottle">setThrottle</button>
      <button id="setDuration">setDuration</button>
      <button id="setContent">setContent</button>
      <button id="setButtons">setButtons</button>
      <button id="destory">destory</button>
    </div>
  </body>
```
```javascript
import SlideView from '../lib';
import './index.less';

const container = document.querySelectorAll('.slide-view-item');
const cell = document.createElement('div');
cell.classList.add('slide-view-cell');
const span = document.createElement('span');
span.innerText = '左滑菜单（text）';
cell.appendChild(span);
const item = new SlideView({
  container: container[0],
  className: 'AAA',
  content: cell,
  buttons: [
    {
      className: 'bbb',
      text: '标记为已读',
      color: '#fff',
      background: '#3D83E5',
      data: { id: 1 },
    },
    {
      text: '不显示',
      color: '#fff',
      background: '#EEA151',
      data: { id: 2 },
    },
    {
      className: 'ccc',
      text: '删除',
      color: '#fff',
      background: '#E75E58',
      data: { id: 3 },
    },
  ],
});
const cell2 = document.createElement('div');
cell2.classList.add('slide-view-cell');
const span2 = document.createElement('span');
span2.innerText = '左滑菜单（image）';
cell2.appendChild(span2);
const item2 = new SlideView({
  container: container[1],
  className: 'BBB',
  content: cell2,
  buttons: [
    {
      icon: {
        src: require('./icon/edit.png'),
        className: 'f f-ta',
        width: 24,
        height: 24,
      },
      width: 48,
      height: 48,
      color: 'red',
      background: '#fff',
      data: { id: 4 },
    },
    {
      icon: {
        src: require('./icon/delete.png'),
        className: 'f f-ba',
        width: 24,
        height: 24,
      },
      width: 48,
      height: 48,
      color: 'black',
      background: '#fff',
      data: { id: 5 },
    },
  ],
});
const show = document.querySelector('#show');
if (show) {
  show.addEventListener('click', () => item.showButton());
}
const hide = document.querySelector('#hide');
if (hide) {
  hide.addEventListener('click', () => item.hideButton());
}
const toggle = document.querySelector('#toggle');
if (toggle) {
  toggle.addEventListener('click', () => item2.toggleButton());
}
const setDisable = document.querySelector('#setDisable');
if (setDisable) {
  setDisable.addEventListener('click', () => {
    item.setDisable(!item.disable);
    item2.setDisable(!item2.disable);
  });
}
const setRebounce = document.querySelector('#setRebounce');
if (setRebounce) {
  setRebounce.addEventListener('click', () => {
    item.setRebounce(!item.rebounce);
    item2.setRebounce(!item2.rebounce);
  });
}
const setThrottle = document.querySelector('#setThrottle');
if (setThrottle) {
  setThrottle.addEventListener('click', () => {
    item.setThrottle(item.throttle + 10);
    item2.setThrottle(item2.throttle - 10);
  });
}
const setDuration = document.querySelector('#setDuration');
if (setDuration) {
  setDuration.addEventListener('click', () => {
    item.setDuration(item.duration * 1000 + 100);
    item2.setDuration(item2.duration * 1000 - 100);
  });
}
const setContent = document.querySelector('#setContent');
if (setContent) {
  setContent.addEventListener('click', () => {
    const newCell = document.createElement('div');
    newCell.classList.add('slide-view-cell');
    const newSpan = document.createElement('span');
    newSpan.innerText = '左滑菜单（image）';
    newCell.appendChild(newSpan);
    item.setContent(newCell);
    const newCell2 = document.createElement('div');
    newCell2.classList.add('slide-view-cell');
    const newSpan2 = document.createElement('span');
    newSpan2.innerText = '左滑菜单（text）';
    newCell2.appendChild(newSpan2);
    item2.setContent(newCell2);
  });
}
const setButtons = document.querySelector('#setButtons');
if (setButtons) {
  setButtons.addEventListener('click', () => {
    item.setButtons([
      {
        icon: {
          src: require('./icon/edit.png'),
          className: 'f f-ta',
          width: 24,
          height: 24,
        },
        width: 48,
        height: 48,
        color: 'red',
        background: '#fff',
        data: { id: 4 },
      },
      {
        icon: {
          src: require('./icon/delete.png'),
          className: 'f f-ba',
          width: 24,
          height: 24,
        },
        width: 48,
        height: 48,
        color: 'black',
        background: '#fff',
        data: { id: 5 },
      },
    ]);
    item2.setButtons([
      {
        className: 'bbb',
        text: '标记为已读',
        color: '#fff',
        background: '#3D83E5',
        data: { id: 1 },
      },
      {
        text: '不显示',
        color: '#fff',
        background: '#EEA151',
        data: { id: 2 },
      },
      {
        className: 'ccc',
        text: '删除',
        color: '#fff',
        background: '#E75E58',
        data: { id: 3 },
      },
    ]);
  });
}
const destory = document.querySelector('#destory');
if (destory) {
  destory.addEventListener('click', () => {
    item.destory();
    item2.destory();
  });
}
item.on('show', (e) => console.log('item-show', e));
item.on('hide', (e) => console.log('item-hide', e));
item.on('click', (e) => console.log('item-click', e));
item.on('button-click', (e) => console.log('item-button-click', e));
item2.on('show', (e) => console.log('item2-show', e));
item2.on('hide', (e) => console.log('item2-hide', e));
item2.on('click', (e) => console.log('item2-click', e));
item2.on('button-click', (e) => console.log('item2-button-click', e));

```

在线预览地址:[https://huangjs888.github.io/slide-view/](https://huangjs888.github.io/slide-view/ "预览")
