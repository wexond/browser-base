import styled, { css } from 'styled-components';

import images from '../../../../shared/mixins/images';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const Root = styled.a`
  width: 100%;
  height: 56px;
  background-color: #fff;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-left: 16px;

  ${images.center('40px', 'auto')};

  ${({ src }: { src: string }) => css`
    background-image: url(${src});
  `};
`;

export const Username = styled.div`
  margin-left: 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoRegular()};
`;
