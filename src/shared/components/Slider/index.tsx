import * as React from 'react';

import { getEvents } from '../../utils/events';
import { getRippleEvents } from '../../utils/ripple';
import { hexToRgb } from '../../utils/colors';

import Ripples from '../Ripples';

import opacity from '../../defaults/opacity';
import colors from '../../defaults/colors';
import { SliderType, ButtonType } from '../../enums';

import {
  StyledSlider,
  InactiveTrack,
  ActiveTrack,
  ThumbContainer,
  ThumbHover,
  Thumb,
  TicksContainer,
  Tick,
  TickLine,
  TickValue,
} from './styles';

export interface Props {
  color?: string;
  type?: SliderType;
  minValue?: number;
  maxValue?: number;
  ticks?: any;
  style?: any;
  selectedTickColor?: string;
}

export interface State {
  trackWidth: string;
  thumbAnimation: boolean;
  unselectedTickColor: string;
  selectedTickIndex: number;
}

export default class Slider extends React.Component<Props, State> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: SliderType.Continuous,
    showTicksValues: false,
    selectedTickColor: 'rgba(255, 255, 255, 0.38)',
  };

  public state: State = {
    trackWidth: '0%',
    thumbAnimation: false,
    unselectedTickColor: colors.deepPurple['500'],
    selectedTickIndex: 0,
  };

  private inactiveTrack: HTMLDivElement;

  private ticksList: any = [];

  private ripples: Ripples;

  private isMouseDown: boolean = false;

  public componentDidMount() {
    const { color } = this.props;

    const rgb = hexToRgb(color);
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.light.disabledIcon})`;

    this.setState({
      unselectedTickColor: rgba,
    });

    window.addEventListener('mouseup', this.onWindowMouseUp);
    window.addEventListener('mousemove', this.onWindowMouseMove);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const { type } = this.props;
    const clientX = e.clientX;

    if (!this.isMouseDown) {
      if (type !== SliderType.Discrete) {
        this.setState({ thumbAnimation: true });

        setTimeout(() => {
          this.setState({
            thumbAnimation: false,
            trackWidth: `${this.getPercent(clientX)}%`,
          });
        }, 150);
      } else {
        const gap = this.getGap();

        for (let i = 0; i < this.ticksList.length; i++) {
          const rect = this.ticksList[i].getBoundingClientRect();

          if (rect.left >= clientX + gap / 2) {
            const tickRect = this.ticksList[i - 1].getBoundingClientRect();

            this.setState({
              selectedTickIndex: i - 1,
              trackWidth: `${this.getPercent(tickRect.left)}%`,
            });

            break;
          }

          if (i === this.ticksList.length - 1) {
            const tickRect = this.ticksList[i].getBoundingClientRect();

            this.setState({
              selectedTickIndex: i,
              trackWidth: `${this.getPercent(tickRect.left)}%`,
            });
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
    const { type } = this.props;

    if (this.isMouseDown) {
      if (type !== SliderType.Discrete) {
        this.setState({
          trackWidth: `${this.getPercent(e.clientX)}%`,
        });
      } else {
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
              trackWidth: `${this.getPercent(tickRect.left)}%`,
            });
          }
        }
      }
    }
  };

  public getPercent = (clientX: number) => {
    const inactiveTrackRect = this.inactiveTrack.getBoundingClientRect();
    const posX = clientX - inactiveTrackRect.left;
    const percent = (posX * 100) / this.inactiveTrack.clientWidth;

    if (percent < 0) return 0;
    if (percent > 100) return 100;

    return percent;
  };

  public getGap = () => this.inactiveTrack.clientWidth / (this.ticksList.length - 1);

  public showTicksValues = () => {
    const { ticks } = this.props;
    return Object.prototype.toString.call(ticks) === '[object Object]';
  };

  public render() {
    const {
      color, ticks, style, type, selectedTickColor,
    } = this.props;

    const {
      trackWidth, thumbAnimation, unselectedTickColor, selectedTickIndex,
    } = this.state;

    const trackStyle = { width: trackWidth };
    const thumbStyle = { left: trackWidth };

    const ticksArray = Object.prototype.toString.call(ticks) === '[object Array]';
    let tickIndex = 0;
    this.ticksList = [];

    return (
      <React.Fragment>
        <StyledSlider onMouseDown={this.onMouseDown} style={style}>
          <InactiveTrack innerRef={r => (this.inactiveTrack = r)} color={color} />
          <ActiveTrack
            type={type}
            color={color}
            thumbAnimation={thumbAnimation}
            style={trackStyle}
          />
          <TicksContainer>
            {type === SliderType.Discrete
              && typeof ticks === 'object'
              && (ticksArray ? ticks : Object.keys(ticks)).map((data: any, key: any) => {
                const tickValue = !ticksArray && ticks[data];
                tickIndex++;

                return (
                  <Tick
                    innerRef={r => r != null && this.ticksList.push(r)}
                    key={key}
                    color={tickIndex <= selectedTickIndex ? selectedTickColor : unselectedTickColor}
                  >
                    {!ticksArray && (
                      <React.Fragment>
                        <TickLine color={color} />
                        {tickValue != null && <TickValue>{data}</TickValue>}
                      </React.Fragment>
                    )}
                  </Tick>
                );
              })}
          </TicksContainer>
          <ThumbContainer type={type} style={thumbStyle} onMouseDown={this.onThumbMouseDown}>
            <ThumbHover className="thumb-hover" color={color} />
            <Thumb thumbAnimation={thumbAnimation} color={color} />
          </ThumbContainer>
        </StyledSlider>
      </React.Fragment>
    );
  }
}
