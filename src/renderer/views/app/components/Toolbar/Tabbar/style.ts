import styled from 'styled-components';

import { ToolbarButton } from '../ToolbarButton';
import { TOOLBAR_BUTTON_WIDTH, TABBAR_HEIGHT } from '../../../constants';

export const StyledTabbar = styled.div`
  height: ${TABBAR_HEIGHT}px;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #eee;
  transition: 0.3s opacity, 0.3s transform;
  margin-right: 32px;
  display: flex;
`;

export const TabsContainer = styled.div`
  height: calc(100% - 4px);
  flex: 1;
  margin-right: ${TOOLBAR_BUTTON_WIDTH}px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 4px;
  display: flex;
  margin-top: auto;
`;

export const AddTab = styled(ToolbarButton)`
  position: absolute;
  left: 0;
  top: 4px;
  height: calc(100% - 4px);
`;

export const Handle = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 0px;
  -webkit-app-region: drag;
`;
