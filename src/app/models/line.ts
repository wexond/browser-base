import { TweenLite } from 'gsap';
import { observable } from 'mobx';

// Constants and defaults
import tabAnimations from '../defaults/tab-animations';

// Models
import Tab from './tab'; // eslint-disable-line no-unused-vars

export default class Line {
  @observable public left = 0;
  @observable public width = 0;

  public moveToTab(tab: Tab) {
    TweenLite.to(this, tabAnimations.left.duration, {
      width: tab.width,
      left: tab.left,
      ease: tabAnimations.left.easing,
    });
  }
}
