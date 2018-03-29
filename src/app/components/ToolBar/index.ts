import styled from 'styled-components';

// Constants and defaults
import { TOOLBAR_HEIGHT } from '../../constants/design';

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${TOOLBAR_HEIGHT}px;
  display: flex;
  background-color: ${props => props.theme.toolbar.background};
  color: ${props => props.theme.toolbar.foreground};
`;
