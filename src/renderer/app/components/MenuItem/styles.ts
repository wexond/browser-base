import styled, { css } from 'styled-components';

import { robotoRegular, noUserSelect, centerImage } from '@/mixins';
import { transparency } from '@/constants/renderer';

export const Root = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 13px;
  position: relative;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});

  ${robotoRegular()};
  ${noUserSelect()};

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const Icon = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 24px;
  margin-right: 24px;
  opacity: ${transparency.light.inactiveIcon};

  ${centerImage('20px', '20px')};

  ${({ src }: { src: string }) => css`
    background-image: url(${src});
  `};
`;
