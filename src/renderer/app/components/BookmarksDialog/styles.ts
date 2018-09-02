import styled, { css } from 'styled-components';

import { EASE_FUNCTION } from '@/constants/app';
import { shadows, robotoRegular } from '@/mixins';
import { transparency } from '@/constants/renderer';

export const Root = styled.div`
  width: 364px;
  background-color: #fff;
  position: absolute;
  top: 44px;
  right: 0;
  z-index: 100;
  border-radius: 4px;
  padding: 16px;
  transform-origin: top right;
  will-change: transform, opacity;

  box-shadow: ${shadows(8)};

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    transform: ${visible ? 'scale(1)' : 'scale(0)'};
    transition: ${`0.3s ${EASE_FUNCTION} transform, ${
      visible ? 0.1 : 0.2
    }s opacity`};
  `};
`;

export const Title = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});

  ${robotoRegular()};
`;

export const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  & .material-button {
    margin-right: 16px;

    &:last-child {
      margin-right: 0px;
    }
  }
`;
