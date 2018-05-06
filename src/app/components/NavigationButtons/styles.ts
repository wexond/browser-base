import styled from 'styled-components';
import { Platforms } from '../../enums';
import Store from '../../store';

interface ContainerProps {
  isFullscreen: boolean;
}

export const StyledContainer = styled.div`
  margin-left: ${(props: ContainerProps) =>
    (!props.isFullscreen && Store.platform === Platforms.MacOS ? 72 : 0)}px;
  display: flex;
  -webkit-app-region: no-drag;
`;
