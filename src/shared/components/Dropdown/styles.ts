import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import opacity from '../../defaults/opacity';
import typography from '../../mixins/typography';
import images from '../../mixins/images';
import shadows from '../../mixins/shadows';

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
  cursor: pointer;
  position: relative;
`;

export const Name = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, ${opacity.light.primaryText});

  ${typography.robotoRegular()};
`;

export interface IconProps {
  activated: boolean;
}

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  will-change: transform;
  transition: 0.2s ease-out transform;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${dropDownIcon});

  ${images.center('24px', 'auto')};
  transform: rotate(${({ activated }: IconProps) => (activated ? 180 : 0)});
`;

export const List = styled.div`
  width: 100%;
  max-height: 144px;
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: ${shadows(7)};
`;
