import styled from 'styled-components';

import images from '../../../shared/mixins/images';
import typography from '../../../shared/mixins/typography';

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
`;

export const Temperature = styled.div`
  font-size: 96px;

  ${typography.robotoLight()};
`;

export interface ITemperatureIconProps {
  src: string;
}

export const TemperatureIcon = styled.div`
  width: 96px;
  height: 96px;
  align-self: center;

  ${images.center('100%', 'auto')};
  background-image: url(${(props: ITemperatureIconProps) => props.src});
`;
