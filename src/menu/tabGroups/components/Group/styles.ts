import styled from 'styled-components';

import opacity from '../../../../shared/defaults/opacity';
import colors from '../../../../shared/defaults/colors';

import typography from '../../../../shared/mixins/typography';
import shadows from '../../../../shared/mixins/shadows';
import images from '../../../../shared/mixins/images';

const expandIcon = require('../../../../shared/icons/expand.svg');

export const StyledGroup = styled.div`
  min-height: 48px;
  background-color: #fff;
  margin-top: 32px;
  border-radius: 2px;
  font-size: 15px;
  position: relative;

  box-shadow: ${shadows(3)};
`;

export const Bar = styled.div`
  height: 48px;
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

  background-color: ${colors.blue['500']};
  opacity: ${(props: IBorderProps) => (props.selected ? 1 : 0)};
`;

export const Title = styled.div`
  margin-left: 24px;

  opacity: ${opacity.light.primaryText};
  ${typography.robotoMedium};
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
  transform: rotate(${(props: IExpandProps) => (props.expanded ? 180 : 0)}deg);
  ${images.center('24px', 'auto')};
`;

export interface IContentProps {
  expanded: boolean;
}

export const Content = styled.div`
  overflow: hidden;

  height: ${(props: IContentProps) => (props.expanded ? 'auto' : '0px')};
`;
