/*
 * @Author: Huangjs
 * @Date: 2023-08-30 11:09:21
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-17 09:24:32
 * @Description: ******
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { SlideView, type ITiming, type IEvent, type IActionOption } from '@huangjs888/slide-view';

export * from '@huangjs888/slide-view';

export type ISVRef = {
  findDOMElement: () => Element | null | undefined;
  getInstance: () => SlideView | null | undefined;
};

export type ISVProps = {
  className?: string;
  style?: React.CSSProperties;
  leftActions?: IActionOption;
  leftDisable?: boolean;
  leftOvershoot?: boolean;
  leftThreshold?: number;
  rightActions?: IActionOption;
  rightDisable?: boolean;
  rightOvershoot?: boolean;
  rightThreshold?: number;
  friction?: number;
  rebounce?: number;
  duration?: number;
  timing?: ITiming;
  open?: boolean;
  onShow?: (e: IEvent) => void;
  onHide?: (e: IEvent) => void;
  onButtonPress?: (e: IEvent) => void;
  onButtonConfirm?: (e: IEvent) => void;
  onPress?: (e: IEvent) => void;
  onLongPress?: (e: IEvent) => void;
  onDoublePress?: (e: IEvent) => void;
  children?: React.ReactNode;
};

export default React.forwardRef<ISVRef, ISVProps>(
  (
    {
      className,
      style,
      leftActions,
      leftDisable = false,
      leftOvershoot = false,
      leftThreshold,
      rightActions,
      rightDisable = false,
      rightOvershoot = false,
      rightThreshold,
      friction,
      rebounce,
      duration,
      timing,
      open = false,
      onShow,
      onHide,
      onButtonPress,
      onButtonConfirm,
      onPress,
      onLongPress,
      onDoublePress,
      children,
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const contentRef = React.useRef<Element | null>(null);
    const slideviewRef = React.useRef<SlideView | null>(null);
    React.useEffect(() => {
      const slideview = (slideviewRef.current = new SlideView({
        container: () => containerRef.current,
      }));
      return () => {
        slideview.destory();
      };
    }, []);
    React.useEffect(() => {
      slideviewRef.current?.setContent(() => contentRef.current);
    }, [children]);
    React.useEffect(() => {
      slideviewRef.current?.setFriction(friction);
    }, [friction]);
    React.useEffect(() => {
      slideviewRef.current?.setRebounce(rebounce);
    }, [rebounce]);
    React.useEffect(() => {
      slideviewRef.current?.setDuration(duration);
    }, [duration]);
    React.useEffect(() => {
      slideviewRef.current?.setTiming(timing);
    }, [timing]);
    React.useEffect(() => {
      slideviewRef.current?.setActions(leftActions, 'left');
    }, [leftActions]);
    React.useEffect(() => {
      slideviewRef.current?.setActions(rightActions, 'right');
    }, [rightActions]);
    React.useEffect(() => {
      slideviewRef.current?.setDisable(leftDisable, 'left');
    }, [leftDisable]);
    React.useEffect(() => {
      slideviewRef.current?.setDisable(rightDisable, 'right');
    }, [rightDisable]);
    React.useEffect(() => {
      slideviewRef.current?.setOvershoot(leftOvershoot, 'left');
    }, [leftOvershoot]);
    React.useEffect(() => {
      slideviewRef.current?.setOvershoot(rightOvershoot, 'right');
    }, [rightOvershoot]);
    React.useEffect(() => {
      slideviewRef.current?.setThreshold(leftThreshold, 'left');
    }, [leftThreshold]);
    React.useEffect(() => {
      slideviewRef.current?.setThreshold(rightThreshold, 'right');
    }, [rightThreshold]);
    React.useEffect(() => {
      slideviewRef.current?.on('show', (e) => onShow?.(e));
      return () => {
        slideviewRef.current?.off('show');
      };
    }, [onShow]);
    React.useEffect(() => {
      slideviewRef.current?.on('hide', (e) => onHide?.(e));
      return () => {
        slideviewRef.current?.off('hide');
      };
    }, [onHide]);
    React.useEffect(() => {
      slideviewRef.current?.on('buttonPress', (e) => onButtonPress?.(e));
      return () => {
        slideviewRef.current?.off('buttonPress');
      };
    }, [onButtonPress]);
    React.useEffect(() => {
      slideviewRef.current?.on('buttonConfirm', (e) => onButtonConfirm?.(e));
      return () => {
        slideviewRef.current?.off('buttonConfirm');
      };
    }, [onButtonConfirm]);
    React.useEffect(() => {
      slideviewRef.current?.on('press', (e) => onPress?.(e));
      return () => {
        slideviewRef.current?.off('press');
      };
    }, [onPress]);
    React.useEffect(() => {
      slideviewRef.current?.on('longPress', (e) => onLongPress?.(e));
      return () => {
        slideviewRef.current?.off('longPress');
      };
    }, [onLongPress]);
    React.useEffect(() => {
      slideviewRef.current?.on('doublePress', (e) => onDoublePress?.(e));
      return () => {
        slideviewRef.current?.off('doublePress');
      };
    }, [onDoublePress]);
    React.useEffect(() => {
      if (open) {
        slideviewRef.current?.show();
      } else {
        slideviewRef.current?.hide();
      }
    }, [open]);
    React.useImperativeHandle(
      ref,
      () => ({
        findDOMElement: () => containerRef.current,
        getInstance: () => slideviewRef.current,
      }),
      [],
    );

    const refFun = React.useCallback((_ref: React.ReactInstance) => {
      let element: any = _ref;
      // ref是Element的时候不需要查找，只有是React.Component的时候才可以查找
      if (!(_ref instanceof Element) && _ref instanceof React.Component) {
        element = ReactDOM.findDOMNode(_ref);
      }
      if (!(element instanceof Element)) {
        element = null;
      }
      contentRef.current = element;
    }, []);

    return (
      <div ref={containerRef} className={className} style={style}>
        {React.Children.only(
          React.cloneElement(children as any, {
            ref: refFun,
          }),
        )}
      </div>
    );
  },
);
