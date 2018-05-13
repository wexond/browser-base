import styled from 'styled-components';
import { typography } from 'nersent-ui';

export const Content = styled.div`
  max-width: 640px;
  width: calc(100% - 64px);
  padding-bottom: 32px;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
`;

export const Title = styled.div`
  ${typography.robotoMedium()};
  font-size: 32px;
  opacity: 0.87;
  margin-top: 56px;
  margin-left: 64px;
`;
