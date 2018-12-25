import styled from 'styled-components';
import { transparency } from '~/renderer/constants';

export const Line = styled.div`
  background-color: rgba(0, 0, 0, ${transparency.dividers});
  height: 1px;
  width: 100%;
`;
