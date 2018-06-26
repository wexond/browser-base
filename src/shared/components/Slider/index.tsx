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
}

export default class Slider extends React.Component<Props, State> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: SliderType.Continuous,
  };

  public state: State = {
    trackWidth: '50%',
  };

  private thumbContainer: HTMLDivElement;

  private underTrack: HTMLDivElement;

  private ripples: Ripples;

  private isMouseDown: boolean = false;

  public componentDidMount() {
    window.addEventListener('mouseup', this.onWindowMouseUp);
    window.addEventListener('mousemove', this.onWindowMouseMove);
  }

  public onThumbMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    this.isMouseDown = true;
  };

  public onWindowMouseUp = (e: MouseEvent) => {
    this.isMouseDown = false;
  };

  public onWindowMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown) {
      const underTrackRect = this.underTrack.getBoundingClientRect();
      const posX = e.clientX - underTrackRect.left;

      let percent = (posX * 100) / this.underTrack.clientWidth;

      if (percent < 0) percent = 0;
      else if (percent > 100) percent = 100;

      this.setState({
        trackWidth: `${percent}%`,
      });
    }
  };

  public render() {
    const { color } = this.props;
    const { trackWidth } = this.state;

    const trackStyle = {
      width: trackWidth,
    };

    const thumbStyle = {
      left: trackWidth,
    };

    return (
      <StyledSlider>
        <UnderTrack innerRef={r => (this.underTrack = r)} color={color} />
        <Track color={color} style={trackStyle} />
        <ThumbContainer
          innerRef={r => (this.thumbContainer = r)}
          style={thumbStyle}
          onMouseDown={this.onThumbMouseDown}
        >
          <ThumbHover className="thumb-hover" color={color} />
          <Thumb color={color} />
        </ThumbContainer>
      </StyledSlider>
    );
  }
}
