import { TweenLite } from 'gsap';
import tabAnimations from '../defaults/tab-animations';

export default class AddTabButton {
  public left = 0;

  public ref: HTMLDivElement;

  public setLeft(left: number, animation = false) {
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
