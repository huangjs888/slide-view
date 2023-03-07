/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-23 15:44:11
 * @Description: ******
 */
export default `
.hjs-slide-view {
  position: relative;
  overflow: hidden;
}
.hjs-slideview__left {
  position: absolute;
  right: 100%;
  top: 0;
  height: 100%;
}
.hjs-slideview__middle {
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
  right:auto;
  bottom: 0;
  text-align: center;
  width: auto;
  height: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hjs-slideview__left .hjs-slideview__btn__wrap {
  left:auto;
  right: 0;
}
.hjs-slideview__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
`;
