import { TweenLite } from 'gsap';
import { observable } from 'mobx';
import Tab from './tab';
import tabAnimations from '../defaults/tab-animations';

export default class TabsIndicator {
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
