import styled, { css } from 'styled-components';

import { robotoRegular, noUserSelect, centerImage } from '@mixins';
import { transparency } from '~/renderer/defaults';

export const Root = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 13px;
  position: relative;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});

  ${robotoRegular()};
  ${noUserSelect()};
`;

export const Icon = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 16px;
  margin-right: 16px;
  opacity: ${transparency.light.inactiveIcon};

  ${({ src }: { src: string }) => css`
    background-image: url(${src});
  `};

  ${centerImage('16px', '16px')};
`;
