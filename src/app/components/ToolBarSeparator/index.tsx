import styled from 'styled-components';
import { transparency } from 'nersent-ui';

export default styled.div`
  height: calc(100% - 24px);
  min-width: 1px;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
  margin-left: 8px;
  margin-right: 8px;

  background-color: ${props =>
    (props.theme.toolbar.foreground === 'white'
      ? `rgba(255, 255, 255, ${transparency.dark.dividers})`
      : `rgba(0, 0, 0, ${transparency.light.dividers})`)};
`;
