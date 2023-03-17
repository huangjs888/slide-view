/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-17 15:15:16
 * @Description: ******
 */
export default `
.hjs-slideview {
  position: relative;
  overflow: hidden;
}
.hjs-slideview__left {
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  left: auto;
  width: 100%;
  height: 100%;
}
.hjs-slideview__right {
  position: absolute;
  top: 0;
  right: auto;
  left: 100%;
  width: 100%;
  height: 100%;
}
.hjs-slideview__content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
}
.hjs-slideview__actions {
  width: 100%;
  height: 100%;
}
.hjs-slideview__action__wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  width: 100%;
  background: transparent;
}
.hjs-slideview__left .hjs-slideview__action__wrap {
  right: 0;
  left: auto;
  flex-direction: row;
}
.hjs-slideview__right .hjs-slideview__action__wrap {
  right: auto;
  left: 0;
  flex-direction: row-reverse;
}
.hjs-slideview__actions__round .hjs-slideview__action__wrap {
  padding: 10px 0;
}
.hjs-slideview__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
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
