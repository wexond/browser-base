import * as React from 'react';
import styled, { StyledComponentClass, css } from 'styled-components';

import opacity from '../../defaults/opacity';

import { Align, SliderType } from '../../enums';
import { EASE_FUNCTION } from '../../constants';

import positioning from '../../mixins/positioning';
import typography from '../../mixins/typography';

export const StyledSlider = styled.div`
  width: 256px;
  height: 2px;
  position: relative;
  cursor: pointer;
`;

export const trackStyle = `
  height: 2px;
  position: absolute;
  top: 0;
  left: 0;
`;

export interface TrackProps {
  color: string;
  thumbAnimation?: boolean;
  type?: SliderType;
}

export const InactiveTrack = styled.div`
  width: 100%;

  ${trackStyle}
  opacity: ${opacity.light.disabledControl};
  background-color: ${({ color }: TrackProps) => color};
`;

export const ActiveTrack = styled.div`
  width: 50%;
  transition: 0.2s opacity;

  ${trackStyle}
  background-color: ${({ color }: TrackProps) => color};
  opacity: ${({ thumbAnimation }) => (thumbAnimation ? 0 : 1)};
  transition: ${({ type }) =>
    (type === SliderType.Discrete ? `0.15s width ${EASE_FUNCTION}` : 'unset')};
`;

export interface ThumbContainerProps {
  type: SliderType;
}

export const ThumbContainer = styled.div`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  position: relative;
  cursor: pointer;

  transition: ${({ type }: ThumbContainerProps) =>
    (type === SliderType.Discrete ? `0.15s left ${EASE_FUNCTION}` : 'unset')};

  &:hover .thumb-hover {
    width: 32px;
    height: 32px;
  }
`;

export interface ThumbHoverProps {
  color: string;
}

export const ThumbHover = styled.div`
  width: 0px;
  height: 0px;
  border-radius: 100%;
  position: absolute;
  transition: 0.2s width, 0.2s height;

  ${positioning.center(Align.CenterBoth)};
  opacity: ${opacity.light.dividers};
  background-color: ${({ color }: ThumbHoverProps) => color};
`;

export interface ThumbProps {
  color: string;
  thumbAnimation: boolean;
}

export const Thumb = styled.div`
  border-radius: 100%;
  position: absolute;
  transition: 0.15s width, 0.15s height;

  ${positioning.center(Align.CenterBoth)};
  background-color: ${({ color }: ThumbProps) => color};
  width: ${({ thumbAnimation }) => (thumbAnimation ? 0 : 12)}px;
  height: ${({ thumbAnimation }) => (thumbAnimation ? 0 : 12)}px;
`;

export const TicksContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
`;

export interface TickProps {
  color: string;
}

export const Tick = styled.div`
  width: 2px;
  height: 2px;
  position: relative;

  background-color: ${({ color }: TickProps) => color};
`;

export interface TickLineProps {
  color: string;
}

export const TickLine = styled.div`
  width: 2px;
  height: 12px;
  position: relative;

  ${positioning.center(Align.CenterVertical)};
  background-color: ${({ color }: TickLineProps) => color};
  opacity: 0.06;
`;

export const TickValue = styled.div`
  width: 32px;
  text-align: center;
  position: relative;
  white-space: nowrap;
  font-size: 12px;

  ${positioning.center(Align.CenterHorizontal)};
  ${typography.robotoRegular()}
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
`;
