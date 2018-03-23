import { TweenLite } from 'gsap';

// Constants and defaults
import tabAnimations from '../defaults/tab-animations';

export default class AddTabButton {
  public left: number | 'auto' = 0;
  public ref: HTMLDivElement;

  public setLeft(left: 'auto' | number, animation = false) {
    if (!animation) {
      TweenLite.to(this.ref, 0, {
        left,
      });
    } else {
      TweenLite.to(this.ref, tabAnimations.left.duration, {
        left,
        ease: tabAnimations.left.easing,
      });
    }
    this.left = left;
  }
}
