"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[647],{599:(t,e,i)=>{i.d(e,{Z:()=>$});var n=i(444),s=i(951),r=i(976),o=i(169),a=i(243),h=i(132),l=i(492),c=i(597),u=i(649),p=i(808),d=function(){function t(){(0,s.Z)(this,t),(0,u.Z)(this,"events",{}),this.events={}}return(0,r.Z)(t,[{key:"one",value:function(t,e,i){var n=this,s="function"==typeof e?function(){for(var r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];e.apply(n,o),n.off(t,s,i)}:e;this.on(t,s,i)}},{key:"on",value:function(t,e,i){var n=this.events[t]||{pool:[],single:-1};if("function"==typeof e)if(i)-1===n.single?n.single=n.pool.push(e)-1:n.pool[n.single]=e;else{for(var s=!0,r=0,o=n.pool.length;r<o;r++)if(n.pool[r]===e&&r!==n.single){s=!1;break}s&&n.pool.push(e)}else i&&-1!==n.single&&(n.pool.splice(n.single,1),n.single=-1);this.events[t]=n}},{key:"off",value:function(t,e,i){if(void 0===t)this.events={};else if(void 0===e)delete this.events[t];else if(i){var n=this.events[t];n&&-1!==n.single&&(n.pool.splice(n.single,1),n.single=-1)}else{var s=this.events[t];if(s)for(var r=s.pool.length-1;r>=0;r--)if(s.pool[r]===e&&r!==s.single){s.pool.splice(r,1);break}}}},{key:"trigger",value:function(t,e){var i=this.events[t];if(i)for(var n=0,s=i.pool.length;n<s;n++){var r=i.pool[n];if("function"==typeof r&&!1===r.apply(e.currentTarget,[e,t]))break}}}]),t}();function v(t,e){var i=(0,n.Z)(t,2),s=i[0],r=i[1],o=(0,n.Z)(e,2),a=o[0],h=o[1];return Math.sqrt(Math.pow(a-s,2)+Math.pow(h-r,2))}function f(t,e){var i=(0,n.Z)(t,2),s=i[0],r=i[1],o=(0,n.Z)(e,2),a=o[0],h=o[1];return 180*Math.atan2(h-r,a-s)/Math.PI}function g(t,e){var i=(0,n.Z)(t,2),s=i[0],r=i[1],o=(0,n.Z)(e,2);return[(s+o[0])/2,(r+o[1])/2]}function m(t,e){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(e<=0)return 1;var n=t||1,s=Math.min(1,e);return s=i?1/s:s,Math.pow(Math.abs(n),s)*n/Math.abs(n)}function _(t,e){return t&&"string"==typeof e&&e.split(" ").forEach((function(e){return e&&t.classList.add(e)})),t}function b(t,e){return t&&Object.keys(e).forEach((function(i){if(void 0!==e[i]){var n=-1!==i.indexOf("-")?i:i.replace(/([A-Z])/g,"-$1").toLowerCase(),s="number"==typeof e[i]&&"z-index"!==n&&"opacity"!==n?"".concat(e[i],"px"):String(e[i]);t.style.setProperty(n,s)}})),t}function T(t){if(t){if(t.match(/\.(jpe?g|png|gif|bmp|ico|svg|webp)$/)||t.match(/^(data:image\/)/))return"img";if(t.match(/^<svg(.+)?>.+<\/svg>$/))return"span"}return"i"}var w="hjs-slide-view-style";var y=function(t,e,i){return"number"!=typeof t||t<i?e:t};function E(t){var e=this,i=t.touches;if(i){t.preventDefault(),t.stopImmediatePropagation();for(var n=0,s=i.length;n<s;++n){var r=i[n],o=[r.pageX,r.pageY],a=[o,o,r.identifier];this._touch0?this._touch1||a[2]===this._touch0[2]||(this._touch1=a):this._touch0=a}if(this._preventTap=!0,this._swipeTimeStamp=0,this._preventSingleTap=!0,this._preventDoubleTap=!0,this._longTapTimer&&(clearTimeout(this._longTapTimer),this._longTapTimer=null),this._touch1&&this._touch0)this.trigger("gestureStart",{currentTarget:this.element,point:[this._touch0[0],this._touch1[0]],timeStamp:Date.now(),sourceEvent:t});else{if(!this._touch0)return;this._preventTap=!1,this._swipeTimeStamp=t.timeStamp,this._longTapTimer=window.setTimeout((function(){e._preventTap=!0,e._swipeTimeStamp=0,e._preventSingleTap=!0,e._preventDoubleTap=!0,e._longTapTimer=null,e.trigger("longTap",{currentTarget:e.element,point:e._touch0?[e._touch0[0]]:[],timeStamp:Date.now(),sourceEvent:t,waitTime:e.longTapInterval})}),this.longTapInterval),this._singleTapTimer&&this._touchFirst&&v(this._touchFirst,this._touch0[0])<this.doubleTapDistance?(clearTimeout(this._singleTapTimer),this._singleTapTimer=null,this._preventSingleTap=!0,this._preventDoubleTap=!1):(this._touchFirst=this._touch0[0],this._preventSingleTap=!1,this._preventDoubleTap=!0)}this.trigger("touchStart",{currentTarget:this.element,point:this._touch1?[this._touch0[0],this._touch1[1]]:[this._touch0[0]],timeStamp:Date.now(),sourceEvent:t})}}function Z(t){var e=t.changedTouches;if(e){t.preventDefault(),t.stopImmediatePropagation();for(var i=0,n=e.length;i<n;++i){var s=e[i],r=[s.pageX,s.pageY];this._touch0&&this._touch0[2]===s.identifier?this._touch0[1]=r:this._touch1&&this._touch1[2]===s.identifier&&(this._touch1[1]=r)}if(this._touch0&&v(this._touch0[0],this._touch0[1])>=this.touchMoveDistance||this._touch1&&v(this._touch1[0],this._touch1[1])>=this.touchMoveDistance){if(this._preventTap=!0,this._preventSingleTap=!0,this._preventDoubleTap=!0,this._longTapTimer&&(clearTimeout(this._longTapTimer),this._longTapTimer=null),this._touch1&&this._touch0){var o=v(this._touch0[1],this._touch1[1]),a=v(this._touch0[0],this._touch1[0]);0!==o&&0!==a&&this.trigger("pinch",{currentTarget:this.element,point:[this._touch0[0],this._touch1[1]],timeStamp:Date.now(),sourceEvent:t,scale:o/a});var h=f(this._touch0[1],this._touch1[1]),l=f(this._touch0[0],this._touch1[0]);this.trigger("rotate",{currentTarget:this.element,point:[this._touch0[0],this._touch1[1]],timeStamp:Date.now(),sourceEvent:t,angle:h+l});var c=g(this._touch0[1],this._touch1[1]),u=g(this._touch0[0],this._touch1[0]);this.trigger("multiPan",{currentTarget:this.element,point:[this._touch0[0],this._touch1[1]],timeStamp:Date.now(),sourceEvent:t,deltaX:c[0]-u[0],deltaY:c[1]-u[1]}),this.trigger("gestureMove",{currentTarget:this.element,point:[this._touch0[0],this._touch1[1]],timeStamp:Date.now(),sourceEvent:t})}else{if(!this._touch0)return;var p=this._touch0[1][0]-this._touch0[0][0],d=this._touch0[1][1]-this._touch0[0][1];this.trigger("pan",{currentTarget:this.element,point:[this._touch0[0]],timeStamp:Date.now(),sourceEvent:t,deltaX:p,deltaY:d})}this.trigger("touchMove",{currentTarget:this.element,point:this._touch1?[this._touch0[0],this._touch1[1]]:[this._touch0[0]],timeStamp:Date.now(),sourceEvent:t})}}}function M(t){var e=this,i=t.changedTouches;if(i){t.stopImmediatePropagation();for(var s,r,o,a,h,l,c,u,p,d,f,g=null,m=0,_=i.length;m<_;++m){var b=i[m];this._touch0&&this._touch0[2]===b.identifier?(g=this._touch0,this._touch0=null):this._touch1&&this._touch1[2]===b.identifier&&(this._touch1=null)}if(this._touch1&&!this._touch0&&(this._touch0=this._touch1,this._touch1=null),this._longTapTimer&&(clearTimeout(this._longTapTimer),this._longTapTimer=null),this._touch0)this._touch1||(this._touch0[0]=this._touch0[1],this.trigger("touchStart",{currentTarget:this.element,point:[this._touch0[0]],timeStamp:Date.now(),sourceEvent:t})),this.trigger("gestureEnd",{currentTarget:this.element,point:[this._touch0[0]],timeStamp:Date.now(),sourceEvent:t});else{if(this._preventTap||this.trigger("tap",{currentTarget:this.element,point:g?[g[1]]:[],timeStamp:Date.now(),sourceEvent:t}),this._swipeTimeStamp>0&&g){var T=(f=t.timeStamp-this._swipeTimeStamp,v(g[0],g[1])/f||0);if(T>=this.swipeVelocity&&(Math.abs(g[1][0]-g[0][0])>=this.swipeDistance||Math.abs(g[1][1]-g[0][1])>=this.swipeDistance)){var w=(s=g[0],r=g[1],a=(o=(0,n.Z)(s,2))[0],h=o[1],(p=a-(c=(l=(0,n.Z)(r,2))[0]))==(d=h-(u=l[1]))?"None":Math.abs(p)>=Math.abs(d)?a-c>0?"Left":"Right":h-u>0?"Up":"Down");this.trigger("swipe",{currentTarget:this.element,point:[g[1]],timeStamp:Date.now(),sourceEvent:t,direction:w,velocity:T})}}this._preventSingleTap||(this._singleTapTimer=window.setTimeout((function(){e._singleTapTimer=null,e.trigger("singleTap",{currentTarget:e.element,point:g?[g[1]]:[],timeStamp:Date.now(),sourceEvent:t,delayTime:e.doubleTapInterval})}),this.doubleTapInterval)),this._preventDoubleTap||this.trigger("doubleTap",{currentTarget:this.element,point:g?[g[1]]:[],timeStamp:Date.now(),sourceEvent:t,intervalTime:this.doubleTapInterval})}this.trigger("touchEnd",{currentTarget:this.element,point:[],timeStamp:Date.now(),sourceEvent:t})}}function x(t){this.trigger("touchCancel",{currentTarget:this.element,point:[],timeStamp:Date.now(),sourceEvent:t}),M.apply(this,[t])}function S(){this._singleTapTimer&&(clearTimeout(this._singleTapTimer),this._singleTapTimer=null),this._longTapTimer&&(clearTimeout(this._longTapTimer),this._longTapTimer=null),this._touchFirst=null,this._touch0=null,this._touch1=null,this._preventTap=!0,this._swipeTimeStamp=0,this._preventSingleTap=!0,this._preventDoubleTap=!0}const A=function(t){(0,h.Z)(p,t);var e,i,n=(e=p,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,n=(0,c.Z)(e);if(i){var s=(0,c.Z)(this).constructor;t=Reflect.construct(n,arguments,s)}else t=n.apply(this,arguments);return(0,l.Z)(this,t)});function p(t,e){var i,r;if((0,s.Z)(this,p),i=n.call(this),(0,u.Z)((0,o.Z)(i),"longTapInterval",750),(0,u.Z)((0,o.Z)(i),"doubleTapInterval",250),(0,u.Z)((0,o.Z)(i),"doubleTapDistance",10),(0,u.Z)((0,o.Z)(i),"touchMoveDistance",3),(0,u.Z)((0,o.Z)(i),"swipeDistance",30),(0,u.Z)((0,o.Z)(i),"swipeVelocity",.3),(0,u.Z)((0,o.Z)(i),"_singleTapTimer",null),(0,u.Z)((0,o.Z)(i),"_longTapTimer",null),(0,u.Z)((0,o.Z)(i),"_preventTap",!0),(0,u.Z)((0,o.Z)(i),"_swipeTimeStamp",0),(0,u.Z)((0,o.Z)(i),"_preventSingleTap",!0),(0,u.Z)((0,o.Z)(i),"_preventDoubleTap",!0),(0,u.Z)((0,o.Z)(i),"_touchFirst",null),(0,u.Z)((0,o.Z)(i),"_touch0",null),(0,u.Z)((0,o.Z)(i),"_touch1",null),(0,u.Z)((0,o.Z)(i),"_destory",null),!((r="string"==typeof t?document.querySelector(t):t)&&r instanceof HTMLElement))throw new Error("Please pass in a valid element...");i.element=r;var a,h=e||{},l=h.longTapInterval,c=h.doubleTapInterval,d=h.doubleTapDistance,v=h.touchMoveDistance,f=h.swipeDistance,g=h.swipeVelocity;if(i.longTapInterval=y(l,750,500),i.doubleTapInterval=y(c,250,200),i.doubleTapDistance=y(d,10,1),i.touchMoveDistance=y(v,3,0),i.swipeDistance=y(f,30,0),i.swipeVelocity=y(g,.3,.01),(a=i.element)&&(navigator.maxTouchPoints||"ontouchstart"in a)){var m=E.bind((0,o.Z)(i)),_=Z.bind((0,o.Z)(i)),b=M.bind((0,o.Z)(i)),T=x.bind((0,o.Z)(i));i.element.addEventListener("touchstart",m,!1),i.element.addEventListener("touchmove",_,!1),i.element.addEventListener("touchend",b,!1),i.element.addEventListener("touchcancel",T,!1);var w=S.bind((0,o.Z)(i));window.addEventListener("scroll",w),i._destory=function(){i.element.removeEventListener("touchstart",m),i.element.removeEventListener("touchmove",_),i.element.removeEventListener("touchend",b),i.element.removeEventListener("touchcancel",T),window.removeEventListener("scroll",w)}}return i}return(0,r.Z)(p,[{key:"done",value:function(){return!!this._destory}},{key:"destory",value:function(){(0,a.Z)((0,c.Z)(p.prototype),"off",this).call(this),S.apply(this),this._destory&&(this._destory(),this._destory=null)}}]),p}(d);function D(t,e,i){i({type:"touch",point:e.point[0],currentTarget:t,sourceEvent:e})}function P(t,e,i){e.preventDefault(),t.getAttribute("data-move")?t.removeAttribute("data-move"):i({type:"mouse",point:[e.pageX,e.pageY],currentTarget:t,sourceEvent:e})}function j(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"transform";return t&&(t.ontransitionend=function(n){n.stopImmediatePropagation(),n.target===t&&n.propertyName===i&&(t.ontransitionend=null,e(n))}),t}var L=["wrapper","element","confirm"];function k(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function C(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?k(Object(i),!0).forEach((function(e){(0,u.Z)(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):k(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var O=function(t,e){var i,n;try{i="string"==typeof t?document.querySelector(t):t}catch(t){i=null}if(!(i&&i instanceof HTMLElement))throw new Error("Please pass in a valid container element...");(n=document.querySelector("#".concat(w)))||((n=document.createElement("style")).id=w,n.appendChild(document.createTextNode("\n.hjs-slideview {\n  position: relative;\n  overflow: hidden;\n}\n.hjs-slideview__content {\n  position: relative;\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__left,\n.hjs-slideview__right,\n.hjs-slideview__actions,\n.hjs-slideview__action__wrapper {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n}\n.hjs-slideview__left {\n  right: 100%;\n  left: auto;\n  justify-content: flex-end;\n}\n.hjs-slideview__left .hjs-slideview__action__wrapper {\n  right: 0;\n  left: auto;\n  justify-content: flex-end;\n}\n.hjs-slideview__right {\n  right: auto;\n  left: 100%;\n  justify-content: flex-start;\n}\n.hjs-slideview__right .hjs-slideview__action__wrapper {\n  right: auto;\n  left: 0;\n  justify-content: flex-start;\n}\n.hjs-slideview__action {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  max-width: 100%;\n  height: 100%;\n  padding: 0 20px;\n  cursor: pointer;\n}\n.hjs-slideview__action__icon {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  text-align: center;\n}\n.hjs-slideview__action__text {\n  width: 100%;\n  overflow: hidden;\n  white-space: nowrap;\n  text-align: center;\n  text-overflow: ellipsis;\n}\n")),(document.head||document.getElementsByTagName("head")[0]).appendChild(n));var s=_(document.createElement("div"),"hjs-slideview ".concat(e||"")),r=_(document.createElement("div"),"hjs-slideview__left");s.appendChild(r);var o=_(document.createElement("div"),"hjs-slideview__right");s.appendChild(o);var a=_(document.createElement("div"),"hjs-slideview__content");return s.appendChild(a),i.innerHTML="",i.appendChild(s),[s,a,r,o]},I=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=t.wrapper,n=t.element,s=t.confirm,r=void 0===s?{}:s,o=(0,p.Z)(t,L),a=o.text,h=o.icon,l=o.color,c=o.background,u=o.className;if(e&&(h=h&&(r.icon||h),a=a&&(r.text||a),l=l&&(r.color||l),c=c&&(r.background||c),u=u&&(r.className||u)),b(i,{background:c||"",color:l||""}),_(function(t,e){return t&&"string"==typeof e&&e.split(" ").forEach((function(e){return e&&t.classList.remove(e)})),t}(n,e?o.className||"":r.className||o.className||""),u||""),h){var d=n.firstChild,v=T(h);"img"===v?d.src=h:"i"===v?d.className=h:d.innerHTML=h}a&&(n.lastChild.innerText=a)},N=function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.contentEl,s=this.leftActions,r=this.rightActions,o=this.duration,a=this.timing;if(n&&(s&&!s.disable||r&&!r.disable)){var h=o<=0?"":"transform ".concat(o,"s ").concat(a," 0s"),l=t.index,c=t.direction,u=0===this._translate?0:this._translate/Math.abs(this._translate),p=function(t){var s=t.style,r=t.items,o=0;"drawer"===s&&(o=-e._translate);for(var a=0,c=r.length-1;c>=0;c--){var p=r[c],d=p.wrapper,v=p.width,f=p.gap;if(1===r.length&&b(n,{transform:"translate3d(".concat(0!==i?i:e._translate,"px, 0, 0)"),transition:h}),c===l){var g;g=0!==i?i:(v+f[1]+a)*u,b(d,{transform:"translate3d(".concat(g+o,"px, 0, 0)"),transition:h})}else if(c>l){var m=0;0===i&&(m=(v+f[1]+a)*u),b(d,{transform:"translate3d(".concat(m+o,"px, 0, 0)"),transition:h})}a+=v+f[0]+f[1]}};window.requestAnimationFrame((function(){"left"===c&&s&&!s.disable&&p(s),"right"===c&&r&&!r.disable&&p(r)}))}},R=function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.duration,n=this.leftEl,s=this.rightEl,r=this.contentEl,o=this.leftActions,a=this.rightActions,h=this.timing;if(n&&s&&r&&(o&&!o.disable||a&&!a.disable)){var l=0,c=i<=0?"":"transform ".concat(i,"s ").concat(h," 0s"),u=i<=0?"":"width ".concat(i,"s ").concat(h," 0s, transform ").concat(i,"s ").concat(h," 0s"),p=function(i){var n=i.style,s=i.items,r=i.element,o=i.width,a=i.gap,h={},p=t,d=0;"drawer"===n&&(b(r,{width:Math.max(Math.abs(t),o),transform:"translate3d(".concat(t,"px, 0, 0)"),transition:u}),p=l*Math.max(o,Math.abs(t)),d=-t);for(var v=0,f=s.length-1,g=f;g>=0;g--){var m=s[g],_=m.wrapper,T=m.width,w=m.gap,y=m.fixedGap,E=T/(o-a)*(p-l*a),Z=E+l*w[1],M=Z+v;y&&"100%"!==_.style.width&&(h={width:Math.max(Math.abs(E),T),transition:u}),b(_,C({transform:"translate3d(".concat((g===f&&e._overshooting?t:M)+d,"px, 0, 0)"),transition:c},h)),v+=Z+l*w[0]}};window.requestAnimationFrame((function(){b(r,{transform:"translate3d(".concat(t,"px, 0, 0)"),transition:c}),o&&!o.disable&&(l=1,p(o)),a&&!a.disable&&(l=-1,p(a))}))}},F=function(){if(this._confirming){var t=this._confirming,e=t.index,i=t.direction,n="left"===i?this.leftActions:"right"===i?this.rightActions:null;if(n&&!n.disable){var s=n.items[e];b(s.element,{width:""}),I(s)}this._confirming=null}},X=function(t){t&&!t.disable&&b(t.items[t.items.length-1].wrapper,{width:this._overshooting?"100%":""})},Y=function(t){var e=this.element,i=this.leftActions,n=this.rightActions,s=this.friction;if(e&&(i&&!i.disable||n&&!n.disable)){var r=e.getBoundingClientRect(),o=r.width,a=r.left;this._width=o,this._offset=a;var h=t.point;this._isMoving=!0,this._timeStamp=0,this._startAngle=0,this._startOffset=this._translate,this._startPoint=h;var l=this._translate>0?i:this._translate<0?n:null,c=0;if(l&&!l.disable){var u=l.overshoot,p=l.overshootFreeSize,d=l.width,v=(u?Math.min(o,Math.max(o-p,d)):d)*this._translate/Math.abs(this._translate);c=Math.abs(this._translate)<=Math.abs(v)?this._translate:m(this._translate-v,s,!0)+v}this._startTranslate=c}},z=function(t){var e=this.leftActions,i=this.rightActions,n=this.friction;if(this._isMoving&&this._startPoint&&(e&&!e.disable||i&&!i.disable)){var s=t.point,r=t.sourceEvent,o=s[0]-this._startPoint[0],a=s[1]-this._startPoint[1];if(0===this._startAngle&&(this._startAngle=Math.abs(o)-Math.abs(a)<=0?-1:1),1===this._startAngle){var h=0,l=0,c=this._startTranslate+o,u=c>0?e:c<0?i:null;if(u&&!u.disable){var p=u.overshoot,d=u.overshootEdgeSize,v=u.overshootFreeSize,f=u.width,g=c/Math.abs(c),_=g*Math.min(this._width,Math.max(this._width-v,f)),b=g*Math.min(.5*this._width,Math.max(0,d)),T=g*f;if(p){if(Math.abs(c)<Math.abs(_)){var w=0,y=!1,E=s[0]-this._offset,Z=this._startPoint[0]-this._offset-this._startOffset,M=.5*this._width;c<0?(w=E-Math.abs(b),y=Z>M&&w<0):(w=E-(this._width-Math.abs(b)),y=Z<M&&w>0),y&&(c=_+w,this._startPoint=s,this._startTranslate=c)}var x=r instanceof MouseEvent?r.timeStamp:r.sourceEvent.timeStamp;if(Math.abs(c)>=Math.abs(_)){if(!this._overshooting){this._timeStamp=x,this._overshooting=!0,X.apply(this,[u]);var S=u.items.length-1,A=u.items[S];A.confirm&&(I(A,!0),this._confirming={index:S,direction:g>0?"left":"right"})}h=m(c-_,n)+_,l=Math.max(0,this.duration-(x-this._timeStamp)/1e3)}else{if(this._overshooting){this._timeStamp=x,this._overshooting=!1,X.apply(this,[u]);var D=u.items.length-1,P=u.items[D];P.confirm&&(I(P),this._confirming=null)}h=c,l=Math.max(0,this.duration/2-(x-this._timeStamp)/1e3)}}else h=Math.abs(c)>=Math.abs(T)?m(c-T,n)+T:c;h=Math.min(this._width,Math.max(-this._width,h))}else this._startPoint=s,this._startTranslate=0,h=0;this._translate=h,R.apply(this,[h,l]),this._overshooting||F.apply(this,[])}}},B=function(t){var e=this.element,i=this.leftActions,n=this.rightActions;if(this._isMoving&&this._startPoint&&1===this._startAngle&&e&&(i&&!i.disable||n&&!n.disable)){this._isMoving=!1;var s=this._startPoint,r=t.point;if(!(0===this._translate||v(s,r)<3)){var o=this._translate>0?i:this._translate<0?n:null;if(o&&!o.disable){if(this._overshooting){var a=o.items.length-1,h=o.items[a],l=this._translate*e.getBoundingClientRect().width/Math.abs(this._translate);return this._translate=l,R.apply(this,[l]),void this.trigger(h.confirm?"buttonConfirm":"buttonPress",{index:a,data:h.data,currentTarget:h.wrapper,timeStamp:Date.now(),sourceEvent:t})}var c=r[0]-s[0];if(this._translate>0&&c<0||this._translate<0&&c>0||Math.abs(this._translate)<o.threshold)return void this.hide()}this.show(this._translate>0?"left":"right")}}},H=function(t){for(var e=this.contentEl,i=this._translate,n=t.sourceEvent,s=t.currentTarget,r=n instanceof MouseEvent?n.target:n.sourceEvent.target;r!==s&&r!==e;)r=r.parentNode;r===e&&(0===i?this.trigger("longPress",{currentTarget:e,timeStamp:Date.now(),sourceEvent:t}):this.hide())},q=function(t){for(var e=this.contentEl,i=this._translate,n=t.sourceEvent,s=t.currentTarget,r=n instanceof MouseEvent?n.target:n.sourceEvent.target;r!==s&&r!==e;)r=r.parentNode;r===e&&(0===i?this.trigger("doublePress",{currentTarget:e,timeStamp:Date.now(),sourceEvent:t}):this.hide())},G=function(t){for(var e=this.contentEl,i=this.leftEl,n=this.rightEl,s=this._translate,r=t.sourceEvent,o=t.currentTarget,a=r instanceof MouseEvent?r.target:r.sourceEvent.target;a!==o&&a!==e&&a!==i&&a!==n;)a=a.parentNode;a===e?0===s?this.trigger("press",{currentTarget:e,timeStamp:Date.now(),sourceEvent:t}):this.hide():a===i?V.apply(this,[t,"left"]):a===n&&V.apply(this,[t,"right"])},V=function(t,e){var i=this,n=this.element,s=this.leftActions,r=this.rightActions,o=this.rebounce;if(0!==this._translate&&n&&(s&&!s.disable||r&&!r.disable)){for(var a=t.sourceEvent,h=t.currentTarget,l=a instanceof MouseEvent?a.target:a.sourceEvent.target;l!==h&&!l.getAttribute("data-index");)l=l.parentNode;var c=+(l.getAttribute("data-index")||-1),u="left"===e?s:r;if(!(c<0||!u||u.disable)){var p=n.getBoundingClientRect().width,d=this._translate/Math.abs(this._translate),v={index:c,direction:e},f=u.items[c],g=c===u.items.length-1&&u.overshoot,m="buttonPress";if(this._confirming&&this._confirming.index===c&&this._confirming.direction===e)g?(I(f),this._confirming=null):f.collapse?this.hide():(b(f.element,{width:""}),N.apply(this,[v]),I(f),this._confirming=null);else if(g){if(!this._overshooting){this._overshooting=!0;var _=d*p;this._translate=_,R.apply(this,[_]),X.apply(this,[u])}f.confirm&&(this._confirming=v,I(f,!0),m="buttonConfirm")}else if(f.confirm){var T=this._translate;1===u.items.length&&(T=Math.min(Math.abs(2*T),p)*d),o>0&&0!==c?(j(f.wrapper,(function(){i._confirming&&i._confirming.index===v.index&&i._confirming.direction===v.direction&&N.apply(i,[v,T])})),N.apply(this,[v,T+o*T/Math.abs(T)])):N.apply(this,[v,T]),b(f.wrapper,{width:""}),b(f.element,{width:Math.abs(T)}),this._confirming=v,I(f,!0),m="buttonConfirm"}else f.collapse&&this.hide();this.trigger(m,{index:c,data:f.data,currentTarget:l,timeStamp:Date.now(),sourceEvent:t})}}};const $=function(t){(0,h.Z)(d,t);var e,i,p=(e=d,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,n=(0,c.Z)(e);if(i){var s=(0,c.Z)(this).constructor;t=Reflect.construct(n,arguments,s)}else t=n.apply(this,arguments);return(0,l.Z)(this,t)});function d(t){var e;(0,s.Z)(this,d),e=p.call(this),(0,u.Z)((0,o.Z)(e),"leftActions",null),(0,u.Z)((0,o.Z)(e),"rightActions",null),(0,u.Z)((0,o.Z)(e),"friction",.5),(0,u.Z)((0,o.Z)(e),"rebounce",12),(0,u.Z)((0,o.Z)(e),"duration",.4),(0,u.Z)((0,o.Z)(e),"timing","ease"),(0,u.Z)((0,o.Z)(e),"_destory",!1),(0,u.Z)((0,o.Z)(e),"_direction","none"),(0,u.Z)((0,o.Z)(e),"_confirming",null),(0,u.Z)((0,o.Z)(e),"_overshooting",!1),(0,u.Z)((0,o.Z)(e),"_translate",0),(0,u.Z)((0,o.Z)(e),"_width",0),(0,u.Z)((0,o.Z)(e),"_offset",0),(0,u.Z)((0,o.Z)(e),"_startOffset",0),(0,u.Z)((0,o.Z)(e),"_startTranslate",0),(0,u.Z)((0,o.Z)(e),"_startPoint",null),(0,u.Z)((0,o.Z)(e),"_startAngle",0),(0,u.Z)((0,o.Z)(e),"_timeStamp",0),(0,u.Z)((0,o.Z)(e),"_isMoving",!1);var i=t.className,r=t.container,a=t.content,h=t.friction,l=t.rebounce,c=t.duration,v=t.timing,f=t.leftActions,g=t.rightActions,m=O(r,i),_=(0,n.Z)(m,4),b=_[0],T=_[1],w=_[2],y=_[3];return e.element=b,e.contentEl=T,e.leftEl=w,e.rightEl=y,e.setContent(a),e.setFriction(h),e.setRebounce(l),e.setDuration(c),e.setTiming(v),e.setActions(f,"left"),e.setActions(g,"right"),e._agents=function(t,e){if(!(t&&t instanceof HTMLElement))throw new Error("Binding events require HTMLElement...");var i=function(){},n=e.start,s=e.move,r=e.end,o=e.press,a=e.longPress,h=e.doublePress,l=new A(t);if(l.done())n&&l.on("touchStart",(function(e){return function(t,e,i){var n=e.sourceEvent;if(!t.getAttribute("data-touch-identifier")){var s=n.touches[0];s&&(t.setAttribute("data-touch-identifier",s.identifier.toString()),i({type:"touch",currentTarget:t,point:[s.pageX,s.pageY],sourceEvent:e}))}}(t,e,n)})),s&&l.on("touchMove",(function(e){return function(t,e,i){for(var n=e.sourceEvent,s=null,r=0;r<n.changedTouches.length;r++){var o=n.changedTouches.item(r);if(o&&o.identifier.toString()===t.getAttribute("data-touch-identifier")){s=o;break}}s&&i({type:"touch",currentTarget:t,point:[s.pageX,s.pageY],sourceEvent:e})}(t,e,s)})),r&&l.on("touchEnd",(function(e){return function(t,e,i){for(var n=e.sourceEvent,s=null,r=0;r<n.changedTouches.length;r++){var o=n.changedTouches.item(r);if(o&&o.identifier.toString()===t.getAttribute("data-touch-identifier")){s=o;break}}s&&(t.setAttribute("data-touch-identifier",""),i({type:"touch",currentTarget:t,point:[s.pageX,s.pageY],sourceEvent:e}))}(t,e,r)})),o&&l.on("tap",(function(e){return D(t,e,o)})),a&&l.on("longTap",(function(e){return D(t,e,a)})),h&&l.on("doubleTap",(function(e){return D(t,e,h)})),i=function(){l.destory()};else{var c=null;(n||s||r)&&(c=function(e){return function(t,e,i){var n=i.start,s=i.move,r=i.end;e.preventDefault(),e.stopImmediatePropagation(),document.addEventListener("mousemove",l),document.addEventListener("mouseup",(function e(i){i.stopImmediatePropagation(),document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",e),"onselectstart"in document&&(document.removeEventListener("dragstart",h),document.removeEventListener("selectstart",h)),r&&r({type:"mouse",point:[i.pageX,i.pageY],currentTarget:t,sourceEvent:i})})),"onselectstart"in document&&(document.addEventListener("dragstart",h,{capture:!0,passive:!1}),document.addEventListener("selectstart",h,{capture:!0,passive:!1}));var o=e.clientX,a=e.clientY;function h(t){t.preventDefault(),t.stopImmediatePropagation()}function l(e){e.preventDefault(),e.stopImmediatePropagation(),t.setAttribute("data-move","true");var i=e.clientX-o,n=e.clientY-a;i*i+n*n>=9&&s&&s({type:"mouse",point:[e.pageX,e.pageY],currentTarget:t,sourceEvent:e})}n&&n({type:"mouse",point:[e.pageX,e.pageY],currentTarget:t,sourceEvent:e})}(t,e,{start:n,move:s,end:r})},t.addEventListener("mousedown",c));var u=null;(n||s||r||o)&&(u=function(e){return P(t,e,o||function(){})},t.addEventListener("click",u));var p=null;a&&(p=function(e){return P(t,e,a)},t.addEventListener("contextmenu",p));var d=null;h&&(d=function(e){return P(t,e,h)},t.addEventListener("dblclick",d)),i=function(){c&&t.removeEventListener("mousedown",c),u&&t.removeEventListener("click",u),d&&t.removeEventListener("dblclick",d),p&&t.removeEventListener("contextmenu",p)}}return{element:t,destory:i}}(b,{start:Y.bind((0,o.Z)(e)),move:z.bind((0,o.Z)(e)),end:B.bind((0,o.Z)(e)),press:G.bind((0,o.Z)(e)),longPress:H.bind((0,o.Z)(e)),doublePress:q.bind((0,o.Z)(e))}),e}return(0,r.Z)(d,[{key:"setContent",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(!this._destory&&this.contentEl)if("string"!=typeof t||t.match(/^[#|.].+/))try{var e;(e="string"==typeof t?document.querySelector(t):t)&&(this.contentEl.innerHTML="",this.contentEl.appendChild(e))}catch(t){}else this.contentEl.innerHTML=t}},{key:"setFriction",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.5;this._destory||"number"==typeof t&&(this.friction=Math.min(1,Math.max(0,t)))}},{key:"setRebounce",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:12;this._destory||"number"==typeof t&&(this.rebounce=Math.max(0,t))}},{key:"setDuration",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.4;this._destory||"number"==typeof t&&(this.duration=Math.max(0,t))}},{key:"setTiming",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ease";this._destory||(this.timing=t)}},{key:"setDisable",value:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"both";this._destory||"boolean"==typeof e&&this.hide().then((function(){!t.leftActions||"both"!==i&&"left"!==i||(t.leftActions.disable=e),!t.rightActions||"both"!==i&&"right"!==i||(t.rightActions.disable=e)}))}},{key:"setOvershoot",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"both";this._destory||"boolean"==typeof t&&(!this.leftActions||"both"!==e&&"left"!==e||(this.leftActions.overshoot=t),!this.rightActions||"both"!==e&&"right"!==e||(this.rightActions.overshoot=t))}},{key:"setThreshold",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:40,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"both";if(!this._destory&&"number"==typeof t){var i=Math.max(0,t);!this.leftActions||"both"!==e&&"left"!==e||(this.leftActions.threshold=Math.min(i,this.leftActions.width)),!this.rightActions||"both"!==e&&"right"!==e||(this.rightActions.threshold=Math.min(i,this.rightActions.width))}}},{key:"setActions",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"both";if(!this._destory&&"none"!==i){var s=function(i){var s=t["".concat(i,"El")];if(s&&(s.innerHTML="",t["".concat(i,"Actions")]=null,e.items&&e.items.length>0)){var r=e.className,o=e.style,a=void 0===o?"accordion":o,h=e.disable,l=void 0!==h&&h,c=e.overshoot,u=void 0!==c&&c,p=e.overshootEdgeSize,d=void 0===p?80:p,v=e.overshootFreeSize,f=void 0===v?30:v,g=e.threshold,m=void 0===g?40:g,b=e.items,w=_(document.createElement("div"),"hjs-slideview__actions ".concat(r||""));s.appendChild(w);var y=0,E=0,Z=b.map((function(t,e){var i=t.gap,s=void 0===i?0:i,r=t.fixedGap,o=void 0!==r&&r,a=t.text,h=t.icon,l=_(document.createElement("div"),"hjs-slideview__action");l.setAttribute("data-index",String(e)),h&&l.appendChild(_(document.createElement(T(h)),"hjs-slideview__action__icon")),a&&l.appendChild(_(document.createElement("span"),"hjs-slideview__action__text"));var c=_(document.createElement("div"),"hjs-slideview__action__wrapper");c.appendChild(l),w.appendChild(c);var u=C(C({},t),{},{wrapper:c,element:l,width:0,gap:[0,0],fixedGap:o});I(u);var p=l.getBoundingClientRect().width,d=0,v=0;if("number"==typeof s)d=s,v=s;else{var f=(0,n.Z)(s,2);d=f[0],v=f[1]}return d=Math.min(p,Math.max(d,0)),v=Math.min(p,Math.max(v,0)),y+=p+d+v,E+=d+v,C(C({},u),{},{gap:[d,v],fixedGap:(0!==d||0!==v)&&o,width:p})}));t["".concat(i,"Actions")]={style:a,disable:l,overshoot:u,overshootFreeSize:f,overshootEdgeSize:d,threshold:Math.min(y,Math.max(m,0)),element:w,width:y,gap:E,items:Z}}},r=function(e){t.hide().then((function(){s(e),t.show(e)}))},o=this._translate>0?"left":this._translate<0?"right":"none";"both"===i?("none"!==o&&r(o),"left"!==o&&s("left"),"right"!==o&&s("right")):o===i?r(i):s(i)}}},{key:"toggle",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"right";if(!this._destory)return 0===this._translate?this.show(t):this.hide()}},{key:"show",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"right";return new Promise((function(i){var n=t.contentEl,s=t.rebounce,r=t.leftActions,o=t.rightActions;if(!t._destory&&n&&(r&&!r.disable||o&&!o.disable)){var a=e;r&&!r.disable||(a="right"),o&&!o.disable||(a="left");var h="left"===a?r:o,l="left"===a?1:-1,c=h?h.width*l:0;if(t._translate!==c){var u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,s=c+e;t._translate=s,R.apply(t,[s]),t._overshooting&&(t._overshooting=!1,X.apply(t,[t._translate>0?r:o])),F.apply(t,[]),e||j(n,(function(){i(),t._direction!==a&&(t.trigger("show",{direction:a,currentTarget:n,timeStamp:Date.now(),sourceEvent:null}),t._direction=a)}))};s>0&&(c>0&&t._translate<c||c<0&&t._translate>c)?(j(n,(function(){return u()})),u(s*l)):u()}else i()}else i()}))}},{key:"hide",value:function(){var t=this;return new Promise((function(e){var i=t.contentEl,n=t.leftActions,s=t.rightActions;!t._destory&&0!==t._translate&&i&&(n&&!n.disable||s&&!s.disable)?(t._translate=0,R.apply(t,[0]),j(i,(function(){e(),t._overshooting&&(t._overshooting=!1,X.apply(t,[t._translate>0?n:s])),F.apply(t,[]),"none"!==t._direction&&(t.trigger("hide",{direction:"none",currentTarget:i,timeStamp:Date.now(),sourceEvent:null}),t._direction="none")}))):e()}))}},{key:"destory",value:function(){(0,a.Z)((0,c.Z)(d.prototype),"off",this).call(this),this._agents&&(this._agents.destory(),this._agents=null),this.element&&(this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null),this.contentEl=null,this.leftEl=null,this.rightEl=null,this.leftActions=null,this.rightActions=null,this._confirming=null,this._startPoint=null,this._destory=!0}}]),d}(d)}}]);
//# sourceMappingURL=lib.e024bd01.js.map