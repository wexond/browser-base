import styled from 'styled-components';
import images from '../../../../shared/mixins/images';
import colors from '../../../../shared/defaults/colors';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

interface ItemProps {
  visible: boolean;
  selected: boolean;
}

export const StyledItem = styled.div`
  height: 48px;
  position: relative;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  width: 100%;
  padding-right: 16px;
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
  mask-image: ${props => `url(${props.image})`};

  margin-left: ${(props: IconProps) => (props.subItem ? '40px' : '16px')};
  background-color: ${props => (props.selected ? colors.blue['500'] : '#000')};

  opacity: ${props => (props.selected ? 1 : 0.5)};
`;

interface TitleProps {
  selected: boolean;
}

export const Title = styled.div`
  font-size: 14px;
  margin-left: 32px;

  opacity: ${(props: TitleProps) => (props.selected ? 1 : opacity.light.primaryText)};
  ${typography.robotoMedium()};
  display: 'flex';
  color: ${props => (props.selected ? colors.blue['500'] : '#000')};
`;

interface BackgroundProps {
  selected: boolean;
}

export const Background = styled.div`
  background: ${(props: BackgroundProps) => (props.selected ? colors.blue['500'] : 'none')};
  opacity: 0.15;
  position: absolute;
  width: calc(100% - 16px);
  border-radius: 4px;
  left: 50%;
  top: 50%;
  height: calc(100% - 8px);
  transform: translate(-50%, -50%);
`;
