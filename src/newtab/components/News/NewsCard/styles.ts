import styled, { css } from 'styled-components';

import images from '../../../../shared/mixins/images';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const Title = styled.div`
  color: rgba(0, 0, 0, ${opacity.light.primaryText});
  margin-top: 16px;

  ${typography.subtitle1()};
  ${typography.maxLines(3)};
`;

export const Info = styled.div`
  display: flex;
  align-content: center;
  width: 100%;
  margin-bottom: 16px;
`;

export interface IconProps {
  source: string;
  visible: boolean;
}

export const Icon = styled.div`
  width: 18px;
  height: 18px;
  transition: 0.2s opacity;

  ${images.center('18px', 'auto')};
  background-image: url(${({ source }: IconProps) => source});
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export const Source = styled.div`
  margin-left: 8px;
  font-size: 12px;
`;

export const SecondaryText = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  margin-top: 12px;
`;

export const CardImage = styled.div`
  width: 100%;
  height: 194px;
  background-size: cover;
  background-position: center;
  transition: 0.2s opacity;

  ${({ src, visible }: { src: string; visible: boolean }) => css`
    background-image: url(${src});
    opacity: ${visible ? 1 : 0};
  `};
`;

export const Overline = styled.div`
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  margin-top: 4px;
  ${typography.overline()};
`;

export const SourceContainer = styled.div`
  margin-top: 16px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  display: flex;
  align-items: center;
`;
