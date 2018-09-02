import { Props, SyntheticEvent } from 'react';

export const executeEventCallback = (
  e: SyntheticEvent<any>,
  callback: (e: SyntheticEvent<any>) => void,
) => {
  if (typeof callback === 'function') {
    callback(e);
  }
};

export const executeEvent = (e: SyntheticEvent<any>, props: any) => {
  if (e.type === 'mousedown') {
    executeEventCallback(e, props.onMouseDown);
  } else if (e.type === 'mouseup') {
    executeEventCallback(e, props.onMouseUp);
  } else if (e.type === 'mouseenter') {
    executeEventCallback(e, props.onMouseEnter);
  } else if (e.type === 'mouseleave') {
    executeEventCallback(e, props.onMouseLeave);
  } else if (e.type === 'click') {
    executeEventCallback(e, props.onClick);
  } else if (e.type === 'touchstart') {
    executeEventCallback(e, props.onTouchStart);
  } else if (e.type === 'touchend') {
    executeEventCallback(e, props.onTouchEnd);
  }
};

export const getEvents = (props: any) => ({
  onMouseDown: (e: any) => executeEvent(e, props),
  onMouseUp: (e: any) => executeEvent(e, props),
  onMouseEnter: (e: any) => executeEvent(e, props),
  onMouseLeave: (e: any) => executeEvent(e, props),
  onClick: (e: any) => executeEvent(e, props),
  onTouchStart: (e: any) => executeEvent(e, props),
  onTouchEnd: (e: any) => executeEvent(e, props),
});

export const executeEventStopPropagation = (
  e: SyntheticEvent<any>,
  event: any,
) => {
  e.preventDefault();
  e.stopPropagation();

  if (typeof event === 'function') {
    event(e);
  }
};
