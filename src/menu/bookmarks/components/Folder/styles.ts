import styled from 'styled-components';

import images from '../../../../shared/mixins/images';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

const folderIcon = require('../../../../shared/icons/folder.svg');

export const Root = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-flow: column;
  width: 100px;
  height: 100px;
  margin-left: 24px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
  cursor: pointer;

  &:first-child {
    margin-left: 0px;
  }
`;

export const Icon = styled.div`
  width: 36px;
  height: 36px;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${folderIcon});

  ${images.center('100%', 'auto')};
`;

export const Label = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  margin-top: 8px;

  ${typography.robotoMedium()};
`;
