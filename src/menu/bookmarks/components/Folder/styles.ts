import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

const folderIcon = require('../../../../shared/icons/folder.svg');

export const Root = styled.div`
  align-items: center;
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 32px;
  margin-left: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;

  &:first-child {
    margin-left: 0px;
  }
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${folderIcon});

  ${images.center('100%', 'auto')};
`;

export const Label = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});

  margin-left: 16px;

  ${typography.robotoMedium()};
`;
