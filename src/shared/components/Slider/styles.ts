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
}

export const UnderTrack = styled.div`
  width: 100%;

  ${trackStyle}
  opacity: ${opacity.light.disabledControl};
  background-color: ${({ color }: TrackProps) => color};
`;

export const Track = styled.div`
  width: 50%;

  ${trackStyle}
  background-color: ${({ color }: TrackProps) => color};
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
}

export const Thumb = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  position: absolute;

  background-color: ${({ color }: ThumbProps) => color};
  ${positioning.center(Align.CenterBoth)};
`;
