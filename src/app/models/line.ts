import { TweenLite } from "gsap";
import { observable } from "mobx";

// Constants and defaults
import { tabAnimations } from "../defaults/tabs";

// Models
import Tab from "./tab";

export default class Line {
    @observable public left = 0;
    @observable public width = 0;

    public moveToTab(tab: Tab) {
        TweenLite.to(this, tabAnimations.left.duration, {
            width: tab.targetWidth,
            left: tab.targetLeft,
            ease: tabAnimations.left.easing
        });
    }
}