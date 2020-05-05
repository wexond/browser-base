import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces';
import { hexToRgb } from '~/utils';

export const StyledAddressBarContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  will-change: transform, opacity;
  z-index: 999;
  align-items: center;
  padding-left: 72px;
  padding-right: 40px;
  transition: 0.1s transform, 0.1s opacity;

  ${({ visible, theme }: { visible: boolean; theme?: ITheme }) => css`
    display: ${visible ? 'flex' : 'table'};
    opacity: ${visible ? 1 : 0};
    transform: scale(${visible ? 1 : 1.05});
    pointer-events: ${visible ? 'inherit' : 'none'};
    -webkit-app-region: no-drag;
    background-color: ${() => {
      const { r, g, b } = hexToRgb(theme['titlebar.backgroundColor']);
      return `rgba(${r}, ${g}, ${b}, 0.75)`;
    }};
  `}
`;
