"use strict";

exports.__esModule = true;
exports.default = void 0;
/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-04-11 10:32:41
 * @Description: ******
 */
var _default = "\n.hjs-slideview {\n  position: relative;\n  overflow: hidden;\n}\n.hjs-slideview__content {\n  position: relative;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__left,\n.hjs-slideview__right,\n.hjs-slideview__actions,\n.hjs-slideview__action__wrapper {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__left {\n  right: 100%;\n  left: auto;\n  justify-content: flex-end;\n}\n.hjs-slideview__left .hjs-slideview__action__wrapper {\n  right: 0;\n  left: auto;\n  justify-content: flex-end;\n}\n.hjs-slideview__right {\n  right: auto;\n  left: 100%;\n  justify-content: flex-start;\n}\n.hjs-slideview__right .hjs-slideview__action__wrapper {\n  right: auto;\n  left: 0;\n  justify-content: flex-start;\n}\n.hjs-slideview__action {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  max-width: 100%;\n  height: 100%;\n  padding: 0 20px;\n  cursor: pointer;\n}\n.hjs-slideview__action__icon {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  text-align: center;\n}\n.hjs-slideview__action__text {\n  width: 100%;\n  overflow: hidden;\n  white-space: nowrap;\n  text-align: center;\n  text-overflow: ellipsis;\n}\n";
exports.default = _default;