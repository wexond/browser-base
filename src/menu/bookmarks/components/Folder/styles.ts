import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

const folderIcon = require('../../../../shared/icons/folder.svg');

export const Root = styled.div`
  width: 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 16px;
  text-align: center;

  &:first-child {
    margin-left: 0px;
  }
`;

export const Icon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  opacity: ${opacity.light.activeIcon};
  background-image: url(${folderIcon});

  ${images.center('100%', 'auto')};
`;

export const Label = styled.div`
  display: flex;
  margin-top: 2px;
  font-size: 13px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoMedium()};
`;
