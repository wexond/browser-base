import styled from 'styled-components';
import { Align } from '../../../shared/enums';
import positioning from '../../../shared/mixins/positioning';

export const ItemsContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  position: fixed;
  z-index: 101;
  justify-content: center;

  ${positioning.center(Align.CenterVertical)};
`;

export const Dark = styled.div`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.79);
`;
