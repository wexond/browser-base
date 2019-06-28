import styled, { css } from 'styled-components';
import { platform } from 'os';

export const StyledContainer = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
  ${({ isFullscreen }: { isFullscreen: boolean }) => css`
    margin-left: ${platform() === 'darwin' && !isFullscreen ? 68 : 0}px;
  `};
`;
