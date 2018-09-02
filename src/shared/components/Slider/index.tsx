import React from 'react';

import { colors, transparency } from '@/constants/renderer';
import { hexToRgb } from '@/utils/colors';

import {
  ActiveTrack,
  InactiveTrack,
  StyledSlider,
  Thumb,
  ThumbContainer,
  ThumbHover,
  Tick,
  TicksContainer,
  TickValue,
} from './styles';

export type SliderEvent = (value?: any, element?: Slider) => void;

export interface Props {
  color?: string;
  continuous?: boolean;
  discrete?: boolean;
  minValue?: number;
  maxValue?: number;
  ticks?: any;
  style?: any;
  showTicksLabels?: boolean;
  selectedTickColor?: string;
  onChange?: SliderEvent;
}

export interface State {
  trackWidth: number;
  thumbAnimation: boolean;
  unselectedTickColor: string;
  selectedTickIndex: number;
}

export default class Slider extends React.Component<Props, State> {
  public static defaultProps = {
    color: colors.blue['500'],
    continuous: true,
    discreate: false,
    ticks: [1, 2],
    showTicksLabels: false,
    selectedTickColor: 'rgba(255, 255, 255, 0.54)',
  };

  public state: State = {
    trackWidth: 0,
    thumbAnimation: false,
    unselectedTickColor: colors.deepPurple['500'],
    selectedTickIndex: 0,
  };

  private inactiveTrack: HTMLDivElement;

  private ticksList: any = [];

  private isMouseDown: boolean = false;

  public componentDidMount() {
    const { color } = this.props;

    const rgb = hexToRgb(color);
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
      transparency.light.disabledIcon
    })`;

    this.setState({
      unselectedTickColor: rgba,
    });

    window.addEventListener('mouseup', this.onWindowMouseUp);
    window.addEventListener('mousemove', this.onWindowMouseMove);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const { continuous, discrete } = this.props;
    const clientX = e.clientX;

    if (!this.isMouseDown) {
      if (continuous && !discrete) {
        const width = this.getPercent(clientX);

        this.setState({ thumbAnimation: true });
        this.triggerEvent(width);

        setTimeout(() => {
          this.setState({
            thumbAnimation: false,
            trackWidth: width,
          });
        }, 150);
      } else if (discrete) {
        const gap = this.getGap();

        for (let i = 0; i < this.ticksList.length; i++) {
          const rect = this.ticksList[i].getBoundingClientRect();

          if (rect.left >= clientX + gap / 2) {
            const tickRect = this.ticksList[i - 1].getBoundingClientRect();

            this.setState({
              selectedTickIndex: i - 1,
              trackWidth: this.getPercent(tickRect.left),
            });

            this.triggerEvent(i - 1);
            break;
          }

          if (i === this.ticksList.length - 1) {
            const tickRect = this.ticksList[i].getBoundingClientRect();

            this.setState({
              selectedTickIndex: i,
              trackWidth: this.getPercent(tickRect.left),
            });

            this.triggerEvent(i);
            break;
          }
        }
      }
    }
  };

  public onThumbMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    this.isMouseDown = true;
  };

  public onWindowMouseUp = (e: MouseEvent) => {
    this.isMouseDown = false;
  };

  public onWindowMouseMove = (e: MouseEvent) => {
    const { continuous, discrete } = this.props;

    if (this.isMouseDown) {
      if (continuous && !discrete) {
        const width = this.getPercent(e.clientX);

        this.setState({ trackWidth: width });
        this.triggerEvent(width);
      } else if (discrete) {
        const gap = this.getGap();

        const { selectedTickIndex } = this.state;
        const selectedTick = this.ticksList[selectedTickIndex];
        const selectedTickRect = selectedTick.getBoundingClientRect();
        const right = selectedTickRect.left - gap / 2 <= e.clientX;

        const tickIndex = right ? selectedTickIndex + 1 : selectedTickIndex - 1;

        if (tickIndex >= 0 && tickIndex < this.ticksList.length) {
          const tickRect = this.ticksList[tickIndex].getBoundingClientRect();

          if (tickRect.left - gap / 2 <= e.clientX) {
            this.setState({
              selectedTickIndex: tickIndex,
              trackWidth: this.getPercent(tickRect.left),
            });

            this.triggerEvent(tickIndex);
          }
        }
      }
    }
  };

  public getPercent = (clientX: number) => {
    const inactiveTrackRect = this.inactiveTrack.getBoundingClientRect();
    const posX = clientX - inactiveTrackRect.left;
    const percent = (posX * 100) / this.inactiveTrack.clientWidth;

    if (percent < 0) {
      return 0;
    }
    if (percent > 100) {
      return 100;
    }

    return percent;
  };

  public getGap = () =>
    this.inactiveTrack.clientWidth / (this.ticksList.length - 1);

  public triggerEvent = (value: any) => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(value, this);
    }
  };

  public render() {
    const {
      color,
      ticks,
      style,
      continuous,
      discrete,
      selectedTickColor,
      showTicksLabels,
    } = this.props;

    const {
      trackWidth,
      thumbAnimation,
      unselectedTickColor,
      selectedTickIndex,
    } = this.state;

    const trackStyle = { width: `${trackWidth}%` };
    const thumbStyle = { left: `${trackWidth}%` };

    let tickIndex = 0;
    this.ticksList = [];

    return (
      <React.Fragment>
        <StyledSlider onMouseDown={this.onMouseDown} style={style}>
          <InactiveTrack
            innerRef={r => (this.inactiveTrack = r)}
            color={color}
          />
          <ActiveTrack
            discrete={discrete}
            color={color}
            thumbAnimation={thumbAnimation}
            style={trackStyle}
          />
          <TicksContainer>
            {discrete &&
              typeof ticks === 'object' &&
              ticks.map((data: any, key: any) => {
                tickIndex++;

                return (
                  <Tick
                    innerRef={r => r != null && this.ticksList.push(r)}
                    key={key}
                    color={
                      tickIndex <= selectedTickIndex
                        ? selectedTickColor
                        : unselectedTickColor
                    }
                  >
                    {showTicksLabels &&
                      data != null && <TickValue>{data}</TickValue>}
                  </Tick>
                );
              })}
          </TicksContainer>
          <ThumbContainer
            discrete={discrete}
            style={thumbStyle}
            onMouseDown={this.onThumbMouseDown}
          >
            <ThumbHover className="thumb-hover" color={color} />
            <Thumb thumbAnimation={thumbAnimation} color={color} />
          </ThumbContainer>
        </StyledSlider>
      </React.Fragment>
    );
  }
}
