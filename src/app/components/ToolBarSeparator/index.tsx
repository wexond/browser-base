import styled from 'styled-components';
import { transparency } from 'nersent-ui';

// Models
import Theme from '../../models/theme';

interface Props {
  theme?: Theme;
}

export default styled.div`
  height: calc(100% - 24px);
  min-width: 1px;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
  margin-left: 8px;
  margin-right: 8px;

  background-color: ${(props: Props) =>
    (props.theme.toolbar.foreground === 'light'
      ? `rgba(255, 255, 255, ${transparency.dark.dividers})`
      : `rgba(0, 0, 0, ${transparency.light.dividers})`)};
  display: ${(props: Props) => (props.theme.toolbar.separatorsVisible ? 'block' : 'none')};
`;
