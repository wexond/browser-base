import styled from 'styled-components';
import { transparency } from '~/renderer/defaults';

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

export const Line = styled.div`
  background-color: rgba(0, 0, 0, ${transparency.light.dividers});
  height: 1px;
  width: 100%;
`;
