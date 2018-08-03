import styled from 'styled-components';
import typography from '../../../mixins/typography';
import images from '../../../mixins/images';
import opacity from '../../../defaults/opacity';
import { EASE_FUNCTION } from '../../../constants';
import { Actions } from '../../../components/Card';

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 16px 0px 16px;
`;

export const Temperature = styled.div`
  display: flex;
  ${typography.h1()};
`;

export const TemperatureDeg = styled.div`
  margin-top: 12px;
  margin-left: 4px;
  ${typography.h3()};
`;

export const TemperatureIcon = styled.div`
  width: 96px;
  height: 96px;
  margin-right: 8px;
  align-self: center;
  ${images.center('100%', 'auto')};

  background-image: url(${({ src }: { src: string }) => src});
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

export const ExtraInfoIcon = styled.div`
  width: 24px;
  height: 24px;
  ${images.center('24px', 'auto')};

  background-image: url(${({ src }: { src: string }) => src});
`;

export const ExtraInfoText = styled.div`
  margin-left: 8px;
  align-self: center;
`;

export const ForecastContainer = styled.div`
  margin-top: 48px;
  overflow: hidden;
  transition: 0.5s ${EASE_FUNCTION} height;

  height: ${({ height }: { height: number }) => height}px;
`;

export const ActionsContainer = styled(Actions)`
  border-top: 1px solid rgba(0, 0, 0, 0.12);

  ${({ expanded }: { expanded: boolean }) => `
    margin-top: ${expanded ? 16 : 8}px;
  `};
`;
