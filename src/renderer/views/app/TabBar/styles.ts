import styled from 'styled-components';
import { TOOLBAR_BUTTON_WIDTH } from '../../../../constants';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - 32px);
  position: relative;
  overflow: hidden;
`;

export const AddTab = styled.div`
  height: 100%;
  width: ${TOOLBAR_BUTTON_WIDTH}px;
  position: absolute;
  top: 0;
`;

export const Indicator = styled.div`
  height: 2px;
  position: absolute;
  bottom: 0;
  background-color: black;
`;
