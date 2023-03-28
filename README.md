<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-23 11:26:32
 * @Description: ******
-->
## slide-view
H5列表左右滑动操作
### 使用方法
```html
  <body>
    <h2>滑动操作示例</h2>
    <div class="slide-view-example">
      <div class="slide-view-item"></div>
    </div>
  </body>
```
```javascript

  import SlideView from '../lib';

  const container = document.querySelectorAll('.slide-view-item')[0];
  const cell = document.createElement('div');
  cell.classList.add('slide-view-cell');
  const span = document.createElement('span');
  span.innerText = '滑动操作示例';
  cell.appendChild(span);
  const item = new SlideView({
    container,
    className: 'slideview-action',
    content: cell,
    friction: 0.6,
    rebounce: 12,
    duration: 0.4,
    timing: 'ease',
    rightActions: {
      className: 'leftAction',
      style: 'rect',
      disable: false,
      threshold: 40,
      overshoot: true,
      items: [
        {
          text: '立即回复',
          color: '#fff',
          background: '#3478F3',
          confirm: {
            text: '确定回复',
          },
          collapse: false,
          data: { id: 1 },
        },
        {
          text: '设旗标',
          color: '#fff',
          background: '#F19A39',
          confirm: {
            text: '确定设旗标',
          },
          collapse: true,
          data: { id: 2 },
        },
        {
          icon: './delete.png',
          text: '删除',
          color: '#fff',
          background: '#EA4D3E',
          confirm: {
            text: '删除',
            icon: './delete-black.png',
          },
          collapse: false,
          data: { id: 3 },
        },
      ],
    },
  });
  item.on('show', (e) => {
    console.log(`item-show:${e.direction}`);
  });
  item.on('hide', () => {
    console.log('item-hide');
  });
  item.on('buttonPress', (e) => {
    console.log(`item-buttonPress: ${e.data && e.data.id}`);
    if (item.element && e.data && e.data.del) {
      const viewEl = item.element.parentNode;
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
  item.on('buttonConfirm', (e) => {
    console.log(`item-buttonConfirm: ${e.data && e.data.id}`);
  });
  item.on('press', () => {
    console.log('item-press');
  });
  item.on('longPress', () => {
    console.log('item-longPress');
  });
  item.on('doublePress', () => {
    console.log('item-doublePress');
  });

```

在线预览地址:[https://huangjs888.github.io/slide-view/](https://huangjs888.github.io/slide-view/ "预览")
