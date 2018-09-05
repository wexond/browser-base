import styled, { css } from 'styled-components';

import { colors, transparency } from '@/constants/renderer';
import { robotoMedium } from '@/mixins';

export const StyledItem = styled.div`
  width: 100%;
  height: 48px;
  padding-right: 16px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const Icon = styled.div`
  height: 24px;
  width: 24px;
  margin-left: 16px;
  opacity: 0.5;
  background-color: #000;

  ${({ src }: { src: string }) => css`
    mask-image: url(${src});
  `};
`;

export const Title = styled.div`
  font-size: 14px;
  margin-left: 32px;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});

  ${robotoMedium()};
`;
