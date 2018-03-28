import styled from 'styled-components';

// Constants and defaults
import { TOOLBAR_HEIGHT } from '../../constants/design';
import Theme from '../../models/theme';

interface IProps {
  theme: Theme;
}

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${TOOLBAR_HEIGHT}px;
  display: flex;
  background-color: ${(props: IProps) => props.theme.toolbar.background};
  color: ${props => props.theme.toolbar.foreground};
`;
