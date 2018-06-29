import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../defaults/opacity';

export const Root = styled.div`
  height: 4px;
  width: 240px;
  position: relative;
`;

export const trackStyle = `
  height: 4px;
  position: absolute;
`;

export interface TrackProps {
  color: string;
}

export const Track = styled.div`
  width: 100%;
  opacity: ${opacity.light.disabledControl};

  ${trackStyle}
  background-color: ${({ color }: TrackProps) => color};
`;

export interface IndicatorProps {
  color: string;
}

export const Indicator = styled.div`
  ${trackStyle}
  background-color: ${({ color }: IndicatorProps) => color};
`;
