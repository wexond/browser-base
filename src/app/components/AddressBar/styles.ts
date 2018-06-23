import styled from 'styled-components';
import images from '../../../shared/mixins/images';
import opacity from '../../../shared/defaults/opacity';
import { Theme } from '../../../shared/models/theme';

interface AddressBarProps {
  visible: boolean;
  suggestionsVisible: boolean;
}

export const StyledAddressBar = styled.div`
  position: absolute;
  width: 100%;
  transition: 0.2s opacity, 0.2s transform;
  z-index: 10;
  max-width: 640px;
  left: 50%;
  overflow: hidden;
  background-color: white;

  height: ${(props: AddressBarProps) => (props.suggestionsVisible ? 'auto' : '34px')};
  border-radius: ${props => (props.suggestionsVisible ? '10px' : '20px')};
  border: ${props =>
    (!props.suggestionsVisible ? `1px solid rgba(0, 0, 0, ${opacity.light.dividers})` : 'none')};
  box-shadow: ${props =>
    (props.suggestionsVisible
      ? '0 2px 15px 1px rgba(60,64,67,0.08), 0 1px 20px 1px rgba(60,64,67,0.16)'
      : 'none')};
  top: ${props => (props.suggestionsVisible ? '6px' : 'calc(50% - 34px / 2)')};
  transform: translateX(-50%) ${props => (props.visible ? 'scale(1)' : 'scale(1.1)')};
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
    color: ${(props: InputProps) => props.theme.addressBarInput.placeholderColor};
  }
`;

interface InputContainerProps {
  suggestionsVisible: boolean;
}

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${(props: InputContainerProps) => (props.suggestionsVisible ? '41px' : '34px')};
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
