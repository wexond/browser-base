import styled from 'styled-components';
import { TOOLBAR_HEIGHT } from '../../constants';

export const Buttons = styled.div`
  display: flex;
  position: absolute;
  height: ${TOOLBAR_HEIGHT}px;
  right: 0;
  top: 0;
  z-index: 9999;
`;
