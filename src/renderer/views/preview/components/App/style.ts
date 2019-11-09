import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import { maxLines } from '~/renderer/mixins';

export const StyledApp = styled.div`
  margin: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  transition: 0.2s opacity, 0.2s margin-top;
  padding: 16px;
  font-size: 13px;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    opacity: ${visible ? 1 : 0};
    margin-top: ${visible ? 0 : 7}px;
    background-color: ${theme['dialog.backgroundColor']};
    color: ${theme['dialog.textColor']};
  `}
`;

export const Title = styled.div`
  font-weight: 500;
  line-height: 1.3rem;
  ${maxLines(2)};
`;

export const Domain = styled.div`
  opacity: 0.54;
  font-weight: 300;
  line-height: 1.3rem;
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
