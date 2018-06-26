import * as React from 'react';
import styled, { StyledComponentClass, css } from 'styled-components';

import opacity from '../../defaults/opacity';

import { Align } from '../../enums';

import positioning from '../../mixins/positioning';

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
}

export const UnderTrack = styled.div`
  width: 100%;

  ${trackStyle}
  opacity: ${opacity.light.disabledControl};
  background-color: ${({ color }: TrackProps) => color};
`;

export const Track = styled.div`
  width: 50%;
  transition: 0.2s opacity;

  ${trackStyle}
  background-color: ${({ color }: TrackProps) => color};
  opacity: ${({ thumbAnimation }) => (thumbAnimation ? 0 : 1)};
`;

export const ThumbContainer = styled.div`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  position: relative;
  cursor: pointer;

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
