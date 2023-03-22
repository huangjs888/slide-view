"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*
 * @Author: Huangjs
 * @Date: 2023-02-14 16:23:54
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-21 16:50:28
 * @Description: ******
 */
var _default = "\n.hjs-slideview {\n  position: relative;\n  overflow: hidden;\n}\n.hjs-slideview__left {\n  position: absolute;\n  top: 0;\n  right: 100%;\n  bottom: 0;\n  left: auto;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__right {\n  position: absolute;\n  top: 0;\n  right: auto;\n  left: 100%;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__content {\n  position: relative;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__actions {\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__action__wrap {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  box-sizing: border-box;\n  width: 100%;\n  background: transparent;\n}\n.hjs-slideview__left .hjs-slideview__action__wrap {\n  right: 0;\n  left: auto;\n  flex-direction: row;\n}\n.hjs-slideview__right .hjs-slideview__action__wrap {\n  right: auto;\n  left: 0;\n  flex-direction: row-reverse;\n}\n.hjs-slideview__actions__round .hjs-slideview__action__wrap {\n  padding: 10px 0;\n}\n.hjs-slideview__action {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: auto;\n  max-width: 100%;\n  height: 100%;\n  padding: 0 20px;\n  cursor: pointer;\n}\n.hjs-slideview__actions__round .hjs-slideview__action {\n  flex-direction: row;\n  margin: 0 10px;\n  padding: 0 10px;\n  border-radius: 22px;\n  box-shadow: 0px 0px 9px -2px transparent;\n}\n.hjs-slideview__action__icon {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  text-align: center;\n}\n.hjs-slideview__action__text {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.hjs-slideview__actions__rect .hjs-slideview__action__text {\n  width: 100%;\n  text-align: center;\n}\n";
exports.default = _default;