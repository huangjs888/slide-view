/*
 * @Author: Huangjs
 * @Date: 2023-08-30 11:09:21
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-13 10:27:02
 * @Description: ******
 */

import React from 'react';
import SlideView, { type IActionOption } from './SlideView';
import './app.css';

const bgMap = ['#EA4D3E', '#F19A39', '#3478F3'];
const bgConfirmMap = ['#C7C6CB', '#C7C6CB', '#C7C6CB'];
const textMap = ['删除', '设旗标', '立即回复'];
const textConfirmMap = ['确定删除', '确定设旗标', '确定回复'];
const iconMap = [
  require('../asserts/delete.png'),
  require('../asserts/flag.png'),
  require('../asserts/reply.png'),
];
const iconConfirmMap = [
  require('../asserts/delete-confirm.png'),
  require('../asserts/flag-confirm.png'),
  require('../asserts/reply-confirm.png'),
];
function App() {
  const [info, setInfo] = React.useState('');
  const [active, setActive] = React.useState(false);
  const actions: IActionOption = React.useMemo(
    () => ({
      className: 'rightAction-round',
      style: 'accordion',
      overshoot: true,
      items: [
        {
          className: 'action-0',
          icon: iconMap[2],
          text: textMap[2],
          color: '#fff',
          background: bgMap[2],
          confirm: {
            className: 'action-confirm-0',
            icon: iconConfirmMap[2],
            text: textConfirmMap[2],
            color: bgMap[2],
            background: bgConfirmMap[2],
          },
          collapse: true,
          gap: 10,
          fixedGap: false,
          data: { id: 0, name: textMap[2] },
        },
        {
          className: 'action-1',
          icon: iconMap[1],
          text: textMap[1],
          color: '#fff',
          background: bgMap[1],
          collapse: true,
          gap: 10,
          fixedGap: false,
          data: { id: 1, name: textMap[1] },
        },
        {
          className: 'action-0',
          icon: iconMap[0],
          text: textMap[0],
          color: '#fff',
          background: bgMap[0],
          confirm: {
            className: 'action-confirm-0',
            icon: iconConfirmMap[0],
            text: textConfirmMap[0],
            color: bgMap[0],
            background: bgConfirmMap[0],
          },
          collapse: true,
          gap: 10,
          fixedGap: false,
          data: { id: 2, name: textMap[0] },
        },
      ],
    }),
    [],
  );

  return (
    <div className="app">
      <h2>滑动删除示例</h2>
      <div className="slide-view-example">
        <SlideView
          className="slide-view-item"
          style={{ height: 64 }}
          rightActions={actions}
          onShow={(e) => {
            const _info = `item-show:${e.direction}`;
            setInfo(_info);
            console.log(_info);
          }}
          onHide={() => {
            const _info = 'item-hide';
            setInfo(_info);
            console.log(_info);
          }}
          onButtonPress={(e) => {
            const _info = `item-buttonPress: ${e.data && e.data.id},${e.data && e.data.name}`;
            setInfo(_info);
            console.log(_info);
          }}
          onButtonConfirm={(e) => {
            const _info = `item-buttonConfirm: ${e.data && e.data.id},${e.data && e.data.name}`;
            setInfo(_info);
            console.log(_info);
          }}>
          <div className="slide-view-cell">
            <span>这是一个滑动例子</span>
          </div>
        </SlideView>
        <SlideView
          className={`slide-view-item${active ? ' active' : ''}`}
          style={{ height: 64 }}
          leftActions={actions}
          leftOvershoot
          onPress={() => {
            setActive(true);
            const _info = 'item-press';
            setInfo(_info);
            console.log(_info);
          }}
          onLongPress={() => {
            setActive(false);
            const _info = 'item-longPress';
            setInfo(_info);
            console.log(_info);
          }}
          onDoublePress={() => {
            const _info = 'item-doublePress';
            setInfo(_info);
            console.log(_info);
          }}
          open>
          <div className="slide-view-cell">
            <span>这是另外一个滑动例子</span>
          </div>
        </SlideView>
      </div>
      <div id="info" className="item-div">
        {info}
      </div>
    </div>
  );
}

export default App;
