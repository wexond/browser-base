import anime from 'animejs';
import { TAB_ANIMATION_DURATION } from '../constants';

export const animateTab = (
  property: 'translateX' | 'width',
  value: number,
  domElement: any,
  animation: boolean,
) => {
  if (animation) {
    anime({
      targets: domElement,
      [property]: value,
      duration: TAB_ANIMATION_DURATION,
      easing: 'easeOutCirc',
    });
  } else {
    anime.set(domElement, {
      [property]: value,
    });
  }
};
