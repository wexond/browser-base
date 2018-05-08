import styled from 'styled-components';
import { typography } from 'nersent-ui';
import images from '../../../mixins/images';

interface ItemProps {
  visible: boolean;
  selected: boolean;
  fullWidth: boolean;
}

export const StyledItem = styled.div`
  height: 48px;
  position: relative;
  align-items: center;
  cursor: pointer;
  overflow: hidden;

  width: ${(props: ItemProps) => (props.fullWidth ? 'calc(100% - 16px)' : '100%')};
  padding-right: ${props => (props.fullWidth ? '16px' : '0px')};
  display: ${props => (props.visible ? 'flex' : 'none')};
  pointer-events: ${props => (props.selected ? 'none' : 'auto')};

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

interface IconProps {
  image: string;
  subItem: boolean;
  selected: boolean;
  fullWidth: boolean;
}

const getIconSize = (props: IconProps) => (props.fullWidth ? 24 : 20);

const getIconMargin = (props: IconProps) => {
  if (!props.fullWidth) return 'auto';
  return props.subItem ? '88px' : '64px';
};

export const Icon = styled.div`
  height: ${(props: IconProps) => getIconSize(props)}px;
  width: ${props => getIconSize(props)}px;
  background-image: ${props => `url(${props.image})`};

  margin-left: ${props => getIconMargin(props)};
  margin-right: ${props => (props.fullWidth ? 'unset' : 'auto')};

  opacity: ${props => (props.selected ? 1 : 0.7)};

  ${props => images.center(`${getIconSize(props)}px`, 'auto')};
`;

interface TitleProps {
  selected: boolean;
  fullWidth: boolean;
}

export const Title = styled.div`
  font-size: 14px;
  margin-left: 24px;

  opacity: ${(props: TitleProps) => (props.selected ? 1 : 0.7)};
  ${props => (props.selected ? typography.robotoMedium() : typography.robotoRegular())};
  display: ${props => (props.fullWidth ? 'flex' : 'none')};
`;

interface IndicatorProps {
  visible: boolean;
  fullWidth: boolean;
}

export const Indicator = styled.div`
  background-color: #2196f3;
  width: 4px;
  height: 32px;
  border-radius: 5px;
  position: absolute;
  transition: 0.2s ease-out left;

  display: ${(props: IndicatorProps) => (props.visible ? 'block' : 'none')};
  left: ${props => (props.fullWidth ? '40px' : '0px')};
`;
