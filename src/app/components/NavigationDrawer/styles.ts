import styled from 'styled-components';
import { typography } from 'nersent-ui';
import images from '../../../shared/mixins/images';
import shadows from '../../../shared/mixins/shadows';

export interface StyledProps {
  visible: boolean;
  contentVisible: boolean;
}

const getRight = (props: StyledProps) => {
  if (!props.visible) {
    return '-320px';
  }
  return 0;
};

export const Styled = styled.div`
  height: 100%;
  position: fixed;
  display: flex;
  top: 0;
  background-color: white;
  z-index: 9999;
  transition: 0.2s ease-out right;
  box-sizing: border-box;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: ${shadows(16)};

  right: ${(props: StyledProps) => getRight(props)};
`;

export const Title = styled.div`
  font-size: 20px;
  margin-left: 16px;
  margin-top: 18px;
  margin-bottom: 10px;
  opacity: 0.87;

  letter-spacing: 0.007rem;
  ${typography.robotoMedium()};
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 8px;
`;

interface DarkProps {
  visible: boolean;
}

export const Dark = styled.div`
  background-color: rgba(0, 0, 0, 0.54);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  transition: 0.2s opacity;

  opacity: ${(props: DarkProps) => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;

export const NavContent = styled.div`
  width: 300px;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
`;

interface ContentProps {
  visible: boolean;
}

export const Content = styled.div`
  height: 100%;
  max-width: calc(640px + 64px);
  transition: 0.2s ease-out width;
  overflow: auto;

  width: ${(props: ContentProps) => (props.visible ? 'calc(100vw - 128px - 300px)' : 0)};
`;
