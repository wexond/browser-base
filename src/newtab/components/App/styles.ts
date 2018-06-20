import styled from 'styled-components';

import images from '../../../shared/mixins/images';

export const StyledApp = styled.div`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 32px;
  padding-right: 32px;
  background-color: #f5f5f5;
`;

export const Container = styled.div`
  max-width: 960px;
  width: 100%;
  height: 500px;
  margin: 32px auto;
`;

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
`;

export const Temperature = styled.div`
  font-size: 96px;
`;

export interface ITemperatureIconProps {
  src: string;
}

export const TemperatureIcon = styled.div`
  width: 80px;
  height: 80px;

  ${images.center('80px', 'auto')};
  background-image: url(${(props: ITemperatureIconProps) => props.src});
`;
