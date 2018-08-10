import styled from 'styled-components';

import { Platforms } from '../../../../enums';
import store from '../../../store';

export const StyledContainer = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
  margin-left: ${store.platform === Platforms.MacOS ? 72 : 0}px;
`;
