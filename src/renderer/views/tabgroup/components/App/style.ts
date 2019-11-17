import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';

export const StyledApp = styled.div`
  margin: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: 0.2s opacity, 0.2s margin-top;
  padding: 16px;
  background-color: white;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 0 : 7}px;
  `}
`;

// background-color: ${theme['dialog.backgroundColor']};

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

export const Colors = styled.div`
  display: flex;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Color = styled.div`
  min-width: 16px;
  height: 16px;
  cursor: pointer;
  border-radius: 16px;
  margin-right: 4px;
  margin-left: 4px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;

  ${({ color }: { color: string }) => css`
    background-color: ${color};
  `}

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    background-color: white;
  }

  &:hover {
    &:after {
      opacity: 0.3;
    }
  }
`;
