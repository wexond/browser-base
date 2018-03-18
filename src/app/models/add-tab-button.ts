import { TweenLite } from 'gsap';
import { observable } from 'mobx';

// Constants and defaults
import { TOOLBAR_BUTTON_WIDTH } from '../constants/design';
import { tabAnimations } from '../defaults/tabs';

import Store from '../store';

export default class AddTabButton {
    @observable public left: number | 'auto' = 0;

    public setLeft(left: number, animation = true) {
      const containerWidth = Store.getTabBarWidth();

      if (left >= containerWidth - TOOLBAR_BUTTON_WIDTH) {
        if (this.left !== 'auto') {
          if (animation) {
            this.animate(containerWidth - TOOLBAR_BUTTON_WIDTH);
            setTimeout(() => {
              this.left = 'auto';
            }, tabAnimations.left.duration * 1000);
          } else {
            this.left = 'auto';
          }
        }
      } else {
        if (this.left === 'auto') {
          this.left = containerWidth - TOOLBAR_BUTTON_WIDTH;
        }

        if (animation) {
          this.animate(left);
        } else {
          this.left = left;
        }
      }
    }

    public animate(left: number) {
      const { easing, duration } = tabAnimations.left;

      TweenLite.to(this, duration, {
        left,
        ease: easing,
      });
    }
}
