import { transparency } from 'nersent-ui';
import styled from 'styled-components';
import { TOOLBAR_HEIGHT } from '../../constants/design';

export default styled.div`
  position: relative;
  z-index: 100;
  display: flex;

  background-color: #fafafa;
  color: rgba(0, 0, 0, ${transparency.light.text.primary});
  height: ${TOOLBAR_HEIGHT}px;
`;
