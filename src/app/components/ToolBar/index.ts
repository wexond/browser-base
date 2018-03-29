import styled from 'styled-components';
import { shadows } from 'nersent-ui';

// Constants and defaults
import { TOOLBAR_HEIGHT } from '../../constants/design';

// Models
import Theme from '../../models/theme';

interface Props {
  theme?: Theme;
}

export default styled.div`
  position: relative;
  z-index: 10;
  height: ${TOOLBAR_HEIGHT}px;
  display: flex;
  background-color: ${(props: Props) => props.theme.toolbar.background};
  color: ${props => (props.theme.toolbar.foreground === 'light' ? '#fff' : '#000')};

  box-shadow: ${(props) => {
    if (typeof props.theme.toolbar.shadow === 'boolean') {
      return props.theme.toolbar.shadow ? shadows[2] : 'none';
    }
    return props.theme.toolbar.shadow;
  }};
`;
