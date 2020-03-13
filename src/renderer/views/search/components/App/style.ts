import styled, { css } from 'styled-components';
import { centerIcon } from '~/renderer/mixins';
import { BLUE_300 } from '~/renderer/constants';
import { ITheme } from '~/interfaces';
import { DialogStyle, DIALOG_BOX_SHADOW } from '~/renderer/mixins/dialogs';

export const StyledApp = styled(DialogStyle)`
  margin-top: 10px;
  box-shadow: 0 0 0 3px ${BLUE_300}, ${DIALOG_BOX_SHADOW};
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

export const Input = styled.input.attrs(() => ({
  spellCheck: false,
}))`
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
