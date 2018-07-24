import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../defaults/opacity';
import typography from '../../mixins/typography';
import images from '../../mixins/images';

const dropDownIcon = require('../../icons/drop-down.svg');

export const Root = styled.div`
  width: 128px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  padding-left: 16px;
  padding-right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Selected = styled.div`
  font-size: 14px;

  ${typography.robotoRegular()};
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${dropDownIcon});

  ${images.center('24px', 'auto')};
`;
