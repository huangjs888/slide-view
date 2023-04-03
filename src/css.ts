/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-03 11:02:14
 * @Description: ******
 */
export default `
.hjs-slideview {
  position: relative;
  overflow: hidden;
}
.hjs-slideview__content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
}
.hjs-slideview__left,
.hjs-slideview__right,
.hjs-slideview__actions,
.hjs-slideview__action__outer,
.hjs-slideview__action__inner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.hjs-slideview__left {
  right: 100%;
  left: auto;
}
.hjs-slideview__right {
  right: auto;
  left: 100%;
}
.hjs-slideview__left .hjs-slideview__action__outer {
  right: 0;
  left: auto;
}
.hjs-slideview__right .hjs-slideview__action__outer {
  right: auto;
  left: 0;
}
.hjs-slideview__left .hjs-slideview__action__inner {
  justify-content: flex-end;
}
.hjs-slideview__right .hjs-slideview__action__inner {
  justify-content: flex-start;
}

.hjs-slideview__actions__round .hjs-slideview__action__inner {
  padding: 10px 0;
}
.hjs-slideview__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: auto;
  max-width: 100%;
  height: 100%;
  padding: 0 20px;
  cursor: pointer;
}
.hjs-slideview__actions__round .hjs-slideview__action {
  flex-direction: row;
  margin: 0 10px;
  padding: 0 10px;
  border-radius: 22px;
  box-shadow: 0px 0px 9px -2px transparent;
}
.hjs-slideview__action__icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
}
.hjs-slideview__action__text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hjs-slideview__actions__rect .hjs-slideview__action__text {
  width: 100%;
  text-align: center;
}
`;
