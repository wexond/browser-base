import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const Title = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoRegular()};
  ${typography.maxLines(3)};
`;

export const Info = styled.div`
  display: flex;
  align-content: center;
  align-self: flex-end;
  margin-top: 8px;
  font-size: 13px;

  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
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
`;

export const CardHeaderText = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
`;
