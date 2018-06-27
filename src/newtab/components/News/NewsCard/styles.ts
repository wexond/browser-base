import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const Title = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoRegular()};
  ${typography.maxLines(3, 19)};
`;

export const Info = styled.div`
  display: flex;
  align-content: center;
  align-self: flex-end;
  font-size: 13px;

  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
`;

export interface IconProps {
  source: string;
}

export const Icon = styled.div`
  width: 18px;
  height: 18px;

  ${images.center('18px', 'auto')};
  background-image: url(${({ source }: IconProps) => source});
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
