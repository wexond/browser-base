import styled from 'styled-components';
import { shadows } from 'nersent-ui';

// Models
import Theme from '../../models/theme';

interface Props {
  theme?: Theme;
}

export default styled.div`
  position: relative;
  z-index: 100;
  display: flex;

  background-color: ${(props: Props) => props.theme.toolbar.background};
  color: ${(props: Props) => (props.theme.toolbar.foreground === 'light' ? '#fff' : '#000')};
  box-shadow: ${(props: Props) => {
    if (typeof props.theme.toolbar.shadow === 'boolean') {
      return props.theme.toolbar.shadow ? shadows[2] : 'none';
    }
    return props.theme.toolbar.shadow;
  }};
  height: ${(props: Props) => props.theme.toolbar.height}px;
`;
