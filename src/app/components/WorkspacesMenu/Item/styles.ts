import styled from 'styled-components';

import typography from '../../../../shared/mixins/typography';
import images from '../../../../shared/mixins/images';
import shadows from '../../../../shared/mixins/shadows';
import colors from '../../../../shared/defaults/colors';

import { WORKSPACE_FOLDER_SIZE, WORKSPACE_ICON_SIZE } from '../../../constants';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  text-align: center;
  margin-left: 32px;

  &:first-child {
    margin-left: 0px;
  }
`;

export interface IconsContainerProps {
  selected: boolean;
}

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

  ${({ selected }: IconsContainerProps) => {
    if (selected) {
      return `border: 3px solid ${colors.blue['500']}`;
    }
    return '';
  }};
`;

export interface IconProps {
  src: string;
}

export const Icon = styled.div`
  width: ${WORKSPACE_ICON_SIZE}px;
  height: ${WORKSPACE_ICON_SIZE}px;
  display: flex;
  margin: 4px;

  ${images.center('100%', 'auto')};
  background-image: url(${({ src }: IconProps) => src});
`;

export const Label = styled.div`
  width: 100%;
  white-space: nowrap;
  color: #fff;
  font-size: 14px;
  margin-top: 12px;

  ${typography.robotoMedium()};
`;
