/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-11 10:32:41
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
.hjs-slideview__action__wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.hjs-slideview__left {
  right: 100%;
  left: auto;
  justify-content: flex-end;
}
.hjs-slideview__left .hjs-slideview__action__wrapper {
  right: 0;
  left: auto;
  justify-content: flex-end;
}
.hjs-slideview__right {
  right: auto;
  left: 100%;
  justify-content: flex-start;
}
.hjs-slideview__right .hjs-slideview__action__wrapper {
  right: auto;
  left: 0;
  justify-content: flex-start;
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
.hjs-slideview__action__icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
}
.hjs-slideview__action__text {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  text-overflow: ellipsis;
}
`;
