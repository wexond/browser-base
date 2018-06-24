import styled from 'styled-components';

import opacity from '../../../../shared/defaults/opacity';
import colors from '../../../../shared/defaults/colors';

import typography from '../../../../shared/mixins/typography';
import shadows from '../../../../shared/mixins/shadows';
import images from '../../../../shared/mixins/images';

const expandIcon = require('../../../../shared/icons/expand.svg');

export const StyledGroup = styled.div`
  min-height: 56px;
  background-color: #fff;
  margin-top: 32px;
  border-radius: 4px;
  font-size: 16px;
  position: relative;

  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;

export const Bar = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export interface IBorderProps {
  selected: boolean;
}

export const Border = styled.div`
  height: 100%;
  width: 3px;
  position: absolute;
  left: 0;
  transition: 0.5s opacity;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;

  background-color: ${colors.blue['500']};
  opacity: ${({ selected }: IBorderProps) => (selected ? 1 : 0)};
`;

export const Title = styled.div`
  margin-left: 24px;

  opacity: ${opacity.light.primaryText};
  ${typography.robotoRegular};
`;

export interface IExpandProps {
  expanded: boolean;
}

export const Expand = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 16px;
  cursor: pointer;
  transition: 0.2s ease-out transform;

  background-image: url(${expandIcon});
  transform: rotate(${({ expanded }: IExpandProps) => (expanded ? 180 : 0)}deg);
  ${images.center('24px', 'auto')};
`;

export interface IContentProps {
  expanded: boolean;
}

export const Content = styled.div`
  overflow: hidden;
  transition: 0.2s all;

  max-height: ${({ expanded }: IContentProps) => (expanded ? 'auto' : '0px')};
  height: 100%;
`;
