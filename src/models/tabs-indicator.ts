import { observable } from 'mobx';
import { TweenLite } from 'gsap';
import { Tab } from '.';
import { tabAnimations } from '../defaults';

export class TabsIndicator {
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
