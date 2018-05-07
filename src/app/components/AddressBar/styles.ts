import styled from 'styled-components';
import { Theme } from '../../models/theme';
import images from '../../../shared/mixins/images';

interface AddressBarProps {
  visible: boolean;
  suggestionsVisible: boolean;
}

export const StyledAddressBar = styled.div`
  position: absolute;
  width: 100%;
  transition: 0.2s opacity;
  z-index: 10;
  max-width: 640px;
  left: 50%;
  border-radius: 20px;
  overflow: hidden;
  background-color: white;
  transition: 0.2s height, 0.2s box-shadow, 0.2s opacity, 0.2s transform;
  top: calc(50% - 18px);

  height: ${(props: AddressBarProps) => (props.suggestionsVisible ? 'auto' : '34px')};
  border: ${props => (!props.suggestionsVisible ? '1px solid rgba(0, 0, 0, 0.12)' : 'none')};
  box-shadow: ${props =>
    (props.suggestionsVisible ? '0 5px 10px 2px rgba(0, 0, 0, 0.12)' : 'none')};
  transform: translate(-50%) ${props => (props.visible ? 'scale(1)' : 'scale(1.1)')};
  opacity: ${(props: AddressBarProps) => (props.visible ? 1 : 0)};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;

interface InputProps {
  visible: boolean;
  theme?: Theme;
}

export const Input = styled.input`
  width: 100%;
  font-size: 13px;
  padding-left: 16px;
  outline: none;
  border: none;
  position: relative;
  height: 32px;

  ::placeholder {
    color: ${(props: InputProps) => props.theme.searchBar.placeholderColor};
  }
`;

interface InputContainerProps {
  suggestionsVisible: boolean;
}

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${(props: InputContainerProps) => (props.suggestionsVisible ? '48px' : '34px')};
  transition: 0.2s height;
`;

interface IconProps {
  image: string;
}

export const Icon = styled.div`
  background-image: url(${(props: IconProps) => props.image});
  ${images.center('100%', '100%')};
  width: 20px;
  height: 20px;
  margin-left: 16px;
  opacity: 0.5;
`;
