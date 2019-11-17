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
