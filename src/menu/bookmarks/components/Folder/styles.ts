import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

const folderIcon = require('../../../../shared/icons/folder.svg');
const openFolderIcon = require('../../../../shared/icons/open-folder.svg');

export const Root = styled.div`
  align-items: center;
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 32px;
  margin-left: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: 0.15s border;

  &:first-child {
    margin-left: 0px;
  }

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.12);

    & .icon {
      background-image: url(${openFolderIcon});
    }
  }
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${folderIcon});
  transition: 0.1s background-image;

  ${images.center('100%', 'auto')};
`;

export const Label = styled.div`
  font-size: 13px;
  margin-left: 16px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});

  ${typography.robotoMedium()};
`;
