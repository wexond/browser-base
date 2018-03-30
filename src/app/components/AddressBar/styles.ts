import styled from 'styled-components';
import { transparency } from 'nersent-ui';

// Models
import Theme from '../../models/theme';

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
  align-items: center;

  opacity: ${(props: AddressBarProps) => (props.visible ? 1 : 0)};
  -webkit-app-region: ${props => (props.visible ? 'no-drag' : '')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;

interface InputProps {
  visible: boolean;
  theme?: Theme;
}

export const Input = styled.input`
  border-radius: 2px;
  width: calc(100% - 16px);
  font-size: 13px;
  padding-left: 16px;
  color: black;
  border: none;
  outline: none;
  position: relative;

  -webkit-app-region: ${(props: InputProps) => (props.visible ? 'no-drag' : 'drag')};
  color: ${props =>
    (props.theme.toolbar.foreground === 'light'
      ? `rgba(255, 255, 255, ${transparency.dark.text.primary})`
      : `rgba(0, 0, 0, ${transparency.light.text.primary})`)};
  ::placeholder {
    color: ${props =>
    (props.theme.toolbar.foreground === 'light'
      ? `rgba(255, 255, 255, ${transparency.dark.text.primary})`
      : `rgba(0, 0, 0, ${transparency.light.text.primary})`)};
    opacity: ${props =>
    (props.theme.toolbar.foreground === 'light'
      ? transparency.dark.text.secondary
      : transparency.light.text.secondary)};
  }
  background-color: ${props =>
    (props.theme.searchBar.background === 'light'
      ? `rgba(255, 255, 255, ${transparency.dark.dividers})`
      : `rgba(0, 0, 0, ${transparency.light.dividers})`)};
  height: ${(props: InputProps) => props.theme.searchBar.height}px;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 680px;
  left: 50%;
  transform: translateX(-50%);
`;
