import styled from 'styled-components';

import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';
import images from '../../../../shared/mixins/images';

export const StyledForecastItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  ${typography.body2()};
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
  ${images.center('24px', 'auto')};

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
    (night ? opacity.light.secondaryText : opacity.light.primaryText)}
  );
`;
