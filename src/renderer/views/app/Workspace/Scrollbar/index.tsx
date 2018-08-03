import React from 'react';
import { observer } from 'mobx-react';
import { TweenLite, Expo } from 'gsap';
import { Root, Thumb } from './styles';
import Tab from '../../../../models/tab';
import tabAnimations from '../../../../defaults/tab-animations';

interface Props {
  scrollbar: any;
  getTabs: () => HTMLDivElement;
}

@observer
export default class Scrollbar extends React.Component<Props, {}> {
  private scrollData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
    newScrollLeft: -1,
    maxScrollLeft: 0,
  };

  private scrollInterval: any;

  private scrollTimeout: any;

  public componentDidMount() {
    const { getTabs } = this.props;
    const tabs = getTabs();

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    tabs.addEventListener('wheel', this.onWheel);

    this.resizeScrollbar();
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('wheel', this.onWheel);
  }

  public resizeScrollbar = () => {
    const { scrollbar, getTabs } = this.props;
    const tabs = getTabs();

    if (this.props && tabs) {
      const { scrollWidth, offsetWidth, scrollLeft } = tabs;

      scrollbar.thumbWidth = offsetWidth ** 2 / scrollWidth;
      scrollbar.thumbLeft = (scrollLeft / scrollWidth) * offsetWidth;
      scrollbar.visible = Math.ceil(scrollbar.thumbWidth) !== Math.ceil(tabs.offsetWidth);

      requestAnimationFrame(this.resizeScrollbar);
    }
  };

  public onWheel = (e: any) => {
    const { getTabs } = this.props;
    const tabs = getTabs();
    const { deltaX, deltaY } = e;
    const { scrollLeft, scrollWidth, offsetWidth } = tabs;

    let { newScrollLeft } = this.scrollData;

    const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    const target = delta / 2;

    clearInterval(this.scrollInterval);

    if (scrollLeft !== newScrollLeft && newScrollLeft !== -1) {
      newScrollLeft += target;
    } else {
      newScrollLeft = scrollLeft + target;
    }

    if (newScrollLeft > scrollWidth - offsetWidth) {
      newScrollLeft = scrollWidth - offsetWidth;
    }
    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    }

    this.scrollData = {
      ...this.scrollData,
      newScrollLeft,
    };

    TweenLite.to(tabs, 0.3, {
      scrollLeft: newScrollLeft,
      ease: Expo.easeOut,
    });
  };

  public onMouseUp = () => {
    this.scrollData = {
      ...this.scrollData,
      dragging: false,
    };
  };

  public onMouseMove = (e: any) => {
    if (this.scrollData.dragging) {
      const { getTabs } = this.props;
      const tabs = getTabs();

      const { startLeft, mouseStartX } = this.scrollData;
      const { offsetWidth, scrollWidth } = tabs;
      tabs.scrollLeft = ((startLeft + e.pageX - mouseStartX) / offsetWidth) * scrollWidth;
    }
  };

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { scrollbar } = this.props;

    clearInterval(this.scrollInterval);

    this.scrollData = {
      ...this.scrollData,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: scrollbar.thumbLeft,
    };
  };

  public onNewTab = (tab: Tab) => {
    const { getTabs } = this.props;
    const width = tab.getWidth();
    const tabs = getTabs();

    this.scrollData.maxScrollLeft += width;

    clearInterval(this.scrollInterval);

    this.scrollInterval = setInterval(() => {
      tabs.scrollLeft = this.scrollData.maxScrollLeft;
    }, 1);

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      clearInterval(this.scrollInterval);
    }, tabAnimations.left.duration * 1000);
  };

  public render() {
    const { scrollbar } = this.props;
    const {
      visible, thumbWidth, thumbLeft, thumbVisible,
    } = scrollbar;

    return (
      <Root visible={visible}>
        <Thumb
          style={{
            width: thumbWidth,
            left: thumbLeft,
          }}
          visible={thumbVisible}
          onMouseDown={this.onMouseDown}
        />
      </Root>
    );
  }
}
