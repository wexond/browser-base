import styled from 'styled-components';

import typography from '../../../../shared/mixins/typography';
import images from '../../../../shared/mixins/images';
import shadows from '../../../../shared/mixins/shadows';

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

export const IconsContainer = styled.div`
  width: ${WORKSPACE_FOLDER_SIZE}px;
  height: ${WORKSPACE_FOLDER_SIZE}px;
  background-color: rgba(255, 255, 255, 0.79);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: ${shadows(3)};
`;

export interface IconProps {
  src: string;
}

export const Icon = styled.div`
  min-width: ${WORKSPACE_ICON_SIZE}px;
  min-height: ${WORKSPACE_ICON_SIZE}px;
  max-width: ${WORKSPACE_ICON_SIZE}px;
  max-height: ${WORKSPACE_ICON_SIZE}px;
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
