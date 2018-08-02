import { TweenLite } from 'gsap';
import { observable } from 'mobx';
import Tab from './tab';
import tabAnimations from '../defaults/tab-animations';

export default class TabsIndicator {
  @observable
  public left = 0;

  @observable
  public width = 0;

  public moveToTab(tab: Tab, animation = true) {
    TweenLite.to(this, animation ? tabAnimations.left.duration : 0, {
      width: tab.width,
      left: tab.left,
      ease: tabAnimations.left.easing,
    });
  }
}
