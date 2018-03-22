import { TweenLite } from 'gsap';

// Constants and defaults
import { TOOLBAR_BUTTON_WIDTH } from '../constants/design';
import tabAnimations from '../defaults/tab-animations';

import Store from '../store';

export default class AddTabButton {
  public left: number | 'auto' = 0;
  public ref: HTMLDivElement;

  public updateLeft(left: number, animation = true) {
    const containerWidth = Store.getTabBarWidth();

    if (left >= containerWidth - TOOLBAR_BUTTON_WIDTH) {
      if (this.left !== 'auto') {
        if (animation) {
          this.setLeft(containerWidth - TOOLBAR_BUTTON_WIDTH, true);
          setTimeout(() => {
            this.setLeft('auto');
          }, tabAnimations.left.duration * 1000);
        } else {
          this.setLeft('auto');
        }
      }
    } else {
      if (this.left === 'auto') {
        this.setLeft(containerWidth - TOOLBAR_BUTTON_WIDTH, animation);
      }

      this.setLeft(left, animation);
    }
  }

  public setLeft(left: 'auto' | number, animation = false) {
    if (!animation) {
      this.ref.style.left = (left === 'auto' ? 'auto' : `${left}px`);
    } else {
      TweenLite.to(this.ref, tabAnimations.left.duration, {
        left,
        ease: tabAnimations.left.easing,
      });
    }
    this.left = left;
  }
}
