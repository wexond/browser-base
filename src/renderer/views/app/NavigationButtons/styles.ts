import styled, { css } from 'styled-components';
import { Platforms } from '../../../../enums';
import store from '../../../store';

export const StyledContainer = styled.div`
  display: flex;
  -webkit-app-region: no-drag;

  ${({ isFullscreen }: { isFullscreen: boolean }) => css`
    margin-left: ${isFullscreen && store.platform === Platforms.MacOS
      ? 0
      : 72}px;
  `};
`;
