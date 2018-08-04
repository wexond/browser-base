import styled from 'styled-components';
import { opacity } from '../../../../defaults';

export interface SeparatorProps {
  animation: boolean;
  visible: boolean;
}

export const StyledSeparator = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: rgba(0, 0, 0, ${opacity.light.dividers});
  height: 1px;
  width: 100%;
  transition: 0.2s opacity;

  opacity: ${({ animation }: SeparatorProps) => (animation ? 1 : 0)};
  display: ${({ visible }) => (!visible ? 'none' : 'block')};
`;
