import styled, { css } from 'styled-components';
import { transparency } from '~/renderer/constants';

export const Line = styled.div`
  background-color: rgba(0, 0, 0, ${transparency.dividers});
  height: 1px;
  width: 100%;
  z-index: 2;
  position: relative;
`;

export const Screenshot = styled.div`
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  flex: 1;
  filter: blur(20px);
  margin: -20px;
  position: relative;
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;
