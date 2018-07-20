import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

const folderIcon = require('../../../../shared/icons/folder.svg');
const openFolderIcon = require('../../../../shared/icons/open-folder.svg');

export const Root = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-flow: column;
  width: 96px;
  height: 96px;
  margin-left: 24px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
  cursor: pointer;

  &:first-child {
    margin-left: 0px;
  }

  &:hover {
    & .icon {
      background-image: url(${openFolderIcon});
    }
  }
`;

export const Icon = styled.div`
  width: 36px;
  height: 36px;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${folderIcon});
  transition: 0.1s background-image;

  ${images.center('100%', 'auto')};
`;

export const Label = styled.div`
  margin-top: 8px;
  ${typography.body2()};
`;
