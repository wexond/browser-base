import styled from 'styled-components';
import { Section } from '../Overlay/style';

export const Item = styled(Section)`
  margin-top: 56px;
  padding: 0px 0px 8px 0px;

  &:first-child {
    margin-top: 48px;
  }
`;

export const Label = styled.div`
  font-size: 16px;
  padding: 24px;
`;
