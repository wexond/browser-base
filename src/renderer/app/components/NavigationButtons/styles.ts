import styled, { css } from 'styled-components';
import store from '@app/store';
import { Platforms } from '~/enums';

export const StyledContainer = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
  ${({ isFullscreen }: { isFullscreen: boolean }) => css`
    margin-left: ${store.platform === Platforms.MacOS && !isFullscreen
      ? 72
      : 0}px;
  `};
`;
