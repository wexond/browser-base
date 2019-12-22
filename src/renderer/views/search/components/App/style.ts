import styled, { css } from 'styled-components';
import { centerIcon, shadows } from '~/renderer/mixins';
import { icons, BLUE_500, BLUE_300 } from '~/renderer/constants';
import { ITheme } from '~/interfaces';

export const StyledApp = styled.div`
  margin: 8px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  transition: 0.15s opacity, 0.15s margin-top;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 2 : 6}px;
    box-shadow: 0 0 0 2px
        ${theme['searchBox.input.lightForeground'] ? BLUE_500 : BLUE_300},
      ${shadows(4)};
  `}
`;

export const Title = styled.div`
  font-size: 16px;
`;

export const Subtitle = styled.div`
  font-size: 13px;
  opacity: 0.54;
  margin-top: 8px;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: 16px;
  float: right;
`;

export const Input = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 300;
  font-family: Roboto;
  padding-left: 16px;
  padding-right: 8px;
  height: 42px;
  background-color: transparent;

  ${({ theme }: { theme?: ITheme }) => css`
    color: ${theme['searchBox.input.textColor']};

    &::placeholder {
      color: ${theme['searchBox.input.lightForeground']
        ? 'rgba(255, 255, 255, 0.54)'
        : 'rgba(0, 0, 0, 0.54)'};
    }
  `}
`;

export const CurrentIcon = styled.div`
  width: 18px;
  height: 18px;
  ${centerIcon()};
  margin-left: 16px;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['searchBox.input.backgroundColor']};
  `}
`;
