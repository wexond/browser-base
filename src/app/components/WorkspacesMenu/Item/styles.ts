import styled, { css } from 'styled-components';

import typography from '../../../../shared/mixins/typography';
import images from '../../../../shared/mixins/images';
import shadows from '../../../../shared/mixins/shadows';
import colors from '../../../../shared/defaults/colors';
import opacity from '../../../../shared/defaults/opacity';

import { WORKSPACE_FOLDER_SIZE, WORKSPACE_ICON_SIZE } from '../../../constants';

const closeIcon = require('../../../../shared/icons/close.svg');

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  text-align: center;
  margin-left: 32px;
  position: relative;
  cursor: pointer;

  &:first-child {
    margin-left: 0px;
  }

  &:hover .delete-icon {
    opacity: 1;
  }
`;

export const DeleteIcon = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #fff;
  border-radius: 100%;
  background-image: url(${closeIcon});
  box-shadow: ${shadows(2)};
  opacity: 0;
  transition: 0.2s opacity;

  ${images.center('16px', 'auto')};
`;

export const IconsContainer = styled.div`
  width: ${WORKSPACE_FOLDER_SIZE}px;
  height: ${WORKSPACE_FOLDER_SIZE}px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px;
  box-shadow: ${shadows(3)};

  ${({ selected }: { selected: boolean }) => {
    if (selected) {
      return `border: 3px solid ${colors.blue['500']}`;
    }
    return '';
  }};
`;

export const Icon = styled.div`
  width: ${WORKSPACE_ICON_SIZE}px;
  height: ${WORKSPACE_ICON_SIZE}px;
  display: flex;
  margin: 4px;

  ${images.center('100%', 'auto')};
  background-image: url(${({ src }: { src: string }) => src});
`;

export const Label = styled.div`
  white-space: nowrap;
  color: #fff;
  margin-top: 8px;
  padding: 4px;
  border-radius: 4px;
  cursor: text;
  ${typography.subtitle2()};

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

export const Input = styled.input`
  width: 100%;
  width: 100%;
  border: none;
  outline: none;
  margin: 0;
  padding: 4px;
  -webkit-text-fill-color: transparent;
  background-color: transparent;
  font-size: 14px;
  text-align: center;
  text-shadow: ${`0px 0px 0px rgba(0, 0, 0,${opacity.light.primaryText})`};
  color: ${colors.blue['500']};
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #fff;
  border-radius: 4px;
  will-change: opacity;
  transition: 0.2s opacity, 0.2s z-index;

  ${typography.robotoRegular()};

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    z-index: ${visible ? 1 : -2};
  `};

  &::placeholder {
    opacity: ${opacity.light.secondaryText};
  }
`;
