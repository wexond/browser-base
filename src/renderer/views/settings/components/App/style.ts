import styled, { css } from 'styled-components';

import { robotoMedium, robotoLight } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const Title = styled.div`
  font-size: 14px;
  ${robotoMedium()};
`;

export const Header = styled.div`
  margin-top: 4px;
  margin-bottom: 16px;
  font-size: 20px;
  ${robotoLight()};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 48px;

  cursor: pointer;
  &:last-of-type {
    border: none;
  }

  ${({ theme }: { theme?: ITheme }) => css`
    border-bottom: 1px solid
      ${theme['pages.lightForeground']
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)'};
  `}
`;

export const Control = styled.div`
  margin-left: auto;
`;

export const SecondaryText = styled.div`
  opacity: 0.54;
  font-weight: 400;
  margin-top: 4px;
  font-size: 12px;
`;
