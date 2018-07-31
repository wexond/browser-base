import Ripples from '../components/Ripples';

import { executeEvent } from './events';

export const handleRipple = (
  {
    type, pageX, pageY, touches,
  }: any,
  ripplesComponent: Ripples,
  props: any,
) => {
  const { ripple, customRippleBehavior } = props;

  if (ripple && !customRippleBehavior) {
    if (type === 'touchend') {
      ripplesComponent.removeRipples();
    } else if (type === 'touchstart') {
      const touch = touches[touches.length - 1];
      ripplesComponent.makeRipple(touch.pageX, touch.pageY, true);
    } else if (type === 'mouseleave') {
      ripplesComponent.removeRipples();
    } else if (type === 'mousedown') {
      ripplesComponent.makeRipple(pageX, pageY);
    }
  }
};

const defaultRippleEvent = (e: any, getRipples: () => Ripples, props: any) => {
  handleRipple(e, getRipples(), props);
  executeEvent(e, props);
};

export const getRippleEvents = (props: any, getRipples: () => Ripples) => ({
  onTouchStart: (e: any) => defaultRippleEvent(e, getRipples, props),
  onTouchEnd: (e: any) => defaultRippleEvent(e, getRipples, props),
  onMouseDown: (e: any) => defaultRippleEvent(e, getRipples, props),
  onMouseLeave: (e: any) => defaultRippleEvent(e, getRipples, props),
});
