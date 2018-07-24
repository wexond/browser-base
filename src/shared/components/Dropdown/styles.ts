import * as React from 'react';
import styled, { css } from 'styled-components';

import opacity from '../../defaults/opacity';
import typography from '../../mixins/typography';
import images from '../../mixins/images';
import shadows from '../../mixins/shadows';
import { EASE_FUNCTION } from '../../constants';

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

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  will-change: transform;
  transition: 0.3s transform;
  opacity: ${opacity.light.inactiveIcon};
  background-image: url(${dropDownIcon});

  ${images.center('24px', 'auto')};

  ${({ activated }: { activated: boolean }) => `
    transform: rotate(${activated ? 180 : 0}deg);
  `};
`;

export const List = styled.div`
  width: 100%;
  max-height: 144px;
  position: absolute;
  top: 100%;
  left: 0;
  overflow: hidden;
  background-color: #fff;
  border-radius: 4px;
  will-change: max-height;
  opacity: 0;
  transition: 0.5s max-height ${EASE_FUNCTION}, 0.2s opacity;
  box-shadow: ${shadows(7)};

  ${({ activated }: { activated: boolean }) => `
    max-height: ${activated ? 144 : 0}px;
    opacity: ${activated ? 1 : 0};
  `};
`;
