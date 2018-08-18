import styled from 'styled-components';
import { transparency } from '~/defaults';
import { body2, centerImage } from '@mixins';

export const StyledForecastItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  color: rgba(0, 0, 0, ${transparency.light.secondaryText});
  ${body2()};
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 16px;
`;

export const WeatherIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  margin-right: 16px;
  ${centerImage('24px', 'auto')};

  background-image: url(${({ src }: { src: string }) => src});
`;

export const TempContainer = styled.div`
  width: 64px;
  text-align: right;
  white-space: nowrap;
`;

export const Temp = styled.span`
  color: rgba(
    0,
    0,
    0,
    ${({ night }: { night?: boolean }) =>
      night ? transparency.light.secondaryText : transparency.light.primaryText}
  );
`;
