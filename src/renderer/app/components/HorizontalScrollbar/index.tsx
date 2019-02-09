import * as React from 'react';
import { observer } from 'mobx-react';

import { Root, Thumb } from './style';

interface Props {
  getContainer: () => HTMLDivElement;
  visible: boolean;
  enabled: boolean;
}

interface State {
  visible: boolean;
  thumbWidth: number;
  thumbLeft: number;
}

export default class HorizontalScrollbar extends React.Component<Props, State> {
  public state: State = {
    visible: false,
    thumbWidth: 0,
    thumbLeft: 0,
  };

  private scrollData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
  };

  private container: HTMLDivElement;
  private isScrollingToEnd: boolean = false;
  private scrollTimeout: any;
  private unmounted: boolean = false;

  public componentDidMount() {
    this.container = this.props.getContainer();

    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('wheel', this.onWheel);
    this.unmounted = false;

    this.resizeScrollbar();
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('wheel', this.onWheel);
    this.unmounted = true;
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      this.state.visible !== nextState.visible ||
      this.props.enabled !== nextProps.enabled
    ) {
      return true;
    }

    if (nextState.visible && this.props.visible !== nextProps.visible) {
      return true;
    }

    if (nextProps.visible && nextState.visible) {
      if (
        this.state.thumbLeft !== nextState.thumbLeft ||
        this.state.thumbWidth !== nextState.thumbWidth
      ) {
        return true;
      }
    }

    return false;
  }

  public resizeScrollbar = () => {
    if (this.props && this.container) {
      if (this.unmounted) return;

      const { scrollWidth, offsetWidth, scrollLeft } = this.container;

      this.setState(({ thumbWidth }) => {
        return {
          thumbLeft: (scrollLeft / scrollWidth) * offsetWidth,
          thumbWidth: offsetWidth ** 2 / scrollWidth,
          visible: Math.ceil(thumbWidth) !== Math.ceil(offsetWidth),
        };
      });

      requestAnimationFrame(this.resizeScrollbar);
    }
  };

  public onWheel = (e: any) => {
    if (!this.container) return;

    const { deltaX, deltaY } = e;
    const { scrollLeft } = this.container;

    const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    const target = delta / 2;

    this.isScrollingToEnd = false;

    this.container.scrollLeft = scrollLeft + target;
  };

  public onMouseUp = () => {
    this.scrollData = {
      ...this.scrollData,
      dragging: false,
    };
  };

  public onMouseMove = (e: any) => {
    if (this.scrollData.dragging && this.container) {
      const { startLeft, mouseStartX } = this.scrollData;
      const { offsetWidth, scrollWidth } = this.container;
      this.container.scrollLeft =
        ((startLeft + e.pageX - mouseStartX) / offsetWidth) * scrollWidth;
    }
  };

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.isScrollingToEnd = false;

    this.scrollData = {
      ...this.scrollData,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: this.state.thumbLeft,
    };
  };

  public scrollToEnd = (milliseconds: number) => {
    if (!this.props.enabled) return;

    const frame = () => {
      if (!this.isScrollingToEnd) return;
      this.container.scrollLeft = this.container.scrollWidth;
      requestAnimationFrame(frame);
    };

    if (!this.isScrollingToEnd) {
      this.isScrollingToEnd = true;
      frame();
    }

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      this.isScrollingToEnd = false;
    }, milliseconds);
  };

  public render() {
    const { visible, thumbWidth, thumbLeft } = this.state;
    const { enabled } = this.props;

    return (
      <Root visible={visible && enabled}>
        <Thumb
          style={{
            width: thumbWidth,
            left: thumbLeft,
          }}
          visible={this.props.visible}
          onMouseDown={this.onMouseDown}
        />
      </Root>
    );
  }
}
