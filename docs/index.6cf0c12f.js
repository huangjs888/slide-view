(()=>{var e,t={855:(e,t,r)=>{"use strict";var n=r(599),o=0,i=null,c=function(){var e=[],t=document.querySelector("#button-form");if(t){var n=new FormData(t);if(n.get("left"))for(var i=+(n.get("leftType")||0),c=+(n.get("leftNum")||0),l=n.get("leftSlideOut"),u=n.get("leftConfirm"),a=0;a<=c;a++)e.push(1===i?{position:"left",className:"slide-item-".concat(a+1),icon:{src:r(2===a?359:1===a?50:14),className:"f f-".concat(2===a?"del":1===a?"edit":"set"),width:24,height:24},width:48,height:48,background:"#fff",slideOut:!!l,confirm:u?{className:"f f-".concat(2===a?"delO":1===a?"editO":"setO"),src:r(2===a?922:1===a?29:87)}:void 0,data:{id:++o}}:{position:"left",className:"slide-item-".concat(a),color:"#fff",text:2===a?"删除":1===a?"不显示":"标记为已读",background:2===a?"#E75E58":1===a?"#EEA151":"#3D83E5",slideOut:!!l,confirm:u?{text:2===a?"确认确认确认确认确认确认删除":"确认确认确认确认确认确认确认确认确认确认确认删除确认删除"}:void 0,data:{id:++o}});if(n.get("right"))for(var s=+(n.get("rightType")||0),d=+(n.get("rightNum")||0),f=n.get("rightSlideOut"),p=n.get("rightConfirm"),v=0;v<=d;v++)e.push(1===s?{className:"slide-item-".concat(v+1),icon:{src:r(2===v?359:1===v?50:14),className:"f f-".concat(2===v?"del":1===v?"edit":"set"),width:24,height:24},width:48,height:48,background:"#fff",slideOut:!!f,confirm:p?{className:"f f-".concat(2===v?"delO":1===v?"editO":"setO"),src:r(2===v?922:1===v?29:87)}:void 0,data:{id:++o}}:{className:"slide-item-".concat(v),color:"#fff",text:2===v?"删除":1===v?"不显示":"标记为已读",background:2===v?"#E75E58":1===v?"#EEA151":"#3D83E5",slideOut:!!f,confirm:p?{text:2===v?"确认删除？":1===v?"确认不显示？":"确认标为已读？"}:void 0,data:{id:++o,del:2===v}})}return e},l=function(){var e=document.querySelector("#input"),t=document.createElement("div");t.classList.add("slide-view-cell");var r=document.createElement("span");return r.innerText=e.value,t.appendChild(r),t},u=document.querySelector("#create");u&&u.addEventListener("click",(function(){i&&(i.destory(),i=null);var e=document.querySelectorAll(".slide-view-item")[1],t=document.createElement("div");t.classList.add("slide-view-cell");var r=document.createElement("span");r.innerText="滑动菜单示例",t.appendChild(r),i=new n.Z({container:e,className:"slide-item-0",content:l(),buttons:c(),disable:!!(null==v?void 0:v.firstChild).checked,rebounce:!!(null==m?void 0:m.firstChild).checked,fullSlide:!!(null==p?void 0:p.firstChild).checked,duration:+(null==b?void 0:b.previousSibling).value,throttle:+(null==y?void 0:y.previousSibling).value});var o=document.querySelector("#info");i.on("show",(function(e){o.innerHTML="item-show:".concat(e.shown),console.log(o.innerHTML)})),i.on("hide",(function(){o.innerHTML="item-hide",console.log(o.innerHTML)})),i.on("buttonPress",(function(e){var t;if(o.innerHTML="item-buttonPress",i&&null!==(t=e.data)&&void 0!==t&&t.del){var r=i.element.parentNode;r.style.opacity="1",window.requestAnimationFrame((function(){r.style.opacity="0",r.style.transition="opacity 0.8s",r.ontransitionend=function(e){e.target===r&&"opacity"===e.propertyName&&(r.ontransitionend=null,i&&i.destory())}}))}})),i.on("buttonConfirm",(function(){o.innerHTML="item-buttonConfirm",console.log(o.innerHTML)})),i.on("press",(function(){o.innerHTML="item-press",console.log(o.innerHTML)})),i.on("longPress",(function(){o.innerHTML="item-longPress",console.log(o.innerHTML)})),i.on("doublePress",(function(){o.innerHTML="item-doublePress",console.log(o.innerHTML)}))}));var a=document.querySelector("#button");a&&a.addEventListener("click",(function(){if(i){var e=c();i.setButtons(e)}else window.alert("请先创建item...")}));var s=document.querySelector("#show-right");s&&s.addEventListener("click",(function(){i&&i.showButton("right")}));var d=document.querySelector("#show-left");d&&d.addEventListener("click",(function(){i&&i.showButton("left")}));var f=document.querySelector("#hide");f&&f.addEventListener("click",(function(){i&&i.hideButton()}));var p=document.querySelector("#fullSlide");p&&p.addEventListener("click",(function(e){if(e.target===p.firstChild){if(!i)return;i.setFullSlide(!!p.firstChild.checked)}}));var v=document.querySelector("#disable");v&&v.addEventListener("click",(function(e){if(e.target===v.firstChild){if(!i)return;i.setDisable(!!v.firstChild.checked)}}));var m=document.querySelector("#rebounce");m&&m.addEventListener("click",(function(e){if(e.target===m.firstChild){if(!i)return;i.setRebounce(!!m.firstChild.checked)}}));var y=document.querySelector("#throttle");y&&y.addEventListener("click",(function(){if(i){var e=y.previousSibling;i.setThrottle(+e.value)}}));var b=document.querySelector("#duration");b&&b.addEventListener("click",(function(){if(i){var e=b.previousSibling;i.setDuration(+e.value)}}));var h=document.querySelector("#content");h&&h.addEventListener("click",(function(){i&&i.setContent(l())}));var g=document.querySelector("#destory");g&&g.addEventListener("click",(function(){i&&(i.destory(),i=null)}));var w=new n.Z({container:document.querySelectorAll(".slide-view-item")[0],className:"test",content:'<div class="slide-view-cell"><span>滑动菜单示例OK</span></div>',buttons:[{text:"标记为已读",color:"#fff",background:"#3D83E5",data:{id:-1}},{text:"不显示",color:"#fff",background:"#EEA151",slideOut:!1,confirm:{text:"确认不显示？"},data:{id:-2}},{text:"删除",color:"#fff",background:"#E75E58",confirm:{text:"确认删除？"},data:{id:-3,del:!0}}]});w.on("buttonPress",(function(e){var t;if(null!==(t=e.data)&&void 0!==t&&t.del){var r=w.element.parentNode;r.style.opacity="0",r.style.transition="opacity 0.8s",setTimeout((function(){w.destory()}),800)}})),w.on("press",(function(){w.element.classList.add("active"),location.href="/"}))},922:(e,t,r)=>{e.exports=r.p+"delete-confirm.8074c249png"},359:(e,t,r)=>{e.exports=r.p+"delete.83276a12png"},29:(e,t,r)=>{e.exports=r.p+"edit-confirm.cd451c6dpng"},50:(e,t,r)=>{e.exports=r.p+"edit.5de042acpng"},87:(e,t,r)=>{e.exports=r.p+"set-confirm.674750d4png"},14:(e,t,r)=>{e.exports=r.p+"set.703cd90fpng"},169:(e,t,r)=>{"use strict";function n(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}r.d(t,{Z:()=>n})},951:(e,t,r)=>{"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}r.d(t,{Z:()=>n})},976:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var n=r(217);function o(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,(0,n.Z)(o.key),o)}}function i(e,t,r){return t&&o(e.prototype,t),r&&o(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}},649:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});var n=r(217);function o(e,t,r){return(t=(0,n.Z)(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},243:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});var n=r(597);function o(){return o="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,r){var o=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=(0,n.Z)(e)););return e}(e,t);if(o){var i=Object.getOwnPropertyDescriptor(o,t);return i.get?i.get.call(arguments.length<3?e:r):i.value}},o.apply(this,arguments)}},597:(e,t,r)=>{"use strict";function n(e){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},n(e)}r.d(t,{Z:()=>n})},132:(e,t,r)=>{"use strict";function n(e,t){return n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},n(e,t)}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&n(e,t)}r.d(t,{Z:()=>o})},492:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var n=r(940),o=r(169);function i(e,t){if(t&&("object"===(0,n.Z)(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return(0,o.Z)(e)}},444:(e,t,r)=>{"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,c,l=[],u=!0,a=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=i.call(r)).done)&&(l.push(n.value),l.length!==t);u=!0);}catch(e){a=!0,o=e}finally{try{if(!u&&null!=r.return&&(c=r.return(),Object(c)!==c))return}finally{if(a)throw o}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}r.d(t,{Z:()=>o})},217:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});var n=r(940);function o(e){var t=function(e,t){if("object"!==(0,n.Z)(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==(0,n.Z)(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"===(0,n.Z)(t)?t:String(t)}},940:(e,t,r)=>{"use strict";function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}r.d(t,{Z:()=>n})}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.m=t,e=[],n.O=(t,r,o,i)=>{if(!r){var c=1/0;for(s=0;s<e.length;s++){for(var[r,o,i]=e[s],l=!0,u=0;u<r.length;u++)(!1&i||c>=i)&&Object.keys(n.O).every((e=>n.O[e](r[u])))?r.splice(u--,1):(l=!1,i<c&&(c=i));if(l){e.splice(s--,1);var a=o();void 0!==a&&(t=a)}}return t}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[r,o,i]},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),(()=>{var e={826:0};n.O.j=t=>0===e[t];var t=(t,r)=>{var o,i,[c,l,u]=r,a=0;if(c.some((t=>0!==e[t]))){for(o in l)n.o(l,o)&&(n.m[o]=l[o]);if(u)var s=u(n)}for(t&&t(r);a<c.length;a++)i=c[a],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(s)},r=self.webpackChunk=self.webpackChunk||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=n.O(void 0,[647],(()=>n(855)));o=n.O(o)})();
//# sourceMappingURL=index.6cf0c12f.js.map