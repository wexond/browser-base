import styled from 'styled-components';
import { transparency } from '~/renderer/defaults';

export default styled.div`
  height: calc(100% - 20px);
  min-width: 1px;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
  margin-left: 8px;
  margin-right: 8px;

  background-color: rgba(0, 0, 0, ${transparency.light.dividers});
`;
