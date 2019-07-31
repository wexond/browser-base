import styled from 'styled-components';

export const StyledApp = styled.div`
  margin: 16px;
  padding: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 8px;
  background: white;
`;

export const Title = styled.div`
  font-size: 16px;
`;

export const Container = styled.div`
  padding: 8px 0px;

  & .textfield {
    margin-top: 12px;
  }
`;

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  margin-top: 16px;
  float: right;
`;
