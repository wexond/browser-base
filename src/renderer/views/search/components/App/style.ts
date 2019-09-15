import styled, { css } from 'styled-components';
import { centerIcon } from '~/renderer/mixins';
import { icons } from '~/renderer/constants';
import { ITheme } from '~/interfaces';

export const StyledApp = styled.div`
  margin: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  transition: 0.15s opacity, 0.15s margin-top;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 2 : 8}px;
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

export const SearchIcon = styled.div`
  width: 18px;
  height: 18px;
  ${centerIcon()};
  background-image: url(${icons.search});
  margin-left: 16px;
  opacity: 0.54;

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['searchBox.input.lightForeground']
      ? 'invert(100%)'
      : 'none'};
  `}
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['searchBox.input.backgroundColor']};
  `}
`;
