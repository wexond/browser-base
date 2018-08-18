import styled from 'styled-components';

import { WORKSPACE_FOLDER_SIZE } from 'constants/';
import { icons } from 'defaults/icons';
import { centerImage } from 'mixins';

export const Root = styled.div`
  width: ${WORKSPACE_FOLDER_SIZE}px;
  height: ${WORKSPACE_FOLDER_SIZE}px;
  margin-left: 32px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.39);
  transition: 0.2s border;

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.79);

    & .icon {
      opacity: 0.79;
    }
  }
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${icons.add});
  opacity: 0.39;
  transition: 0.2s opacity;
  filter: invert(100%);

  ${centerImage('100%', 'auto')};
`;
