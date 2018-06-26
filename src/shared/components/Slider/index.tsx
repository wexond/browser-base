import * as React from 'react';

import { getEvents } from '../../utils/events';
import { getRippleEvents } from '../../utils/ripple';

import Ripples from '../Ripples';

import colors from '../../defaults/colors';
import { SliderType, ButtonType } from '../../enums';

import {
  StyledSlider, UnderTrack, Track, ThumbContainer, ThumbHover, Thumb,
} from './styles';

export interface Props {
  color?: string;
  type?: SliderType;
  minValue: number;
  maxValue: number;
  ticks?: any;
}

export interface State {
  trackWidth: string;
  thumbAnimation: boolean;
}

export default class Slider extends React.Component<Props, State> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: SliderType.Continuous,
  };

  public state: State = {
    trackWidth: '50%',
    thumbAnimation: false,
  };

  private thumbContainer: HTMLDivElement;

  private underTrack: HTMLDivElement;

  private ripples: Ripples;

  private isMouseDown: boolean = false;

  public componentDidMount() {
    window.addEventListener('mouseup', this.onWindowMouseUp);
    window.addEventListener('mousemove', this.onWindowMouseMove);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (!this.isMouseDown) {
      const clientX = e.clientX;

      this.setState({ thumbAnimation: true });

      setTimeout(() => {
        this.setState({
          thumbAnimation: false,
          trackWidth: `${this.getPercent(clientX)}%`,
        });
      }, 150);
    }
  };

  public onThumbMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    this.isMouseDown = true;
  };

  public onWindowMouseUp = (e: MouseEvent) => {
    this.isMouseDown = false;
  };

  public onWindowMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown) {
      this.setState({
        trackWidth: `${this.getPercent(e.clientX)}%`,
      });
    }
  };

  public getPercent = (clientX: number) => {
    const underTrackRect = this.underTrack.getBoundingClientRect();
    const posX = clientX - underTrackRect.left;
    const percent = (posX * 100) / this.underTrack.clientWidth;

    if (percent < 0) return 0;
    if (percent > 100) return 100;

    return percent;
  };

  public render() {
    const { color } = this.props;
    const { trackWidth, thumbAnimation } = this.state;

    const trackStyle = {
      width: trackWidth,
    };

    const thumbStyle = {
      left: trackWidth,
    };

    return (
      <StyledSlider onMouseDown={this.onMouseDown}>
        <UnderTrack innerRef={r => (this.underTrack = r)} color={color} />
        <Track color={color} thumbAnimation={thumbAnimation} style={trackStyle} />
        <ThumbContainer
          innerRef={r => (this.thumbContainer = r)}
          style={thumbStyle}
          onMouseDown={this.onThumbMouseDown}
        >
          <ThumbHover className="thumb-hover" color={color} />
          <Thumb thumbAnimation={thumbAnimation} color={color} />
        </ThumbContainer>
      </StyledSlider>
    );
  }
}
