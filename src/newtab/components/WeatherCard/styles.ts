import styled from 'styled-components';

import images from '../../../shared/mixins/images';
import typography from '../../../shared/mixins/typography';
import opacity from '../../../shared/defaults/opacity';

import { EASE_FUNCTION } from '../../../shared/constants';

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 16px 0px 16px;
`;

export const Temperature = styled.div`
  font-size: 96px;
  display: flex;

  ${typography.robotoLight()};
`;

export const TemperatureDeg = styled.div`
  margin-top: 12px;
  margin-left: 4px;
  font-size: 48px;

  ${typography.robotoRegular()};
`;

export interface TemperatureIconProps {
  src: string;
}

export const TemperatureIcon = styled.div`
  width: 96px;
  height: 96px;
  margin-right: 8px;
  align-self: center;

  ${images.center('100%', 'auto')};
  background-image: url(${({ src }: TemperatureIconProps) => src});
`;

export const ErrorContainer = styled.div`
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
`;

export const ExtraInfoContainer = styled.div`
  display: flex;
  padding-top: 16px;
  align-items: center;
  justify-content: first-start;
  margin-top: 16px;
  padding: 0px 16px 0px 16px;
`;

export const ExtraInfo = styled.div`
  display: flex;
  margin-left: 24px;

  color: rgba(0, 0, 0, ${opacity.light.secondaryText});

  &:first-child {
    margin-left: 0px;
  }
`;

export interface ExtraInfoIconProps {
  src: string;
}

export const ExtraInfoIcon = styled.div`
  width: 24px;
  height: 24px;

  ${images.center('24px', 'auto')};
  background-image: url(${({ src }: ExtraInfoIconProps) => src});
`;

export const ExtraInfoText = styled.div`
  margin-left: 8px;
  align-self: center;
`;

export interface ForecastContainerProps {
  height: number;
}

export const ForecastContainer = styled.div`
  margin-top: 24px;
  overflow: hidden;
  transition: 0.5s ${EASE_FUNCTION} height;

  height: ${({ height }: ForecastContainerProps) => height}px;
`;
