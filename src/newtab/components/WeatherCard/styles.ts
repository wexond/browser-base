import styled from 'styled-components';

import images from '../../../shared/mixins/images';
import typography from '../../../shared/mixins/typography';
import opacity from '../../../shared/defaults/opacity';

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
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

export interface ITemperatureIconProps {
  src: string;
}

export const TemperatureIcon = styled.div`
  width: 96px;
  height: 96px;
  margin-right: 8px;
  align-self: center;

  ${images.center('100%', 'auto')};
  background-image: url(${(props: ITemperatureIconProps) => props.src});
`;

export const ErrorContainer = styled.div`
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
`;

export const ExtraInfoContainer = styled.div`
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
  align-items: center;
  justify-content: first-start;
`;

export const ExtraInfo = styled.div`
  display: flex;
  margin-left: 24px;

  &:first-child {
    margin-left: 0px;
  }

  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
`;

export interface IExtraInfoIconProps {
  src: string;
}

export const ExtraInfoIcon = styled.div`
  width: 24px;
  height: 24px;

  ${images.center('24px', 'auto')};
  background-image: url(${(props: IExtraInfoIconProps) => props.src});
`;

export const ExtraInfoText = styled.div`
  margin-left: 8px;
  align-self: center;
`;
