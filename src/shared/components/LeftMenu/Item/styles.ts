import styled from 'styled-components';
import { typography } from 'nersent-ui';
import images from '../../../mixins/images';

interface ItemProps {
  visible: boolean;
  selected: boolean;
}

export const StyledItem = styled.div`
  height: 48px;
  position: relative;
  align-items: center;
  padding-right: 16px;
  cursor: pointer;

  display: ${(props: ItemProps) => (props.visible ? 'flex' : 'none')};
  pointer-events: ${props => (props.selected ? 'none' : 'auto')};

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

interface IconProps {
  image: string;
  subItem: boolean;
  selected: boolean;
}

export const Icon = styled.div`
  height: 24px;
  width: 24px;

  ${images.center('20px', '20px')};
  background-image: ${(props: IconProps) => `url(${props.image})`};
  margin-left: ${props => (props.subItem ? '88px' : '64px')};
  opacity: ${props => (props.selected ? 1 : 0.7)};
`;

interface TitleProps {
  selected: boolean;
}

export const Title = styled.div`
  font-size: 14px;
  margin-left: 24px;

  opacity: ${(props: TitleProps) => (props.selected ? 1 : 0.7)};
  ${props => (props.selected ? typography.robotoMedium() : typography.robotoRegular())};
`;

interface IndicatorProps {
  visible: boolean;
}

export const Indicator = styled.div`
  background-color: #2196f3;
  width: 4px;
  height: 32px;
  border-radius: 5px;
  position: absolute;
  left: 40px;

  display: ${(props: IndicatorProps) => (props.visible ? 'block' : 'none')};
`;
