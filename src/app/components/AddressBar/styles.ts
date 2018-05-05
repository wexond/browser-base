import { transparency, shadows } from 'nersent-ui';
import styled from 'styled-components';
import { Theme } from '../../models/theme';

interface AddressBarProps {
  visible: boolean;
}

export const StyledAddressBar = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: 0.2s opacity;
  display: flex;
  z-index: 10;

  opacity: ${(props: AddressBarProps) => (props.visible ? 1 : 0)};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;

interface InputProps {
  visible: boolean;
  theme?: Theme;
  suggestionsVisible: boolean;
}

export const Input = styled.input`
  width: 100%;
  font-size: 13px;
  padding-left: 16px;
  outline: none;
  border: none;
  position: relative;
  transition: 0.2s height;

  -webkit-app-region: ${(props: InputProps) => (props.visible ? 'no-drag' : 'drag')};
  height: ${props => (props.suggestionsVisible ? '42px' : '30px')};

  ::placeholder {
    color: ${(props: InputProps) => props.theme.searchBar.placeholderColor};
  }
`;

interface InputContainerProps {
  suggestionsVisible: boolean;
}

export const InputContainer = styled.div`
  position: absolute;
  width: 100%;
  max-width: 640px;
  left: 50%;
  transform: translate(-50%, -16px);
  border-radius: 20px;
  overflow: hidden;
  background-color: white;
  top: 50%;
  transition: 0.2s height;

  height: ${(props: InputContainerProps) => (props.suggestionsVisible ? 'auto' : '32px')};
  border: ${props => (!props.suggestionsVisible ? '1px solid rgba(0, 0, 0, 0.12)' : 'none')};
  box-shadow: ${props => (props.suggestionsVisible ? shadows[4] : 'none')};
`;
