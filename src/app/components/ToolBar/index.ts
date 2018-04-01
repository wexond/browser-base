import { shadows } from 'nersent-ui';
import styled from 'styled-components';
import Theme from '../../models/theme';
import { getForegroundColor } from '../../utils/colors';

interface Props {
  theme?: Theme;
}

export default styled.div`
  position: relative;
  z-index: 100;
  display: flex;

  background-color: ${(props: Props) => props.theme.toolbar.background};
  color: ${(props: Props) => getForegroundColor('text-primary', props.theme.toolbar)};
  box-shadow: ${(props: Props) => {
    const { shadow } = props.theme.toolbar;
    if (typeof shadow === 'boolean') {
      return shadow ? shadows[2] : 'none';
    }
    return shadow;
  }};
  height: ${(props: Props) => props.theme.toolbar.height}px;
`;
