import styled from "styled-components";

interface IProps {
  inline?: boolean;
}

export default styled.div`
  display: flex;
  ${(props: IProps) => `
    flex-flow: ${props.inline ? "row" : "column"};
  `} flex: 1;
`;
