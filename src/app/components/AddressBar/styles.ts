import styled from "styled-components";

interface IStyledAddressBarProps {
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

  opacity: ${(props: IStyledAddressBarProps) => (props.visible ? 1 : 0)};
`;

interface IInputProps {
  visible: boolean;
}

export const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  width: 100%;
  height: 32px;
  max-width: 680px;
  left: 50%;
  font-size: 13px;
  transform: translateX(-50%);
  padding-left: 16px;
  color: black;
  border: none;
  outline: none;
  position: relative;

  -webkit-app-region: ${(props: IInputProps) =>
    props.visible ? "no-drag" : "drag"};
`;