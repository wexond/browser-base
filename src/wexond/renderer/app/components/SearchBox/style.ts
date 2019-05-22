import styled, { css } from 'styled-components';
import { centerIcon } from '~/shared/mixins';
import { icons } from '../../constants';

import { Theme } from '../../models/theme';
import { transparency } from '~/renderer/constants';

export const StyledSearchBox = styled.div`
  margin-top: 48px;
  z-index: 2;

  border-radius: 23px;
  margin-bottom: 32px;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  min-height: 42px;
  transition: 0.2s height;

  ${({ theme }: { theme?: Theme }) => css`
    background-color: ${theme['overlay.section.backgroundColor']};
  `}
`;

export const SearchIcon = styled.div`
  ${centerIcon()};
  background-image: url(${icons.search});
  height: 18px;
  min-width: 18px;
  margin-left: 16px;

  ${({ theme }: { theme?: Theme }) => css`
    filter: ${theme['overlay.foreground'] === 'light'
      ? 'invert(100%)'
      : 'none'};
  `}
`;

export const Input = styled.input`
  height: 100%;
  flex: 1;
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  margin-left: 12px;
  margin-right: 16px;

  ${({ theme }: { theme?: Theme }) => css`
    color: ${theme['overlay.foreground'] === 'light'
      ? 'white'
      : `rgba(0, 0, 0, ${transparency.text.high})`};

    &::placeholder {
      color: rgba(255, 255, 255, 0.54);

      color: ${theme['overlay.foreground'] === 'light'
        ? `rgba(255, 255, 255, ${transparency.text.medium})`
        : `rgba(0, 0, 0, ${transparency.text.medium})`};
    }
  `}
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 42px;
  height: 42px;
`;
