/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-15 14:09:46
 * @Description: ******
 */
export default `
.hjs-slide-view {
  position: relative;
  overflow: hidden;
}
.hjs-slideview__left {
  width: 100%;
  position: relative;
  z-index: 10;
}
.hjs-slideview__right {
  position: absolute;
  left: 100%;
  top: 0;
  height: 100%;
}
.hjs-slideview__buttons {
  width: 100%;
  height: 100%;
}
.hjs-slideview__btn__wrap {
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: center;
  min-width: 68px;
  height: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hjs-slideview__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
`;
