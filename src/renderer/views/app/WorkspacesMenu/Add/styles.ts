import styled from 'styled-components';
import { WORKSPACE_FOLDER_SIZE } from '../../../../constants';
import images from '../../../../mixins/images';
import icons from '../../../../mixins/icons';

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
  background-image: url(${addIcon});
  opacity: 0.39;
  transition: 0.2s opacity;

  ${images.center('100%', 'auto')};
  ${icons.invertColors()};
`;
